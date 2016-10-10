import req from 'reqwest';
import {store} from '../store';

import {
  GET_EVENTS_FETCHING,
  GET_EVENTS_FULFILLED
} from '../actionTypes';

const updateFetchedEventsPrices = (data)=>{
  return {
    type: 'UPDATE_FETCHED_EVENTS_PRICE',
    payload: data
  }
};

const fetchEventsPrices = (dispatch, data) => {
  const url = "/api/markets/prices/?format=json";
  const ids = [];
  for (var i = 0; i < data.length; i++) {
    ids.push(data[i]._source.id);
  }
  req({
    url: url,
    headers: {
      'X-CSRFToken': document.getElementById('token').getAttribute('value')
    },
    method: 'post',
    data: {
      ids: JSON.stringify(ids)
    }
  }).then(function(response){
    dispatch(updateFetchedEventsPrices(response));
  });
}

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
};

export const fetchEvents = dispatch => {
  dispatch(fetchingEvents());
  const params = store.getState().eventsSearch;
  let url = '/api/markets/?format=json';
  if (params.search.length > 0) {
    url += '&query=' + params.search;
  }
  url += '&expired=' + params.expired;
  url += '&category=' + params.category;
  url += '&order=' + params.order;
  req(url).then(function(response){
    dispatch(updateFetchedEvents(response));
    fetchEventsPrices(dispatch, response.hits.hits);
  });
}

export const getEvents = () => {
  return function(dispatch){
    fetchEvents(dispatch);
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
      dispatch(updateNextFetchedEvents(response));
      var events = params.events.concat(response.hits.hits);
      fetchEventsPrices(dispatch, events);
    });
  }
}
