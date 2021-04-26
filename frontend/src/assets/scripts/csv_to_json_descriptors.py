import csv
import json

csvfilepath = '../sourcedata/DeCS.2019.both.v5.tsv'
jsonfilepath = '../sourcedata/DeCS.2019.both.v5.json'

# Read the CSV file and add the data to a list
with open(csvfilepath) as csvfile:
    reader = csv.DictReader(csvfile, dialect=csv.excel_tab)
    descriptors = [row for row in reader]

# Write data to a JSON file
with open(jsonfilepath, 'w') as jsonfile:
    jsonfile.write(json.dumps(descriptors))
