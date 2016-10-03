import store from '../store';
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
  }
}

export const addBestPrice = () => {
  const c = store.getState().market.dialogContent;
  if (c.buy) {
    var order = c.market.topBuys[0];
  }else {
    var order = c.market.topSells[0];
  }
  return {
    type: 'UPDATE_ORDER_PRICE_CHANGE',
    payload: order.price*100
  }
}

export const handleOrder = () => {
  if (this.state.amount.length != 0) {
    if (this.state.price.length != 0) {
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
