const initialState = {
  market: null,
  custody: false,
  dialog: false,
  dialogContent: undefined,
  orders: []
}

export default function(state = initialState, action){
  switch (action.type) {
    case 'UPDATE_SINGLE_MARKET':
      return Object.assign({}, state, {
        market: action.payload
      });
      break;

    case 'UPDATE_SINGLE_MARKET_CUSTODY':
      return Object.assign({}, state, {
        custody: action.payload
      });
      break;

    case 'UPDATE_SINGLE_MARKET_OPEN_ORDERS':
      return Object.assign({}, state, {
        orders: action.payload
      });
      break;

    case 'UPDATE_SINGLE_MARKET_OPEN_DIALOG':
      return Object.assign({}, state, {
        dialog: action.payload.dialog,
        dialogContent: action.payload.dialogContent
      });
      break;

    case 'UPDATE_SINGLE_MARKET_CLOSE_DIALOG':
      return Object.assign({}, state, {
        dialog: false,
        dialogContent: undefined
      });
      break;

    case 'UPDATE_SINGLE_MARKET_RESET':
      return Object.assign({}, state, initialState);
      break;

    default:
      return state
  }
}
