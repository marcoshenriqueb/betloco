var React = require('react');
var ReactDOM = require('react-dom');
// Here we put our React instance to the global scope. Make sure you do not put it
// into production and make sure that you close and open your console if the
// DEV-TOOLS does not display
// window.React = React;
console.log(React);
var App = require('./react/App.jsx');
ReactDOM.render(<App/>, document.getElementById('app'));


// var req = require('reqwest');
//
// req('/api/markets/?format=json').then(function(resp){
//   console.log(resp);
// });
