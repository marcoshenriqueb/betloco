import req from 'reqwest';

const updateProfilePositions = (dispatch, data) =>{
  return {
    type: 'UPDATE_PROFILE_POSITIONS',
    payload: data
  }
}

export const getPositions = () =>{
  return function(dispatch){
    req('/api/markets/my-positions/?format=json').then(function(response){
      var positions = response;
      dispatch(updateProfilePositions(dispatch, positions))
    });
  }
}

const updateProfileOrders = (dispatch, data) =>{
  return {
    type: 'UPDATE_PROFILE_MY_ORDERS',
    payload: data
  }
}

export const getOrders = () => {
  return function(dispatch){
    req('/api/markets/open-orders/?format=json').then(function(response){
      var orders = response;
      dispatch(updateProfileOrders(dispatch, orders));
    });
  }
}

const updateProfileHistory = (dispatch, data) =>{
  return {
    type: 'UPDATE_PROFILE_HISTORY',
    payload: data
  }
}

export const getHistory = () => {
  return function (dispatch){
    req('/api/markets/my-history/?format=json').then(function(response){
      var history = response;
      dispatch(updateProfileHistory(dispatch, history));
    });
  }
}
