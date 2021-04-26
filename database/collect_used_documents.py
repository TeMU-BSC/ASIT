'''
author: https://github.com/aasensios

This script generates a json file that contains the real id, title, abstract and source database
for each document present in the development and test sets of the MESINESP task.
'''

import csv
import json
from pymongo import MongoClient

client = MongoClient('mongodb://bsccnio01.bsc.es:27017/')
bvsalud = client.BvSalud
datasets = client.datasets

source_collections = [
    bvsalud.selected_importants,
    datasets.reec,
    datasets.isciii,
]

annotators = [
    "Angélica Novillo",
    "Francisca Valero",
    "Mónica Aldea",
    "Fabiola Triviño Güiza",
    "Carlos Hortal Muñoz",
    "Luis Quevedo",
    "Carolina Suárez Medina",
]

with open('/home/alejandro/Documents/mesinesp/v2/all_annotations.tsv') as csvfile:
    reader = csv.DictReader(csvfile, dialect=csv.excel_tab)
    annotations = [row for row in reader if row.get('annotatorName') in annotators]
    ids = [ann.get('documentId') for ann in annotations]
    ids = list(set(ids))

articles = list()
for collection in source_collections:
    for document in collection.find({'_id': {'$in': ids}}):
        article = {
            'id': document.get('_id'),
            'title': document.get('ti_es'),
            'abstractText': document.get('ab_es'),
            'source': document.get('db').upper() if collection.name == 'selected_importants' else collection.name.upper(),
        }
        articles.append(article)

with open('used_documents_oneline.json', 'w') as f:
    json.dump(articles, f, ensure_ascii=False)

# MANUAL FORMATTING in a linux terminal with jq and sed:
# $ cat used_documents_oneline.json | jq -c -S '.[]' | sed '/"_id":/s/"_id":[^,]*,//g; 1s/^/{"articles":[\n/; $s/$/\n]}/; $!s/$/,/' > used_documents.json

# store the documents in mongodb
bvsalud.used_documents.drop()
result = bvsalud.used_documents.insert_many(articles)
print(f'inserted documents in mongodb: {len(result.inserted_ids)}')
