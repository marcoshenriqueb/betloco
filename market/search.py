from algoliasearch import algoliasearch
from django.conf import settings
from .models import Event
from .serializers import EventSerializer
from elasticsearch import helpers, Elasticsearch, ElasticsearchException
from django.utils import timezone

class Algolia():
    """search with Algolia"""
    def __init__(self):
        self.client = algoliasearch.Client(settings.ALGOLIA['APPLICATION_ID'], settings.ALGOLIA['API_KEY'])

    def indexEvents(self):
        index = self.client.init_index("events_" + settings.ALGOLIA['INDEX_SUFFIX'])
        index.set_settings({
            "attributesToIndex": ["title", "event_category",],
            "customRanking": ["desc(volume)", "desc(created_at)"]
        })
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        index.add_objects(serializer.data)

class ElasticSearch():
    """search with ElasticSearch"""
    def __init__(self):
        self.es = Elasticsearch([settings.ELASTICSEARCH['URL']])

    def indexEvents(self):
        try:
            self.es.indices.get("events-index")
        except ElasticsearchException as e:
            self.es.indices.create(
                index="events-index",
                body={
                "settings": {
                    "analysis": {
                        "filter": {
                            "nGram_filter":{
                                "type": "nGram",
                                "min_gram": 1,
                                "max_gram": 20,
                                "token_chars": [
                                    "letter",
                                    "digit",
                                    "punctuation",
                                    "symbol"
                                ]
                            }
                        },
                        "analyzer": {
                            "nGram_analyzer": {
                                "type": "custom",
                                "tokenizer": "whitespace",
                                "filter": [
                                    "lowercase",
                                    "asciifolding",
                                    "nGram_filter"
                                ]
                            },
                            "whitespace_analyzer": {
                               "type": "custom",
                               "tokenizer": "whitespace",
                               "filter": [
                                  "lowercase",
                                  "asciifolding"
                               ]
                            }
                        }
                    }
                 },
                 "mappings":{
                    "events": {
                        "_all": {
                            "analyzer": "nGram_analyzer",
                            "search_analyzer": "whitespace_analyzer"
                        },
                        "properties":{
                            "title":{
                                "type": "string"
                            },
                            "id":{
                                "type": "integer",
                                "index": "no",
                                "include_in_all": False
                            },
                            "markets":{
                                "type": "nested",
                                "properties": {
                                    "title": {
                                        "type": "string"
                                    },
                                    "id": {
                                        "type": "integer",
                                        "index": "no",
                                        "include_in_all": False
                                    },
                                    "topSells": {
                                        "type": "nested",
                                        "properties": {
                                            "amount": {
                                                "type": "integer",
                                                "index": "no",
                                                "include_in_all": False
                                            },
                                            "price":{
                                                "type": "float",
                                                "index": "no",
                                                "include_in_all": False
                                            }
                                        }
                                    },
                                    "topBuys": {
                                        "type": "nested",
                                        "properties": {
                                            "amount": {
                                                "type": "integer",
                                                "index": "no",
                                                "include_in_all": False
                                            },
                                            "price":{
                                                "type": "float",
                                                "index": "no",
                                                "include_in_all": False
                                            }
                                        }
                                    },
                                    "lastDayPrice": {
                                        "type": "float",
                                        "index": "no",
                                        "include_in_all": False
                                    },
                                    "volume": {
                                        "type": "integer",
                                        "index": "no",
                                        "include_in_all": False
                                    },
                                    "title_short": {
                                        "type": "string",
                                        "index": "no",
                                        "include_in_all": False
                                    }
                                }
                            },
                            "user":{
                                "type": "string",
                                "index": "no",
                                "include_in_all": False
                            },
                            "event_category":{
                                "type": "nested",
                                "properties": {
                                    "id": {
                                        "type": "integer",
                                        "index": "no",
                                        "include_in_all": False
                                    },
                                    "name": {
                                        "type": "string",
                                        "index": "no",
                                        "include_in_all": False
                                    },
                                    "code": {
                                        "type": "string",
                                        "index": "not_analyzed",
                                        "include_in_all": False
                                    }
                                }
                            },
                            "event_type":{
                                "type": "string",
                                "index": "no",
                                "include_in_all": False
                            },
                            "created_at":{
                                "type": "date",
                                "index": "not_analyzed",
                                "include_in_all": False
                            },
                            "deadline":{
                                "type": "date",
                                "index": "not_analyzed",
                                "include_in_all": False
                            },
                            "updated_at":{
                                "type": "string",
                                "index": "no",
                                "include_in_all": False
                            },
                            "volume":{
                                "type": "integer",
                                "include_in_all": False
                            }
                        }
                    }
                 }
               }
            )
        events = Event.objects.filter().all()
        serializer = EventSerializer(events, many=True)
        data = []
        now_time = timezone.now()
        for e in serializer.data:
            d = dict(e)
            d['updated_at'] = now_time
            data.append({
                "_index": "events-index",
                "_type": "events",
                "_id": d['id'],
                "_source": d
            })
        if len(data) > 0:
            try:
                helpers.bulk(self.es, data)
            except ElasticsearchException as e:
                print(str(e))

    def deleteEventIndex(self):
        try:
            self.es.indices.delete("events-index")
        except ElasticsearchException as e:
            print(str(e))

    def search(self, query=None, pagination=10, page=0, expired=0, order="created_at|desc", category="todas"):
        try:
            body = {
                "sort" : [
                    {order.split('|')[0] : {"order" : order.split('|')[1]}},
                    { "_score": { "order": "desc" }}
                ],
                "from": int(page)*int(pagination),
                "size": int(pagination)
            }
            q = None
            if query is None or len(query) == 0:
                body['query'] = {
                    "bool":{
                        "must":{"match_all":{}},
                    }
                }
            else:
                q = {
                    "_all": {
                        "query": query,
                        "operator": "and"
                    }
                }
                body["query"] = {
                    "bool": {
                        "must":{
                            "match": q
                        }
                    }
                }
            nested = False
            if category != 'todas':
                nested = {
                    "nested": {
                        "path": "event_category",
                        "filter": {
                            "bool": {
                                "must": {
                                    "term": {"event_category.code": category}
                                }
                            }
                        }
                    }
                }
                body['query']['bool']['filter'] = nested
            if expired == 'false':
                _range = {
                    "deadline":{
                            "gte" : "now"
                    }
                }
                if nested:
                    body['query']['bool']['filter'] = {
                        "bool":{
                            "must": nested,
                            "filter": {
                                "range": _range,
                            }
                        }
                    }
                else:
                    body['query']['bool'] = {
                        "filter": {
                            "range": _range
                        }
                    }
                if q == None:
                    body['query']['bool']['must'] = {
                        "match_all": {}
                    }
                else:
                    body['query']['bool']['must'] = {
                        "match": q
                    }
            result = self.es.search(
                index="events-index",
                doc_type="events",
                body=body
            )
            if result['hits']['total'] <= (int(page)+1)*int(pagination):
                result['next'] = None
            else:
                result['next'] = int(page) + 1
            return result
        except ElasticsearchException as e:
            import json
            print(json.dumps(body, indent=4, sort_keys=True))
            print(json.dumps(e.args, indent=4, sort_keys=True))
