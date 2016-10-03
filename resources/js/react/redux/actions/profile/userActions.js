import req from 'reqwest';

const updateUser = (dispatch, user) => {
  return {
    type: 'UPDATE_USER',
    payload: user
  }
}

export const getUser = () =>{
  return function(dispatch){
    req('/api/users/me/?format=json').then(function(response){
      var user = response;
      dispatch(updateUser(dispatch, user));
    }, function(){
      dispatch(updateUser(dispatch, 'anom'));
    });
  }
}

const updateUserBalance = (dispatch, bal) => {
  return {
    type: 'UPDATE_USER_BALANCE',
    payload: bal
  }
}

export const getBalance = () =>{
  return function(dispatch){
    req('/api/transactions/balance/?format=json').then(function(response){
      dispatch(updateUserBalance(dispatch, response));
    });
  }
}
