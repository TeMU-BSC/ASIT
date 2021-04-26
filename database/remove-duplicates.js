var bvsalud = db.getSiblingDB('BvSalud')
var datasets = db.getSiblingDB('datasets')

var collections = [
    bvsalud.articles_es,
    datasets.isciii,
    datasets.reec
]
var duplicate_criteria = { ti_es: "$ti_es", ab_es: "$ab_es" }

collections.forEach(function (collection) {
    collection.aggregate(
        [
            {
                $group: {
                    _id: duplicate_criteria,
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
