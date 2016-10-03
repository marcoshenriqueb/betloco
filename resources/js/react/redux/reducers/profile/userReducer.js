const initalState = {
  user: false,
  balance: false
}

export default function(state = initalState, action){
  switch (action.type) {
    case 'UPDATE_USER':
      return Object.assign({}, state, {
        user: action.payload
      });
      break;

    case 'UPDATE_USER_BALANCE':
      return Object.assign({}, state, {
        balance: action.payload
      });
      break;

    default:
      return state
  }
}
