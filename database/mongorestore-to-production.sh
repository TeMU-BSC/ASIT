mongodump --host=localhost --archive --db=BvSalud --collection=background_ibecs_lilacs_es | mongorestore --host=bsccnio01.bsc.es --archive --nsInclude=BvSalud.background_ibecs_lilacs_es
mongodump --host=localhost --archive --db=BvSalud --collection=background_ibecs_lilacs_es_subset_2019 | mongorestore --host=bsccnio01.bsc.es --archive --nsInclude=BvSalud.background_ibecs_lilacs_es_subset_2019
mongodump --host=localhost --archive --db=BvSalud --collection=background_isciii_fis | mongorestore --host=bsccnio01.bsc.es --archive --nsInclude=BvSalud.background_isciii_fis
mongodump --host=localhost --archive --db=BvSalud --collection=background_reec | mongorestore --host=bsccnio01.bsc.es --archive --nsInclude=BvSalud.background_reec
mongodump --host=localhost --archive --db=BvSalud --collection=background_set | mongorestore --host=bsccnio01.bsc.es --archive --nsInclude=BvSalud.background_set
mongodump --host=localhost --archive --db=BvSalud --collection=background_subset_2019 | mongorestore --host=bsccnio01.bsc.es --archive --nsInclude=BvSalud.background_subset_2019

mongodump --host=localhost --archive --db=BvSalud --collection=evaluation_set | mongorestore --host=bsccnio01.bsc.es --archive --nsInclude=BvSalud.evaluation_set

mongodump --host=localhost --archive --db=BvSalud --collection=test_set_with_annotations | mongorestore --host=bsccnio01.bsc.es --archive --nsInclude=BvSalud.test_set_with_annotations
mongodump --host=localhost --archive --db=BvSalud --collection=test_set_without_annotations | mongorestore --host=bsccnio01.bsc.es --archive --nsInclude=BvSalud.test_set_without_annotations
