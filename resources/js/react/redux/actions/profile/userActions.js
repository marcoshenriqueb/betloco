import req from 'reqwest';

const updateUser = (type, data) => {
  return {
    type: type,
    payload: data
  }
}

export const getUser = () =>{
  return function(dispatch){
    req('/api/users/me/?format=json').then(function(response){
      var user = response;
      dispatch(updateUser('UPDATE_USER', user));
    }, function(){
      dispatch(updateUser('UPDATE_USER', 'anom'));
    });
  }
}

export const getBalance = () =>{
  return function(dispatch){
    req('/api/transactions/balance/?format=json').then(function(response){
      dispatch(updateUser('UPDATE_USER_BALANCE', response));
    });
  }
}

export const getEstimatedBalance = (preview) => {
  return function (dispatch){
    req('/api/transactions/balance/?preview=' + encodeURI(JSON.stringify(preview)) + '&format=json').then(function(response){
      dispatch(updateUser('UPDATE_USER_ESTIMATED_BALANCE', response));
    });
  }
}
