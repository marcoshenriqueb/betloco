import {store} from '../store';
import req from 'reqwest';

export const handleAmountChange = e => {
  if (!isNaN(e.target.value) && Number.isInteger(Number(e.target.value))) {
    var amount = Number(e.target.value);
    if (Number(e.target.value) == 0) {
      amount = '';
    }
    return {
      type: 'UPDATE_ORDER_AMOUNT_CHANGE',
      payload: amount
    }
  }else {
    return {
      type: 'UPDATE_ORDER_AMOUNT_CHANGE_XXXXXXXX'
    }
  }
}

export const addAmount = () => {
  return {
    type: 'UPDATE_ORDER_AMOUNT_ADD'
  }
}

export const removeAmount = () => {
  return {
    type: 'UPDATE_ORDER_AMOUNT_REMOVE'
  }
}

export const handlePriceChange = e => {
  if (!isNaN(e.target.value) && e.target.value < 100 && e.target.value >= 0 && Number.isInteger(Number(e.target.value))) {
    var price = Number(e.target.value);
    if (Number(e.target.value) == 0) {
      price = '';
    }
    return {
      type: 'UPDATE_ORDER_PRICE_CHANGE',
      payload: price
    }
  }else {
    return {
      type: 'UPDATE_ORDER_PRICE_CHANGE_XXXXXXXX'
    }
  }
}

export const addBestPrice = () => {
  const c = store.getState().market.dialogContent;
  if (c != undefined) {
    if (c.buy) {
      var order = c.market.topBuys[0];
    }else {
      var order = c.market.topSells[0];
    }
  }
  return {
    type: 'UPDATE_ORDER_PRICE_CHANGE',
    payload: order!=undefined?order.price*100:""
  }
}

export const handleOrder = () => {
  let o = store.getState().order;
  if (o.amount.length != 0) {
    if (o.price.length != 0) {
      return {
        type: 'UPDATE_ORDER_HANDLE_ORDER',
        payload: {
          content: 1,
          priceError: false,
          amountError: false
        }
      }
    }else {
      return {
        type: 'UPDATE_ORDER_HANDLE_ORDER',
        payload: {
          priceError: true,
          amountError: false
        }
      }
    }
  }else {
    return {
      type: 'UPDATE_ORDER_HANDLE_ORDER',
      payload: {
        amountError: true
      }
    }
  }
}

export const returnStep = () => {
  return {
    type: 'ORDER_RETURN_STEP'
  }
}

export const resetOrderState = () => {
  return {
    type: 'ORDER_RETURN_INITIAL_STATE'
  }
}

const updateOrderDisabled = () => {
  return {
    type: 'UPDATE_ORDER_DISABLED_TRUE'
  }
}

const updateOrderNonFieldError = (data) => {
  return {
    type: 'UPDATE_ORDER_NON_FIELD_ERROR',
    payload: data
  }
}

export const handleConfirmOrder = (callback) => {
  return function(dispatch){
    dispatch(updateOrderDisabled());
    const s = store.getState();
    var amount = s.market.dialogContent.buy ? s.order.amount : s.order.amount * -1;
    var data = {
      price: s.order.price / 100,
      amount: amount,
      market: s.market.dialogContent.market.id
    };
    req({
      url: '/api/markets/order/?format=json',
      headers: {
        'X-CSRFToken': document.getElementById('token').getAttribute('value')
      },
      method: 'post',
      data: data
    }).then(function(response){
      if (typeof callback === 'function') {
        callback();
      }
    }).catch(function(response){
      if (response.status == 400) {
        dispatch(updateOrderNonFieldError(JSON.parse(response.response).non_field_errors[0]));
      }
    });
  }
}
