import json
import random


SAMPLE_NUMBER = 17
SEED_NUMBER = 777
docs_path = '../sourcedata/luisquevedo.json'
users_path = '../uploads/users.json'
outputfile = '../uploads/assignments_testers.json'

with open(docs_path) as f:
    luisquevedo = json.load(f)

with open(users_path) as f:
    users = json.load(f)

# testers = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20', 'C21', 'C22', 'C23', 'C24', 'C25']
testers = [user for user in users if user.get('role') == 'tester']
spool = luisquevedo
assignments = list()
random.seed(SEED_NUMBER)
for tester in testers:
    sample = random.sample(spool, SAMPLE_NUMBER)
    for doc in sample:
        spool.remove(doc)
    assignments.append({'user': tester.get('id'), 'docs': sample})

with open(outputfile, 'w') as jsonfile:
    jsonfile.write(json.dumps(assignments, ensure_ascii=False).encode('utf8').decode())
