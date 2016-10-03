import req from 'reqwest';
import {store} from '../store';

import {
  GET_EVENTS_FETCHING,
  GET_EVENTS_FULFILLED
} from '../actionTypes';

const fetchingEvents = ()=>{
  return {
    type: GET_EVENTS_FETCHING,
    payload: null
  }
};

const updateFetchedEvents = (response)=>{
  return {
    type: GET_EVENTS_FULFILLED,
    payload: {
      events: response.hits.hits,
      next: response.next
    }
  }
}

const fecthEvents = (dispatch)=>{
  dispatch(fetchingEvents());
  var params = store.getState().eventsSearch;
  var url = '/api/markets/?format=json';
  if (params.search.length > 0) {
    url += '&query=' + params.search;
  }
  url += '&expired=' + params.checked;
  url += '&category=' + params.category;
  url += '&order=' + params.order;
  req(url).then(function(response){
    dispatch(updateFetchedEvents(response));
  });
}

export const getEvents = () => {
  return function(dispatch){
    fecthEvents(dispatch);
  }
}

const updateNextFetchedEvents = (response)=>{
  return {
    type: 'GET_NEXT_EVENTS_FULFILLED',
    payload: {
      events: response.hits.hits,
      next: response.next
    }
  }
}

export const getNextEventPage = () => {
  return function(dispatch){
    var params = store.getState().eventsSearch;
    var url = '/api/markets/?format=json&page=' + params.next;
    url += '&query=' + params.search;
    req(url).then(function(response){
      dispatch(updateNextFetchedEvents(response))
    });
  }
}

const updateUserInput = (filterText)=>{
  return {
    type: 'HANDLE_SEARCH_INPUT',
    payload: {
      search: filterText
    }
  }
}

export const handleUserInput = (e) => {
  const filterText = e.target.value;
  return function(dispatch){
    dispatch(updateUserInput(filterText))
    if (filterText.length > 2 || filterText.length == 0) {
      fecthEvents(dispatch);
    }
  }
}

const updateExpired = ()=>{
  return {
    type: 'UPDATE_EXPIRED_CHECK'
  }
}

export const handleCheck = ()=>{
  return function(dispatch){
    dispatch(updateExpired());
    fecthEvents(dispatch);
  }
}

const updateCategory = (v)=>{
  return {
    type: 'UPDATE_CATEGORY_SEARCH',
    payload: v
  }
}

export const handleCategoryChange = (e, k, v)=>{
  return function(dispatch){
    dispatch(updateCategory(v));
    fecthEvents(dispatch);
  }
}

const updateOrder = (v)=>{
  return {
    type: 'UPDATE_ORDER_SEARCH',
    payload: v
  }
}

export const handleOrderChange = (e, k, v)=>{
  return function(dispatch){
    dispatch(updateOrder(v));
    fecthEvents(dispatch);
  }
}
