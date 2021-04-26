import json
import random


docs_path = '../sourcedata/selected_importants_ids.json'
users_path = '../uploads/users.json'

with open(docs_path) as f:
    selected_importants_ids = json.load(f)

random.seed(777)
sample = random.sample(selected_importants_ids, 100)

with open(users_path) as f:
    users = json.load(f)

assignments = [{'user': user['id'], 'docs': sample} for user in users]
print(json.dumps(assignments))
