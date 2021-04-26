/*
 * Author: Alejandro Asensio <alejandro.asensio@bsc.es>
 * Created at: 2020-06-23 13:42
 * 
 * Description: This script extracts all annotations from human indexers in the phase 1 (indexing) and phase 2 (validation).
 * 
 * Usage:
 * $ mongo bsccnio01.bsc.es extract-all-annotations.js
 * $ mongoexport --host=bsccnio01.bsc.es --collection=all_annotations --db=BvSalud --type=csv --fields=annotatorName,documentId,decsCode,timestamp,validated --out=all_annotations.csv
 * $ mongoexport --host=bsccnio01.bsc.es --collection=all_annotations_uniq --db=BvSalud --type=csv --fields=annotatorName,documentId,decsCode --out=all_annotations_uniq.csv
 */

// connection to required databases
var bvsalud = db.getSiblingDB('BvSalud')

// previuos drop to ensure clean output collection
bvsalud.all_annotations.drop()
bvsalud.all_annotations_uniq.drop()

// elaborate the all_annotations collection (with desired field names and values)
var annotation_collections = [
    bvsalud.annotations,
    bvsalud.annotations_validated,
]
annotation_collections.forEach(function (collection) {
    collection.aggregate([

        // look for annotators fullnames
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: 'id',
                as: 'fromUsers'
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$fromUsers', 0] }, '$$ROOT'] } }
        },

        // rename fields, get the timestamp of each annotation and determine if the annoation has been validated
        {
            $set: {
                annotatorId: '$id',
                annotatorName: '$fullname',
                documentId: '$doc',
                timestamp: { $dateToString: { date: { $toDate: '$_id' } } },
                validated: collection.getName() == 'annotations_validated',
            }
        },
        { $match : { annotatorId : /^A/ } },
        { $project: { fromUsers: 0 } },
        { $project: { _id: 0, annotatorId: 1, annotatorName: 1, documentId: 1, decsCode: 1, timestamp: 1, validated: 1, } },
        { $merge: { into: 'all_annotations' } },
    ])
})

bvsalud.all_annotations_uniq.createIndex({ 'annotatorName': 1, 'documentId': 1, 'decsCode': 1 }, { unique: true })
bvsalud.all_annotations.aggregate([
    { $project: { _id: 0, timestamp: 0, validated: 0 } },
    { $merge: { into: 'all_annotations_uniq', on: ['annotatorName', 'documentId', 'decsCode'] } }
])
