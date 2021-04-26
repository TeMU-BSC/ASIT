'''
Author: alejandro.asensio@bsc.es

Sanity checks for the background datasets of mesinesp task.
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
    background,
)
import helpers

checking_datasets = [
    training_original,
    training_preprocessed,
    development_official,
    development_coredescriptors,
    test_official,
    test_coredescriptors,
    test_without_annotations,
]


def test_ids_have_prefix():
    assert helpers.have_prefix(background, ID_KEY, PREFIX)


def test_no_duplicate_documents():
    assert helpers.has_no_duplicates(background, KEYS)


def test_not_present_in():
    # There are some documents in background set that are present in training set
    # so the asserts have `not` boolean modifier.
    assert not helpers.is_not_present_in(background, checking_datasets)
