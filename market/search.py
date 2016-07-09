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
                            "autocomplete_filter": {
                                "type": "edge_ngram",
                                "min_gram": 2,
                                "max_gram": 20
                            }
                        },
                        "analyzer": {
                            "default": {
                                "type":      "custom",
                                "tokenizer": "standard",
                                "filter": [
                                    "standard",
                                    "lowercase",
                                    "asciifolding",
                                    "autocomplete_filter"
                                ]
                            }
                        }
                    }
                 }
               }
            )
        events = Event.objects.filter(deadline__gte=timezone.now()).all()
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
            print('error')

    def search(self, query=None, pagination=10, page=0, expired=0, order="created_at|desc", category="todas"):
        try:
            body = {
                "sort" : [
                    {order.split('|')[0] : {"order" : order.split('|')[1]}},
                    { "_score": { "order": "desc" }}
                ],
                "from": page*pagination,
                "size": pagination
            }
            if query is None or len(query) == 0:
                body['query'] = {
                    "bool":{
                        "must":{"match_all":{}},
                    }
                }
            else:
                body['query'] = {
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
                    }
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
            print(e.args)
