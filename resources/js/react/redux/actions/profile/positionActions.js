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
