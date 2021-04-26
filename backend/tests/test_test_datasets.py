'''
Author: alejandro.asensio@bsc.es

Sanity checks for the test datasets of mesinesp task.
'''

import pytest

from constants import KEYS, ID_KEY, PREFIX
from datasets import (
    training_original,
    training_preprocessed,
    development_official,
    development_coredescriptors,
    test_official,
    test_coredescriptors,
    test_without_annotations,
)
import helpers

checking_datasets = [
    training_original,
    training_preprocessed,
    development_official,
    development_coredescriptors,
]


def test_ids_have_prefix():
    assert helpers.have_prefix(test_official, ID_KEY, PREFIX)
    assert helpers.have_prefix(test_coredescriptors, ID_KEY, PREFIX)
    assert helpers.have_prefix(test_without_annotations, ID_KEY, PREFIX)


def test_no_duplicate_documents():
    assert helpers.has_no_duplicates(test_official, KEYS)
    assert helpers.has_no_duplicates(test_coredescriptors, KEYS)
    assert helpers.has_no_duplicates(test_without_annotations, KEYS)


def test_not_present_in():
    # There are some documents in test set that are present in training set
    # so the asserts have `not` boolean modifier.
    assert not helpers.is_not_present_in(test_official, checking_datasets)
    assert not helpers.is_not_present_in(
        test_coredescriptors, checking_datasets)
    assert not helpers.is_not_present_in(
        test_without_annotations, checking_datasets)
