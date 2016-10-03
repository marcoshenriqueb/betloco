const initalState = {
  _event: null
}

export default function(state = initalState, action){
  switch (action.type) {
    case 'UPDATE_SINGLE_EVENT':
      return Object.assign({}, state, {
        _event: action.payload
      });
      break;

    default:
      return state
  }
}
