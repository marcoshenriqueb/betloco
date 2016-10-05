import socketio from 'socket.io-client';
const socket = socketio('http://localhost:3000/');
import {
  updateSingleMarket
} from '../actions/marketActions';

if (window.gvar.user != 'anom') {
  socket.emit('user', window.gvar.user);
}

export const connectToMarketWS = (dispatch, id, callback) => {
  var that = this;
  if (socket != undefined) {
    socket.on('guroo:market:update:' + id, function(e){
      const m = JSON.parse(e);
      dispatch(updateSingleMarket('UPDATE_SINGLE_MARKET', m.market));
      if (typeof callback === 'function') {
        callback();
      }
    });
  }else {
    this.connect(this.connectToMarketWS);
  }
}

export const disconnectToMarketWS = (id) => {
  socket.removeListener('guroo:market:update:' + id);
}
