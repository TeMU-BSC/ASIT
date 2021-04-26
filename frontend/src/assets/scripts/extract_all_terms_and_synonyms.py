import csv
import json
import re

with open('../sourcedata/DeCS.2019.both.v5.tsv') as csvfile:
    reader = csv.DictReader(csvfile, dialect=csv.excel_tab)
    descriptors = [row for row in reader]

with open('decs_terms_and_synonyms.tsv', 'w', newline='') as csvfile:
    fieldnames = ['code', 'term']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames, delimiter='\t')
    writer.writeheader()
    for d in descriptors:
        writer.writerow({'code': d['decsCode'], 'term': d['termSpanish'].lower()})
        synonyms = re.findall(r'(?<=\|)?[^|]+(?=\|)?', d['synonyms'])
        for s in synonyms:
            writer.writerow({'code': d['decsCode'], 'term': s.lower()})
