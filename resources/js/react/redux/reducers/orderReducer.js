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
        amount = Number(state.amount) - 100;
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
      let content = (action.payload.content != undefined)?action.payload.content:state.content;
      let priceError = (action.payload.priceError != undefined)?action.payload.priceError:state.priceError;
      let amountError = (action.payload.amountError != undefined)?action.payload.amountError:state.amountError;
      return Object.assign({}, state, {
        content: content,
        priceError: priceError,
        amountError: amountError
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

    case 'UPDATE_ORDER_DISABLED_TRUE':
      return Object.assign({}, state, {
        disabled: true
      });
      break;

    case 'UPDATE_ORDER_NON_FIELD_ERROR':
      return Object.assign({}, state, {
        error: action.payload
      });
      break;

    case 'UPDATE_ORDER_AMOUNT_PRICE_CHANGE':
      return Object.assign({}, state, {
        amount: action.payload.amount,
        price: action.payload.price*100
      });
      break;

    default:
      return state
  }
}
