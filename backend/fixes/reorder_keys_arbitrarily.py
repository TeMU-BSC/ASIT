'''
Author: alejandro.asensio@bsc.es

Script to reorder arbitrarily the keys of multiple objects in a JSON array file.

Postprocessing with `jq` shell JSON formatter:

# https://stedolan.github.io/jq/
# https://stedolan.github.io/jq/manual/v1.6/

$ sudo apt install jq
$ cat file.json | jq -c '.[]' | sed '1s/^/{"articles":[\n/; $s/$/\n]}/; $!s/$/,/'
'''

import json
import subprocess


# Change the following variables to adapt the script
MAIN_KEY = 'articles'
input_file = '/home/alejandro/Documents/mesinesp/mesinesp-datasets-and-mappings/mesinesp-development-set-official-union.json'
output_file_tmp = '/tmp/reordered.json'
output_file = './output.json'
desired_order_list = [
    'id',
    'title',
    'abstractText',
    'journal',
    'db',
    'year',
    'decsCodes'
]

with open(input_file) as f:
    docs = json.load(f).get(MAIN_KEY)

docs_reordered = list()
for doc in docs:
    docs_reordered.append({k: doc[k] for k in desired_order_list})

with open(output_file_tmp, 'w') as f:
    json.dump(docs_reordered, f)

bash_command = f'''
cat {output_file_tmp} | jq -c '.[]' | sed '/"_id":/s/"_id":[^,]*,//g; 1s/^/{{"articles":[\\n/; $s/$/\\n]}}/; $!s/$/,/' > {output_file} && rm {output_file_tmp}
'''
print(bash_command)
subprocess.call(['bash', '-c', bash_command])
