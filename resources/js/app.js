var req = require('reqwest');

req('/api/markets/?format=json').then(function(resp){
  console.log(resp);
});
