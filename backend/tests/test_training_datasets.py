'''
Author: alejandro.asensio@bsc.es

Sanity checks for the training datasets of mesinesp task.
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


def test_ids_have_prefix():
    # Expected to fail on training sets beacause prefix hadn't been taken into account,
    # so the asserts have `not` boolean modifier.
    assert not helpers.have_prefix(training_original, ID_KEY, PREFIX)
    assert not helpers.have_prefix(training_preprocessed, ID_KEY, PREFIX)
