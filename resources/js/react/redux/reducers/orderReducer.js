const initialState = {
  amount: '',
  amountError: false,
  price: '',
  priceError: false,
  content: 0,
  error: false,
  disabled: false
}

export default function(state = initialState, action){
  switch (action.type) {
    case 'UPDATE_ORDER_AMOUNT_CHANGE':
      return Object.assign({}, state, {
        amount: action.payload
      });
      break;

    case 'UPDATE_ORDER_AMOUNT_ADD':
      return Object.assign({}, state, {
        amount: Number(state.amount) + 100
      });
      break;

    case 'UPDATE_ORDER_AMOUNT_REMOVE':
      var amount = 0;
      if (state.amount > 100) {
        amount = Number(this.state.amount) - 100;
      }
      return Object.assign({}, state, {
        amount: amount
      });
      break;

    case 'UPDATE_ORDER_PRICE_CHANGE':
      return Object.assign({}, state, {
        price: action.payload
      });
      break;

    case 'UPDATE_ORDER_HANDLE_ORDER':
      return Object.assign({}, state, {
        ...action.payload
      });
      break;

    case 'ORDER_RETURN_STEP':
      return Object.assign({}, state, {
        content: 0,
        error: false,
        disabled: false
      });
      break;

    case 'ORDER_RETURN_INITIAL_STATE':
      return Object.assign({}, state, initialState);
      break;

    default:
      return state
  }
}
