from django.core.management.base import BaseCommand, CommandError
from market.search import Algolia

class Command(BaseCommand):
    help = 'Indexes events model to algolia'

    def handle(self, *args, **options):
        a = Algolia()
        a.indexEvents()
