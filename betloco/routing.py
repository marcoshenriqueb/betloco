from channels.routing import route
from market.consumers import ws_connect, ws_disconnect, market_update

channel_routing = [
    route("websocket.connect", ws_connect, path=r"^/market/(?P<pk>[0-9]+)/$"),
    route("market-update", market_update),
    route("websocket.disconnect", ws_disconnect, path=r"^/market/$"),
]
