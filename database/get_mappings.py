'''
author: https://github.com/aasensios

This script maps the released (fake) id from development and test (gold standard) sets
to the original (real) id of each document, regarding its title and abstract pair as identifier.
'''

import json

source_documents_file = '/home/alejandro/Documents/mesinesp/v2/source_documents.json'
development_file = '/home/alejandro/Documents/mesinesp/v2/mesinesp-development-set-official-union.json'
gold_standard_file = '/home/alejandro/Documents/mesinesp/v2/test_set_with_annotations_v2.json'

with open(source_documents_file) as f:
    source = json.load(f).get('articles')
with open(development_file) as f:
    development_set = json.load(f).get('articles')
with open(gold_standard_file) as f:
    gold_standard_set = json.load(f).get('articles')

extracted_sets = development_set + gold_standard_set

source_dict = {(s.get('title'), s.get('abstractText')): s.get('id') for s in source}
extracted_dict = {(e.get('title'), e.get('abstractText')): e.get('id') for e in extracted_sets}

mappings = {v: source_dict.get(k) for k, v in extracted_dict.items()}

with open('mappings.json', 'w') as f:
    json.dump(mappings, f)
