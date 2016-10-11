import req from 'reqwest';

const updateSingleEvent = data => {
  return {
    type: 'UPDATE_SINGLE_EVENT',
    payload: data
  }
}

export const getEvent = (id, callback) => {
  return function(dispatch){
    var that = this;
    req('/api/markets/' + id + '/?format=json').then(function(response){
      var _event = response;
      dispatch(updateSingleEvent(response))
      if (typeof callback == 'function') {
        callback();
      }
    });
  }
}

export const resetEvent = () => {
  return {
    type: 'UPDATE_SINGLE_EVENT',
    payload: null
  }
}
