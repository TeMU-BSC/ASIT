'''
From: Alejandro Asensio <alejandro.asensio@bsc.es>
Date: Tue, Jun 16, 2020 at 5:51 PM
Subject: Re: BioASQ8 MESINESP task results
To: Martin Krallinger <krallinger.martin@gmail.com>
Cc: Carlos Rodriguez <crodriguezp@gmail.com>

Hola Martin,
No había visto los ficheros adjuntos de tu primer email, disculpa.
He comparado el fichero gold standard de Tasos con el fichero test set que generé en su momento:
- Ambos ficheros tienen el mismo número de artículos: 911.
- Los artículos en ambos ficheros son los mismos (mismo abstractText y mismo title), teniendo en cuenta que los artículos en el gold standard aparecen con ids distintos (entiendo que es para enmascararlos).
- Las etiquetas DeCS asociadas a cada artículo son las mismas.
La media de términos es:
- Development set: 13.1293 términos por artículo (750 artículos en total)
- Test set: 13.1339 términos por artículo (911 artículos en total)
¿Dónde tenemos publicado el test set sin etiquetas?
Alejandro Asensio
Web Developer at Barcelona Supercomputing Center

------
On Tue, Jun 16, 2020 at 12:01 PM Martin Krallinger <krallinger.martin@gmail.com> wrote:

Hola Alejandro,
pensé que ya te habia re-enviado el set que ha usado Tasos para evaluar, basado en elque usamos como test set.
Dudo que un salto de línea sea la cuestión de la diferencia entre los resultados, es poco probable.
Para saber que no hay problemas lo primero es comprobar si el Gold standard (de Tasosesta bien, o sea que corresponde a las etiquetas que deberían tener estos artículos y quetenemos nosotros publicados). Los artículos que usa para evaluar son los que tenemos definidosen nuestro gold standard test set? Los terminos que usan para evaluar son los mismos que tenemospara nuestro test set?
También la distribución de términos por artículos debería ser la misma entre el development y test set(media de términos indizados en el development y el test set debería ser parecida).
Hablamos por la tarde para ver como solucionarlo.
Martin 

'''

import csv
import json
import statistics

# /home/alejandro/code/decs-indexer/frontend/src/assets/sourcedata/DeCS.2019.both.v5.tsv
# with open('/home/alejandro/code/decs-indexer/frontend/src/assets/sourcedata/DeCS.2019.both.v5.tsv') as f:
#     reader = csv.DictReader(f, dialect=csv.excel_tab)
#     decs = list(reader)
#     codes = [item.get('decsCode') for item in decs]
#     print(len(codes))

with open('/home/alejandro/code/decs-indexer/backend/data/decs.json') as f:
    decs = json.load(f)
    codes = [item.get('decsCode') for item in decs]
    print(len(decs))

# temu sets
with open('/home/alejandro/Documents/mesinesp/mesinesp-datasets-and-mappings-v2/mesinesp-development-set-official-union.json') as f:
    dev_temu = json.load(f).get('articles')
    # print(len(dev_temu))

with open('/home/alejandro/Documents/mesinesp/mesinesp-datasets-and-mappings-v2/mesinesp-test-set-with-annotations-official-union.json') as f:
    test_temu = json.load(f).get('articles')
    # print(len(test_temu))

with open('/home/alejandro/Documents/mesinesp/mesinesp-datasets-and-mappings-v2/mesinesp-evaluation-set.json') as f:
    evaluation_temu = json.load(f).get('articles')
    # print(len(evaluation_temu))

# Tasos' sets
with open('/home/alejandro/Downloads/mesinesp-GoldStandard-test-set-official-union.json') as f:
    gold_standard = json.load(f).get('articles')
    # print(len(gold_standard))

with open('/home/alejandro/Downloads/Model 1.json') as f:
    model1 = json.load(f).get('documents')
    # print(len(model1))

# check all decs codes are the same between Tasos' gold standard file and our test set file
decs_compared = list()
for article in test_temu:
    for a in gold_standard:
        if article.get('abstractText') == a.get('abstractText') and article.get('title') == a.get('title'):
            decs_compared.append(article.get('decsCodes') == a.get('decsCodes'))
# print(all(decs_compared))

# compare Model 1 vs evaluation set (very slow execution, it lasts more than 1 minute)
evaluation_compared = list()
for article in evaluation_temu:
    for a in model1:
        if article.get('abstractText') == a.get('abstractText') and article.get('title') == a.get('title'):
            evaluation_compared.append(article.get('decsCodes') == a.get('decsCodes'))
# print(all(evaluation_compared))

# check decs codes length distribution similarity
dev_decs_lengths = [len(a.get('decsCodes')) for a in dev_temu]
# print(statistics.mean(dev_decs_lengths))

test_decs_lengths = [len(a.get('decsCodes')) for a in test_temu]
# print(statistics.mean(test_decs_lengths))

# check if all labels in Model 1 are present in decs official list
labels_in_official_decs = list()
wrong_labels = list()
for item in model1:
    for label in item.get('labels'):
        if label in codes:
            labels_in_official_decs.append(label)
        else:
            wrong_labels.append(label)
# print(all(labels_in_official_decs))
print(len(labels_in_official_decs))
print(len(wrong_labels))
