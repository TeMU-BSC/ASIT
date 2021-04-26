mongoexport --host=bsccnio01.bsc.es --db=BvSalud --collection=background_set | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > background_set.json
mongoexport --host=bsccnio01.bsc.es --db=BvSalud --collection=test_set_without_annotations | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > test_set_without_annotations_v2.json
mongoexport --host=bsccnio01.bsc.es --db=BvSalud --collection=test_set_with_annotations_union | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > test_set_with_annotations_v2.json
mongoexport --host=bsccnio01.bsc.es --db=BvSalud --collection=evaluation_set | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > evaluation_set_v2.json
mongoexport --host=bsccnio01.bsc.es --db=BvSalud --collection=documents_in_dev_and_test | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > documents_in_dev_and_test_with_mappings.json
