'''
author: https://github.com/aasensios

This script checks if all documents in the extracted development and test (gold standard) sets,
regarding its title and abstract pair, are present in the used documents file.
'''

import csv
import json

all_annotations_file = '/home/alejandro/Documents/mesinesp/v2/all_annotations.tsv'
used_documents_file = '/home/alejandro/Documents/mesinesp/v2/used_documents.json'
development_set_file = '/home/alejandro/Documents/mesinesp/v2/mesinesp-development-set-official-union.json'
gold_standard_file = '/home/alejandro/Documents/mesinesp/v2/test_set_with_annotations_v2.json'

annotators = [
    "Angélica Novillo",
    "Francisca Valero",
    "Mónica Aldea",
    "Fabiola Triviño Güiza",
    "Carlos Hortal Muñoz",
    "Luis Quevedo",
    "Carolina Suárez Medina",
]

with open(all_annotations_file) as csvfile:
    reader = csv.DictReader(csvfile, dialect=csv.excel_tab)
    annotations = [row for row in reader if row.get('annotatorName') in annotators]
    ids = [ann.get('documentId') for ann in annotations]
    ids = list(set(ids))

with open(used_documents_file) as f:
    used_documents = json.load(f).get('articles')
used_documents_hash_list = [(document.get('title'), document.get('abstractText')) for document in used_documents]
used_ids = [document.get('id') for document in used_documents]
not_found = [doc_id for doc_id in used_ids if doc_id not in ids]
print(f'ids not found in used documents file: {len(not_found)}')

with open(development_set_file) as f:
    development_set = json.load(f).get('articles')
development_hash_list = [(document.get('title'), document.get('abstractText')) for document in development_set]
not_found = [pair for pair in development_hash_list if pair not in used_documents_hash_list]
print(f'errors in development set: {len(not_found)}')

with open(gold_standard_file) as f:
    gold_standard_set = json.load(f).get('articles')
gold_standard_hash_list = [(document.get('title'), document.get('abstractText')) for document in gold_standard_set]
not_found = [pair for pair in gold_standard_hash_list if pair not in used_documents_hash_list]
print(f'errors in gold_standard set: {len(not_found)}')
