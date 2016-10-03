const initalState = {
  positions: false
}

export default function(state = initalState, action){
  switch (action.type) {
    case 'UPDATE_PROFILE_POSITIONS':
      return Object.assign({}, state, {
        positions: action.payload
      });
      break;

    default:
      return state
  }
}
