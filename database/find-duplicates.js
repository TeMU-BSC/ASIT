// connection to required databases
var bvsalud = db.getSiblingDB('BvSalud')
var datasets = db.getSiblingDB('datasets')

// create a temporary database
var tmp = db.getSiblingDB('tmp')

// find on a single collection
// var duplicate_criteria = { ti_es: "$ti_es", ab_es: "$ab_es" }
var duplicate_criteria = { title: "$title", abstractText: "$abstractText" }
bvsalud.background.aggregate([
    {
        $group: {
            _id: duplicate_criteria,
            duplicates: { $addToSet: "$id" },
            count: { $sum: 1 }
        }
    },
    { $match: { count: { "$gt": 1 } } },
    { $sort: { count: -1 } },
    { $merge: { into: { db: 'tmp', coll: 'duplicates' } } }
],
    { allowDiskUse: true }
)

// console output
// printjson(`Duplicates found: ${tmp.duplicates.findOne().duplicates.length}`)

// remove the temporary database
// tmp.dropDatabase()

// ---------------------------------------------------------------------------

// collections with potential duplicates

// datasets.isciii
// datasets.reec
// bvsalud.all_articles
// bvsalud.articles_es
// bvsalud.abstract_es
// bvsalud.background_literature_es
// bvsalud.background_isciii_fis
// bvsalud.background_reec
// bvsalud.background_set
// bvsalud.background_subset_2019
