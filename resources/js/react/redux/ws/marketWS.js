import {
  updateSingleMarket
} from '../actions/marketActions';

export const connectToMarketWS = (dispatch, id, callback) => {
  var that = this;
  var socket = new WebSocket("ws://" + window.location.host + "/market/" + id + '/');
  socket.onopen = function() {
    socket.onmessage = function(e) {
      var m = JSON.parse(e.data);
      dispatch(updateSingleMarket('UPDATE_SINGLE_MARKET', m.market));
      if (typeof callback === 'function') {
        callback();
      }
    }
  }
}
