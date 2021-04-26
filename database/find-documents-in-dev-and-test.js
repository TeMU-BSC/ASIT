/*
 * Author: Alejandro Asensio <alejandro.asensio@bsc.es>
 * Created at: 2020-07-03 14:26
 * 
 * Description: This script finds all used documents (id, title, abstractText) in the indexing process.
 * 
 * Usage:
 * $ mongo bsccnio01.bsc.es find-documents-in-dev-and-test.js
 * $ mongoexport --host=bsccnio01.bsc.es --db=BvSalud --collection=documents_in_dev_and_test | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > documents_in_dev_and_test.json
 */

var bvsalud = db.getSiblingDB('BvSalud')
var datasets = db.getSiblingDB('datasets')
var assignedDocsIds = bvsalud.assignments.distinct('docs', { user: /^A/ })
var sources = [
    bvsalud.selected_importants,
    datasets.isciii,
    datasets.reec,
]
bvsalud.sources.drop()
sources.forEach(function (collection) {
    collection.aggregate([{ $merge: { into: 'sources' } }])
})

bvsalud.documents_in_dev_and_test.drop()
var sets = [
    bvsalud.development_set_union,
    bvsalud.test_set_with_annotations_union,
]
sets.forEach(function (collection) {
    collection.aggregate([
        {
            $lookup:
            {
                from: 'sources',
                let: { title: '$title', abstractText: '$abstractText' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and:
                                    [
                                        { $eq: ['$ti_es', '$$title'] },
                                        { $eq: ['$ab_es', '$$abstractText'] }
                                    ]
                            }
                        }
                    },
                    { $project: { realId: '$_id' } }
                ],
                as: 'originalDocData'
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$originalDocData', 0] }, '$$ROOT'] } }
        },
        { $project: { originalDocData: 0 } },
        {
            $project: {
                id: '$realId',
                title: 1,
                abstractText: 1,
            }
        },
        { $merge: { into: 'documents_in_dev_and_test' } }
    ])
})
