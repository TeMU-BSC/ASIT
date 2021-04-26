'''
Author: alejandro.asensio@bsc.es

In this module there are some helper functions for the API and for the TESTS.
'''

from typing import List


def test_has_no_duplicates_dummy():
    '''This test should fail if two documents have the same title and abstractText.'''
    lst = [
        {'id': 1, 'title': 'A', 'abstractText': 'A content'},
        {'id': 2, 'title': 'B', 'abstractText': 'B content'},
        {'id': 3, 'title': 'B', 'abstractText': 'C content'},
        {'id': 4, 'title': 'A', 'abstractText': 'D content'},
    ]
    keys = ['title', 'abstractText']
    assert has_no_duplicates(lst, keys)


def keep_first(iterable, key=None):
    '''
    Generator of a unique elements in the given iterable, regarding  
    Source: https://stackoverflow.com/a/55317290

    Usage:
    lst = [
        {'category': 'software', 'name': 'irssi', 'version': '1.2.0'},
        {'category': 'software', 'name': 'irssi', 'version': '1.1.2'},
        {'category': 'software', 'name': 'hexchat', 'version': '2.14.2'}
    ]
    list(keep_first(lst, lambda d: (d['category'], d['name'])))

    Output:
    [{'category': 'software', 'name': 'irssi', 'version': '1.2.0'},
    {'category': 'software', 'name': 'hexchat', 'version': '2.14.2'}]
    '''
    if key is None:
        def key(x): return x

    seen = set()
    for elem in iterable:
        k = key(elem)
        if k in seen:
            continue

        yield elem
        seen.add(k)


def has_no_duplicates(dataset: List[dict], keys: List[str]) -> bool:
    '''Return true if there is no duplicate documents in dataset compared only
    by the specified keys; return false otherwise.'''
    unique_documents = list(keep_first(
        dataset, lambda d: (d[keys[0]], d[keys[1]])))
    no_duplicates = len(dataset) == len(unique_documents)
    return no_duplicates


def has_no_annotations(dataset: List[dict], key: str) -> bool:
    '''Return true if all the values of the specified key are falsy in every
    element in dataset. In other words, return true if there is no annotations
    in any document in dataset; return false otherwise.

    Hint: `key` might be `decsCodes`
    '''
    annotations = [document.get(key) for document in dataset]
    return not all(annotations)


def is_not_present_in(dataset: List[dict],
                      checking_datasets: List[List[dict]]) -> bool:
    '''Return true if any document in dataset is not present in any of
    checking datasets; return false otherwise.'''
    # compare both title and abstract
    titles = list()
    abstracts = list()
    for document in dataset:
        titles.append(document.get('title'))
        abstracts.append(document.get('abstractText'))

    found = False
    for cd in checking_datasets:
        for doc in cd:
            if doc.get('title') in titles and doc.get('abstractText') in abstracts:
                found = True

    not_present = not found
    return not_present


def have_prefix(dataset: List[dict], key: str, prefix: str) -> bool:
    '''Return true if all values in the specified key start with the given
    prefix; return false otherwise.'''
    return all([item.get(key).startswith(prefix) for item in dataset])
