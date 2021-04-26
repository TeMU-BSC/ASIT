/*
 * Author: Alejandro Asensio <alejandro.asensio@bsc.es>
 * Created at: 2020-07-03 14:26
 * 
 * Description: This script finds all assigned documents (id, title, abstractText) to the annotators in the indexing process.
 * 
 * Usage:
 * $ mongo bsccnio01.bsc.es find-assigned-documents.js
 * $ mongoexport --host=bsccnio01.bsc.es --db=BvSalud --collection=documents_assigned | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > documents_assigned.json
 */

var bvsalud = db.getSiblingDB('BvSalud')
var datasets = db.getSiblingDB('datasets')
var sources = [
    bvsalud.selected_importants,
    datasets.isciii,
    datasets.reec,
]
bvsalud.sources.drop()
sources.forEach(function (collection) {
    collection.aggregate([{ $merge: { into: 'sources'} }])
})
var assignedDocsIds = bvsalud.assignments.distinct('docs', { user: /^A/ })
// print(assignedDocsIds.length)

bvsalud.documents_assigned.drop()
bvsalud.sources.aggregate([
    { $match: { _id: { $in: assignedDocsIds } } },
    { $project: { id: '$_id', title: '$ti_es', abstractText: '$ab_es', } },
    { $merge: { into: 'documents_assigned' } }
])
// print(bvsalud.documents_assigned.count())
