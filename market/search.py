from algoliasearch import algoliasearch
from django.conf import settings
from .models import Event
from .serializers import EventSerializer
from elasticsearch import helpers, Elasticsearch, ElasticsearchException

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
        self.es = Elasticsearch([
            {'host': settings.ELASTICSEARCH['HOST'], 'port': settings.ELASTICSEARCH['PORT']}
        ])

    def indexEvents(self):
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
            except Exception as e:
                print(str(e))

    def search(self, query):
        try:
            self.es.search(index="events-index", doc_type="events", body={"query":{"title":query}})
        except ElasticsearchException as e:
            print(e.args)
