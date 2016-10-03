import {
  GET_EVENTS_FULFILLED,
  GET_EVENTS_FETCHING
} from '../actionTypes';

const initalState = {
  events: null,
  search: '',
  next: null,
  expired: false,
  category: 'todas',
  order: '_score|desc'
}

export default function(state = initalState, action){
  switch (action.type) {
    case GET_EVENTS_FULFILLED:
      return Object.assign({}, state, {
        events: action.payload.events,
        next: action.payload.next
      });
      break;

    case GET_EVENTS_FETCHING:
      return Object.assign({}, state, {
        events: action.payload
      });
      break;

    case 'GET_NEXT_EVENTS_FULFILLED':
      var events = state.events.concat(action.payload.events);
      return Object.assign({}, state, {
        events: events,
        next: action.payload.next
      });
      break;

    case 'HANDLE_SEARCH_INPUT':
      return Object.assign({}, state, {
        search: action.payload.search
      });
      break;

    case 'UPDATE_EXPIRED_CHECK':
      return Object.assign({}, state, {
        expired: !state.expired
      });
      break;

    case 'UPDATE_CATEGORY_SEARCH':
      return Object.assign({}, state, {
        category: action.payload
      });
      break;

    case 'UPDATE_ORDER_SEARCH':
      return Object.assign({}, state, {
        order: action.payload
      });
      break;

    default:
      return state
  }
}
