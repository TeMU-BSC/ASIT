'''
Author: alejandro.asensio@bsc.es

Sanity checks for the evaluation datasets of mesinesp task.
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
    evaluation,
)
import helpers

excluding_datasets = [
    training_original,
    training_preprocessed,
    development_official,
    development_coredescriptors,
]
including_datasets = [
    test_without_annotations,
    background,
]


def test_ids_have_prefix():
    assert helpers.have_prefix(evaluation, ID_KEY, PREFIX)


def test_no_duplicate_documents():
    assert helpers.has_no_duplicates(evaluation, KEYS)


def test_not_present_in():
    # There are some documents in evaluation set that are present in training set
    # so the asserts have `not` boolean modifier.
    assert not helpers.is_not_present_in(evaluation, excluding_datasets)


def test_present_in():
    assert not helpers.is_not_present_in(evaluation, including_datasets)
