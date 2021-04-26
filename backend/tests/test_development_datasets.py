'''
Author: alejandro.asensio@bsc.es

Sanity checks for the development datasets of mesinesp task.
'''

import pytest

from constants import KEYS, ID_KEY, PREFIX
from datasets import (
    training_original,
    training_preprocessed,
    development_official,
    development_coredescriptors,
)
import helpers

checking_datasets = [
    training_original,
    training_preprocessed,
]


def test_ids_have_prefix():
    assert helpers.have_prefix(development_official, ID_KEY, PREFIX)
    assert helpers.have_prefix(development_coredescriptors, ID_KEY, PREFIX)


def test_no_duplicate_documents():
    assert helpers.has_no_duplicates(development_official, KEYS)
    assert helpers.has_no_duplicates(development_coredescriptors, KEYS)


def test_not_present_in():
    # There are some documents in development set that are present in training set,
    # so the asserts have `not` boolean modifier.
    assert not helpers.is_not_present_in(
        development_official, checking_datasets)
    assert not helpers.is_not_present_in(
        development_coredescriptors, checking_datasets)
