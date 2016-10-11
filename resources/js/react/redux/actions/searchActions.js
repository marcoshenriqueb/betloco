import {fetchEvents} from './eventsFetchingActions';

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
      fetchEvents(dispatch);
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
    fetchEvents(dispatch);
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
    fetchEvents(dispatch);
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
    fetchEvents(dispatch);
  }
}
