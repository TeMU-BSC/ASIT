import json
import random


isciii_file = '../sourcedata/isciii.json'
reec_file = '../sourcedata/reec.json'
users_file = '../sourcedata/users_production.txt'
NUMBER_OF_DOCS = 37

with open(isciii_file) as f:
    isciii = f.read().splitlines()
isciii_ids = [json.loads(project)['_id'] for project in isciii]

with open(reec_file) as f:
    reec = f.read().splitlines()
reec_ids = [json.loads(case)['_id'] for case in reec]

random.seed(777)
assignments = list()
with open(users_file) as f:
    users_ids = f.read().splitlines()
for user_id in users_ids:
    isciii_sample = random.sample(isciii_ids, NUMBER_OF_DOCS)
    reec_sample = random.sample(reec_ids, NUMBER_OF_DOCS)
    assignments.append({'user': user_id, 'docs': isciii_sample + reec_sample})
    isciii_ids = list(set(isciii_ids) - set(isciii_sample))

print(json.dumps(assignments))
