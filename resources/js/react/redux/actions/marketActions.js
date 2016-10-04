import req from 'reqwest';

import {
  connectToMarketWS
} from '../ws/marketWS';

export const updateSingleMarket = (type, data) => {
  return {
    type: type,
    payload: data
  }
}

export const getMarket= (id, callback) => {
  return function (dispatch){
    req('/api/markets/choice/' + id + '/?format=json').then(function(response){
      var market = response;
      dispatch(updateSingleMarket('UPDATE_SINGLE_MARKET', market));
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
}

export const getCustody = (id, callback) => {
  return function (dispatch){
    req('/api/markets/custody/' + id + '/?format=json').then(function(response){
      var custody = response;
      dispatch(updateSingleMarket('UPDATE_SINGLE_MARKET_CUSTODY', custody));
    });
  }
}

export const getOpenOrders = (id) => {
  return function(dispatch){
    req('/api/markets/open-orders/?market=' + id + '&format=json').then(function(response){
      var orders = response;
      dispatch(updateSingleMarket('UPDATE_SINGLE_MARKET_OPEN_ORDERS', orders));
    });
  }
}

export const deleteOrders = (id, orders, callback) => {
  return function(dispatch){
    req({
      url: '/api/markets/open-orders/?market=' + id + '&format=json&orders=' + JSON.stringify(orders),
      headers: {
        'X-CSRFToken': document.getElementById('token').getAttribute('value')
      },
      method: 'delete'
    }).then(function(response){
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
}

export const openDialog = (market, buy) => {
  return {
    type: 'UPDATE_SINGLE_MARKET_OPEN_DIALOG',
    payload: {
      dialog: true,
      dialogContent: {
        market: market,
        buy: buy
      }
    }
  }
}

export const closeDialog = () => {
  return {
    type: 'UPDATE_SINGLE_MARKET_CLOSE_DIALOG'
  };
}

export const connectToMarket = (id, callback) => {
  return function(dispatch){
    connectToMarketWS(dispatch, id, callback);
  }
}

export const resetMarket = () => {
  return {
    type: 'UPDATE_SINGLE_MARKET_RESET'
  }
}
