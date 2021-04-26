import json
import random
import string

from lorem_text import lorem

sources = [
    'ibecs',
    'lilacs',
    # 'portal fis',
    'reec',
    'google patents',
]
types = [
    'article',
    # 'health research project',
    'clinical study',
    'patent',
    ]
terminologies = [
    'decs',
    # 'hpo',
    # 'cie10',
    # 'snomedct',
]
mock_users = [
    {
        'fullname': 'Alice',
        'email': 'alice@indexer.app',
        'role': 'indexer',
        'password': 'passwd0fAl1c3',
    },
    {
        'fullname': 'Bob',
        'email': 'bob@indexer.app',
        'role': 'indexer',
        'password': 'passwd0fB0b',
    },
    {
        'fullname': 'Eve',
        'email': 'eve@indexer.app',
        'role': 'admin',
        'password': 'passwd0f3v3',
    }
]


def generate_mock_identifier(size=6, chars=string.ascii_uppercase + string.digits) -> str:
    return ''.join(random.choice(chars) for _ in range(size))


def generate_mock_items(item, amount: int) -> dict:
    items = list()
    if item == 'user':
        items = [mock_users[i] for i in range(amount)]
    if item == 'document':
        for _ in range(amount):
            items.append(dict(
                identifier=generate_mock_identifier(),
                title=lorem.words(random.randint(5, 7)),
                abstract=lorem.paragraph(),
                source=random.choice(sources),
                type=random.choice(types),
            ))
    if item == 'term':
        for _ in range(amount):
            items.append(dict(
                code=random.randint(1, 1000),
                name=lorem.words(1),
                terminology=random.choice(terminologies),
                description=lorem.words(random.randint(7, 13)),
                synonyms=lorem.words(random.randint(2, 5)).split(' '),
            ))
    return items
