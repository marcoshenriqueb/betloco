from django.core.management.base import BaseCommand, CommandError
from market.search import ElasticSearch

class Command(BaseCommand):
    help = 'delete index events on ElasticSearch'

    def handle(self, *args, **options):
        e = ElasticSearch()
        e.deleteEventIndex()
