const initalState = {
  navopen: false
}

export default function(state = initalState, action){
  switch (action.type) {
    case 'UPDATE_NAV_MENU_OPEN':
      let result = false;
      if (action.payload) {
        result = !state.navopen;
      }
      return Object.assign({}, state, {
        navopen: result
      });
      break;

    default:
      return state
  }
}
