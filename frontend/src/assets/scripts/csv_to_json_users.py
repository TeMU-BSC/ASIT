import csv
import json
import hashlib


csvfilepath = '../sourcedata/users.csv'
jsonfilepath = '../uploads/users.json'

# Read the CSV file and add the data to a list
with open(csvfilepath) as csvfile:
    reader = csv.DictReader(csvfile)
    users = [csvRow for csvRow in reader]
    # Build a unique hashed password
    for user in users:
        base = user['email']
        user['password'] = hashlib.md5(base.encode()).hexdigest()
        print(f"{user['id']},{user['fullname']},{user['email']},{user['password']},Herramienta web indización DeCS - muestra de 20 abstracts ({user['id']})")

# Write data to a JSON file
with open(jsonfilepath, 'w') as jsonfile:
    jsonfile.write(json.dumps(users, ensure_ascii=False).encode('utf8').decode())
