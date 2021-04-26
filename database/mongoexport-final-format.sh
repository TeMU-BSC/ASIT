mongoexport --db=BvSalud --collection=background_subset_2019 | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > background_subset_2019.json
mongoexport --db=BvSalud --collection=test_set_without_annotations | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > test_set_without_annotations.json
mongoexport --db=BvSalud --collection=test_set_with_annotations | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > test_set_with_annotations.json
mongoexport --db=BvSalud --collection=evaluation_set | sed '/"_id":/s/"_id":[^,]*,//g; $!s/$/,/; 1s/^/{"articles": [/; $s/$/]}/' > evaluation_set.json
