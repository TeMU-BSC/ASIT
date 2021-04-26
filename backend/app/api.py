'''
This is the REST API for the Indexer web tool.

This backend is built with Flask and connects to a given MongoDB instance.

Author: alejandro.asensio@bsc.es
'''

# Standard library.
from bson import ObjectId
from collections import Counter, defaultdict
import copy
import csv
from datetime import datetime
from itertools import combinations
import json
import os
import random
import re
from statistics import mean

# Third parties.
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_paginate import Pagination, get_page_args
from flask_pymongo import PyMongo
from pymongo.errors import BulkWriteError, DuplicateKeyError

# Private modules.
from .utilities import iso_format
from .mock import generate_mock_items
from app import app


app.config['JSON_AS_ASCII'] = False
app.config['JSON_SORT_KEYS'] = False
app.config['MONGO_URI'] = os.environ.get('MONGO_URI')
CORS(app)
mongo = PyMongo(app)


@app.route('/')
def index():
    print('Hello from indexer flask API.')
    return jsonify(status='up')


@app.route('/generate-mock', methods=['POST'])
def generate_mock():
    user_count = request.json.get('user_count')
    document_count = request.json.get('document_count')
    term_count = request.json.get('term_count')
    mock_users = generate_mock_items('user', user_count)
    mock_documents = generate_mock_items('document', document_count)
    mock_terms = generate_mock_items('term', term_count)
    for user in mock_users:
        identifiers = [document.get('identifier') for document in mock_documents]
        user['assigned_document_identifiers'] = identifiers
    print(json.dumps(mock_users, indent=2))
    print(json.dumps(mock_documents, indent=2))
    print(json.dumps(mock_terms, indent=2))
    return jsonify(
        mock_users=mock_users,
        mock_documents=mock_documents,
        mock_terms=mock_terms,
    )


@app.route('/login', methods=['POST'])
def login():
    collection = 'users'
    email = request.json.get('email')
    password = request.json.get('password')
    user = mongo.db[collection].find_one({'email': email, 'password': password}, {'_id': 0})
    return jsonify(user)


@app.route('/doc/<identifier>', methods=['GET'])
def get_doc(identifier):
    doc = mongo.db.documents.find_one({'identifier': identifier}, {'_id': 0})
    return jsonify(doc)


@app.route('/docs/<email>', methods=['GET'])
def get_assigned_documents_to_user(email):
    user = mongo.db.users.find_one({'email': email})
    identifiers = user.get('assigned_document_identifiers')
    try:
        limit = int(request.args.get('page_size'))
    except:
        limit = 0
    try:
        skip = int(request.args.get('page_index')) * limit
    except:
        skip = 0
    found_documents = mongo.db.documents.find({'identifier': {'$in': identifiers}}, {'_id': 0})
    documents = list(found_documents.skip(skip).limit(limit))
    user_completions = mongo.db.completions.find_one({'user_email': email})
    completed_document_ids = list()
    if user_completions:
        completed_document_ids = user_completions.get('document_identifiers')
    total_document_count = found_documents.count()
    for document in documents:
        term_codes = mongo.db.annotations.distinct('term_code', {'document_identifier': document.get('identifier'), 'user_email': email})
        terms = mongo.db.terms.find({'code': {'$in': term_codes}})
        terms_with_str_ids = list()
        for term in terms:
            term['_id'] = str(term['_id'])
            terms_with_str_ids.append(term)
        document['terms'] = terms_with_str_ids
        document['completed'] = document.get('identifier') in completed_document_ids
    return jsonify(documents=documents, total_document_count=total_document_count)


# CRUD (Create, Read, Update, Delete) routes for items `user`, `document`, `term`, `annotation`.


@app.route('/<item>', methods=['POST'])
def create(item):
    collection = f'{item}s'
    success = False
    if isinstance(request.json, dict):
        document = request.json
        insertion_result = mongo.db[collection].insert_one(document)
        success = insertion_result.acknowledged
    elif isinstance(request.json, list):
        documents = request.json
        insert_many_result = mongo.db[collection].insert_many(documents)
        success = insert_many_result.acknowledged
    if success:
        message = f'{item}s inserted successfully'
    else:
        message = 'something went wrong'
    return jsonify(success=success, message=message)


@app.route('/<item>', methods=['GET'])
def read(item):
    collection = f'{item}s'
    query_filter = request.json
    is_multiple = request.args.get('multiple') == 'true'
    if is_multiple:
        limit = int(request.args.get('limit')) if request.args.get('limit') else 0
        documents = list(mongo.db[collection].find(query_filter, limit=limit))
        for document in documents:
            document['generation_time'] = iso_format(document['_id'])
            document['_id'] = str(document['_id'])
        response = documents
    else:
        document = mongo.db[collection].find_one(query_filter)
        if document:
            document['generation_time'] = iso_format(document['_id'])
            document['_id'] = str(document['_id'])
        response = document
    return jsonify(response)


@app.route('/<item>/<_id>', methods=['PUT'])
def update_one(item, _id):
    collection = f'{item}s'
    update_for_item = request.json
    updating_result = mongo.db[collection].update_one({'_id': ObjectId(_id)}, {'$set': update_for_item})
    return jsonify(success=updating_result.acknowledged)


@app.route('/<item>', methods=['DELETE'])
def delete_many(item):
    collection = f'{item}s'
    documents = request.json
    identifiers = [document.get('identifier') for document in documents]
    success = False
    if isinstance(request.json, list):
        deletion_result = mongo.db[collection].delete_many({'identifier': {'$in': identifiers}})
        success = deletion_result.acknowledged
    if success:
        message = f'{item}s deleted successfully'
    else:
        message = 'something went wrong'
    return jsonify(success=deletion_result.acknowledged, message=message)


@app.route('/mark-doc-as/<status>', methods=['POST'])
def mark_doc_as(status):
    '''Add a new doc into the 'docs' key in the 'completions' collection.'''
    doc_to_mark = request.json
    result = None
    if status == 'completed':
        result = mongo.db.completions.update_one(
            {'user_email': doc_to_mark['user_email']},
            {'$push': {'document_identifiers': request.json['document_identifier']}},
            upsert=True
        )
    if status == 'uncompleted':
        result = mongo.db.completions.update_one(
            {'user_email': doc_to_mark['user_email']},
            {'$pull': {'document_identifiers': doc_to_mark['document_identifier']}}
        )
    if status == 'validated':
        result = mongo.db.validations.update_one(
            {'user_email': doc_to_mark['user_email']},
            {'$push': {'document_identifiers': request.json['document_identifier']}},
            upsert=True
        )
    if status == 'unvalidated':
        result = mongo.db.validations.update_one(
            {'user_email': doc_to_mark['user_email']},
            {'$pull': {'document_identifiers': doc_to_mark['document_identifier']}}
        )
    return jsonify({'success': result.acknowledged})
