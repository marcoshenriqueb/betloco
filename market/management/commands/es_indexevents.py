from django.core.management.base import BaseCommand, CommandError
from market.search import ElasticSearch

class Command(BaseCommand):
    help = 'Indexes events model to ElasticSearch'

    def handle(self, *args, **options):
        e = ElasticSearch()
        e.indexEvents()
