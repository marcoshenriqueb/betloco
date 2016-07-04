from algoliasearch import algoliasearch
from betloco.settings import ALGOLIA
from .models import Event
from .serializers import EventSerializer

class Algolia():
    """search with Algolia"""
    def __init__(self):
        self.client = algoliasearch.Client(ALGOLIA['APPLICATION_ID'], ALGOLIA['API_KEY'])

    def indexEvents(self):
        index = self.client.init_index("events_" + ALGOLIA['INDEX_SUFFIX'])
        index.set_settings({
            "attributesToIndex": ["title", "event_category",],
            "customRanking": ["desc(volume)", "desc(created_at)"]
        })
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        index.add_objects(serializer.data)
