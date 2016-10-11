const initalState = {
  positions: false,
  orders: false,
  history: false
}

export default function(state = initalState, action){
  switch (action.type) {
    case 'UPDATE_PROFILE_POSITIONS':
      return Object.assign({}, state, {
        positions: action.payload
      });
      break;

    case 'UPDATE_PROFILE_MY_ORDERS':
      return Object.assign({}, state, {
        orders: action.payload
      });
      break;

    case 'UPDATE_PROFILE_HISTORY':
      return Object.assign({}, state, {
        history: action.payload
      });
      break;

    default:
      return state
  }
}
