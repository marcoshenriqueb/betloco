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
            print("passei aqui")
            self.es.indices.create(
                index="events-index",
                body={
                "settings": {
                    "analysis": {
                      "analyzer": {
                        "default": {
                          "tokenizer": "standard",
                          "filter":  [ "lowercase", "asciifolding" ]
                        }
                      }
                    }
                 }
               }
            )
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        data = []
        for e in serializer.data:
            d = dict(e)
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

    def search(self, query=None, pagination=10, page=0):
        try:
            if query is None or len(query) < 3:
                result = self.es.search(
                    index="events-index",
                    doc_type="events",
                    body={
                        "query":{
                            "bool":{
                                "must":{"match_all":{}},
                            },
                        },
                        "from": page*pagination,
                        "size": pagination
                    }
                )
            else:
                result = self.es.search(
                    index="events-index",
                    doc_type="events",
                    body={
                        "query":{
                            "bool":{
                                "must":{
                                    "multi_match": {
                                      "type": "most_fields",
                                      "query": query,
                                      "fields": [
                                            "title",
                                            "title.folded"
                                        ]
                                    }
                                }
                            },
                        },
                        "from": page*pagination,
                        "size": pagination
                    }
                )
            if result['hits']['total'] <= (int(page)+1)*int(pagination):
                result['next'] = None
            else:
                result['next'] = int(page) + 1
            return result
        except ElasticsearchException as e:
            print(e.args)
