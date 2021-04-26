/*
 * Author: Alejandro Asensio <alejandro.asensio@bsc.es>
 * Created at: 2020-04-30 17:30
 * 
 * Description: This script extracts the background set from the MongoDB for
 * the MESINESP task.
 * 
 * Usage:
 * 
 * First, if you are not at the BSC office, connect through VPN to BSC:
 * $ sudo openfortivpn gw.bsc.es:443 -u USERNAME
 * 
 * Then, execute the JavaScript file with the mongo shell:
 * $ mongo <thisfilename>.js
 * 
 * GOTCHA: This script contains some syntax compatible with mongo version 4.2 onwards, such as $merge.
 * This script was run in localhost mongo version 4.2 like so:
 * $ mongo extract-background-set.js
 * 
 * And then uploaded to production mongo version 4.0 like so:
 * $ mongodump --archive --db=BvSalud --collection=ibecs_lilacs_es | mongorestore --host=bsccnio01.bsc.es --archive --db=BvSalud --collection=ibecs_lilacs_es
 * $ mongodump --archive --db=BvSalud --collection=background_set | mongorestore --host=bsccnio01.bsc.es --archive --db=BvSalud --collection=background_set
 * $ mongodump --archive --db=BvSalud --collection=background_subset_2019 | mongorestore --host=bsccnio01.bsc.es --archive --db=BvSalud --collection=background_subset_2019
 */

// constants
var MINIMUM_ABSTRACT_CHARACTERS = 200

// connection to required databases
var bvsalud = db.getSiblingDB('BvSalud')
var datasets = db.getSiblingDB('datasets')

// create a temporary database
var tmp = db.getSiblingDB('tmp')

// drop possible previuos existing collections
tmp.dropDatabase()
bvsalud.background_ibecs_lilacs_es.drop()
bvsalud.background_ibecs_lilacs_es_subset_2019.drop()
bvsalud.background_isciii_fis.drop()
bvsalud.background_reec.drop()
bvsalud.background_set.drop()

// get the ids of the valid and spanish abstract from `abstract_es` collection, which was previously crafted by ankush.rana@bsc.es
var valid_ids_es = bvsalud.abstract_es.distinct('_id', {
    $nor: [
        { ab_es: null },
        { ab_es: 'No disponible' }
    ]
})

// generate `articles_es` collection with only the valid documents with abstracts in spanish
bvsalud.all_articles.aggregate([
    { $match: { '_id': { $in: valid_ids_es } } },
    { $out: 'articles_es' }
])

// gather previous development and test sets to be later excluded from background set
var excluded_collections = [
    bvsalud.development_set_union,
    bvsalud.test_set_without_annotations
]
excluded_collections.forEach(function (collection) {
    collection.aggregate([
        { $merge: { into: { db: 'tmp', coll: 'excluded' } } }
    ])
})
var excluded_abstracts = tmp.excluded.distinct('abstractText')

// ibecs_lilacs_es background: articles with its abstract in spanish (es)
bvsalud.articles_es.aggregate([
    {
        $match: {
            // ignore the documents from the previous development and test sets
            'ab_es': { $nin: excluded_abstracts },
            // ignore the documents with an abstract of less than the minimum stablished length
            $expr: { $gte: [{ $strLenCP: "$ab_es" }, MINIMUM_ABSTRACT_CHARACTERS] }
        }
    },
    { $out: 'background_ibecs_lilacs_es' }
])

// background ibecs_lilacs es subset (publications from 2019 onwards)
bvsalud.background_ibecs_lilacs_es.aggregate([
    { $match: { entry_date: { '$gte': new Date('2019') } } },
    { $out: 'background_ibecs_lilacs_es_subset_2019' }
])

// isciii fis background
datasets.isciii.aggregate([
    { $match: { 'ab_es': { $nin: excluded_abstracts } } },
    { $merge: { into: { db: 'BvSalud', coll: 'background_isciii_fis' } } }
])

// reec background
datasets.reec.aggregate([
    { $match: { 'ab_es': { $nin: excluded_abstracts } } },
    { $merge: { into: { db: 'BvSalud', coll: 'background_reec' } } }
])

// remove duplicates regarding the pair fields: spanish title and spanish abstract
var target_collections = [
    bvsalud.background_ibecs_lilacs_es,
    bvsalud.background_ibecs_lilacs_es_subset_2019,
    bvsalud.background_isciii_fis,
    bvsalud.background_reec,
]
target_collections.forEach(function (collection) {
    collection.aggregate([
        {
            $group: {
                _id: { ti_es: "$ti_es", ab_es: "$ab_es" },
                duplicates: { $addToSet: "$_id" },
                count: { $sum: 1 }
            }
        },
        { $match: { count: { "$gt": 1 } } }
    ],
        { allowDiskUse: true }
    ).forEach(function (document) {
        document.duplicates.shift();
        collection.remove({ _id: { $in: document.duplicates } })
    })
})

// merge into a single background (with original field names)
var background_collections = [
    bvsalud.background_ibecs_lilacs_es_subset_2019,
    bvsalud.background_isciii_fis,
    bvsalud.background_reec
]
background_collections.forEach(function (collection) {
    collection.aggregate([
        { $merge: { into: { db: 'tmp', coll: 'background' } } }
    ])
})

// elaborate the background set (with desired field names)
tmp.background.aggregate([
    {
        $set: {
            id: '$_id',
            title: '$ti_es',
            abstractText: '$ab_es',
            journal: { $arrayElemAt: ['$ta', 0] },
            // db: { $ifNull: [ "$db", "null" ] },
            db: { $cond: [{ $eq: [{ $ifNull: ["$db", null] }, null] }, null, "$db"] },
            year: { $year: '$entry_date' },
            decsCodes: []
        }
    },
    {
        $project: {
            id: 1,
            title: 1,
            abstractText: 1,
            journal: 1,
            db: 1,
            year: 1,
            decsCodes: 1
        }
    },
    { $merge: { into: { db: 'BvSalud', coll: 'background_set' } } }
])

// remove the temporary database
tmp.dropDatabase()
