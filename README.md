# Advanced Semantic Indexing Tool

Automatic assignation of labels to different types of documents, mainly in Spanish.

Supported labels:

- [DeCS](https://decs.bvsalud.org/es/) (Descriptores en Ciencias de la Salud), analog Spanish version of English MeSH terms
- [HPO](https://hpo.jax.org/) (Human Phenotype Ontology) _(future feature)_

Supported types of documents:

- Scientific articles from [IBECS](https://ibecs.isciii.es/) (Índice Bibliográfico Español en Ciencias de la Salud)
- Scientific articles from [LILACS](https://lilacs.bvsalud.org/) (Literatura Latinoamericana y del Caribe en Ciencias de la Salud)
- Clinical studies from [REec](https://reec.aemps.es/) (Registro Español de estudios clínicos)
- Health research projects from [Portal FIS](https://portalfis.isciii.es/) (Fondo de Investigación en Salud)
- Patents in Spanish from [Google Patents](https://patents.google.com/)

## Applications

ASIT is a web tool that aims to help indexer to label documents in a effective and  much faster way by giving the indexer suggestions of labels based on each document.

The main objective of indexing documents is to obtain a gold-standard set (i.e. annotated by humans) that maps the text within each document to some of those controlled labels.

## Implementation

This web tool has been built with the following technologies:

- [MongoDB](https://www.mongodb.com/) for database
- [Flask](https://flask.palletsprojects.com/en/1.1.x/) for backend
- [Angular](https://angular.io/) for frontend
- [NGINX](https://www.nginx.com/) for server and proxy
- [Docker Compose](https://docs.docker.com/compose/) for development and production deployment

## Deployment

In order to develop or deploy this application, docker-compose must be installed in your system.

### Development

```bash
git checkout development
git pull origin development
cd frontend && npm install && cd ..
docker-compose down
docker-compose up
```

> If no input file (`-f`) is specified, docker-compose uses `docker-compose.yml` by default.

### Staging (pre-production)

```bash
git checkout staging
git pull origin staging
docker-compose -f staging.yml down
docker-compose -f staging.yml up --build -d
```

### Production

```bash
git checkout master
git pull origin master
docker-compose -f production.yml down
docker-compose -f production.yml up --build -d
```
