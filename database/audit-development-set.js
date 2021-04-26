/**
 * Usage:
 * $ mongo bsccnio01.bsc.es audit-development-set.js
 */

var bvsalud = db.getSiblingDB('BvSalud')
var jsoncontent = cat('./mappings-dev.json')
var mappings = JSON.parse(jsoncontent)
var devIds = mappings.map(m => m.real_id)

bvsalud.annotated_documents_per_user_in_development_set.drop()

bvsalud.annotations_validated.aggregate([

    // filter only annotations of documents in development set from suers with 'annotator' role (id starting by A)
    { $match: {doc: { $in: devIds }, user: /^A/ } },

    // count the documents per annotator
    { $group: { _id: '$user', docs: { $addToSet: '$doc' } } },

    // get the annotators names
    {
        $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'id',
            as: 'userInfo'
        }
    },
    {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$userInfo', 0] }, '$$ROOT'] } }
    },
    { $project: { userInfo: 0 } },

    // count the docs and rename some fields
    { $project: { _id: 1, annotatorName: '$fullname', annotatedDocuments: { $cond: { if: { $isArray: "$docs" }, then: { $size: "$docs" }, else: "NA" } } } },

    // export to a new collection
    { $out: 'annotated_documents_per_user_in_development_set' }
])

print(bvsalud.annotated_documents_per_user_in_development_set.distinct('doc').length)