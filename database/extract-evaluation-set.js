/*
 * Author: Alejandro Asensio <alejandro.asensio@bsc.es>
 * Created at: 2020-04-30 17:30
 * 
 * Description: This script extracts the evaluation set from the MongoDB for
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
 * $ mongo extract-evaluation-set.js
 * 
 * And then uploaded to production mongo version 4.0 like so:
 * $ mongodump --archive --db=BvSalud --collection=evaluation_set | mongorestore --host=bsccnio01.bsc.es --archive --db=BvSalud --collection=evaluation_set
 */


// connection to required databases
var bvsalud = db.getSiblingDB('BvSalud')

// build the evaluation set = test set without annotations + background subset 2019
var member_collections = [
    bvsalud.test_set_without_annotations,
    bvsalud.background_set,
]
member_collections.forEach(function (collection) {
    collection.aggregate([
        { $merge: { into: { db: 'BvSalud', coll: 'evaluation_set' } } }
    ])
})
