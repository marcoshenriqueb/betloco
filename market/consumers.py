# In consumers.py
from channels import Group
from channels.sessions import enforce_ordering
from channels.auth import channel_session_user, channel_session_user_from_http
from engine.engine import LiquidationEngine
from .models import Market, Choice
from .serializers import MarketDetailSerializer
import json

# Connected to websocket.connect
@enforce_ordering(slight=True)
@channel_session_user_from_http
def ws_connect(message, pk):
    room = 'market-' + str(pk)
    if message.user.is_authenticated():
        message.channel_session['room'] = room
        Group(room).add(message.reply_channel)

def market_update(message):
    # Broadcast to listening sockets
    ids = json.loads(message.content['message'])
    m = Market.objects.get(pk=ids['pk'])
    mserializer = MarketDetailSerializer(m)
    data = {
        'market': mserializer.data
    }
    Group(message.content['room']).send({
        "text": json.dumps(data),
    })

# Connected to websocket.disconnect
@enforce_ordering(slight=True)
@channel_session_user
def ws_disconnect(message):
    if message.user.is_authenticated():
        Group("chat-%s" % message.channel_session['room']).discard(message.reply_channel)

def liquidate_market(message):
    LiquidationEngine(message.content['market_id'])
