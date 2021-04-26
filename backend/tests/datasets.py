'''
Author: alejandro.asensio@bsc.es

Load the content of the datasets JSON files, trying to access the main key.
'''

import json
import os

from constants import DIR, MAIN_KEY

# training
with open('/home/alejandro/Downloads/MESINESP_ORIGINAL_TRAINING.json') as f:
    training_original = json.load(f).get(MAIN_KEY)
with open('/home/alejandro/Downloads/MESINESP_PREPROCESSED_TRAINING.json') as f:
    training_preprocessed = json.load(f).get(MAIN_KEY)

# development
with open(os.path.join(DIR, 'mesinesp-development-set-official-union.json')) as f:
    development_official = json.load(f).get(MAIN_KEY)
with open(os.path.join(DIR, 'mesinesp-development-set-core-descriptors-intersection.json')) as f:
    development_coredescriptors = json.load(f).get(MAIN_KEY)

# test
with open(os.path.join(DIR, 'mesinesp-test-set-with-annotations-official-union.json')) as f:
    test_official = json.load(f).get(MAIN_KEY)
with open(os.path.join(DIR, 'mesinesp-test-set-with-annotations-core-descriptors-intersection.json')) as f:
    test_coredescriptors = json.load(f).get(MAIN_KEY)
with open(os.path.join(DIR, 'mesinesp-test-set-without-annotations.json')) as f:
    test_without_annotations = json.load(f).get(MAIN_KEY)

# background
with open(os.path.join(DIR, 'mesinesp-background-set.json')) as f:
    background = json.load(f).get(MAIN_KEY)

# evaluation
with open(os.path.join(DIR, 'mesinesp-evaluation-set.json')) as f:
    evaluation = json.load(f).get(MAIN_KEY)
