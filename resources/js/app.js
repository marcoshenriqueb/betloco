import React from 'react';
import ReactDOM from 'react-dom';
// Here we put our React instance to the global scope. Make sure you do not put it
// into production and make sure that you close and open your console if the
// DEV-TOOLS does not display
// window.React = React;
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();
import App from './react/App.jsx';

ReactDOM.render(<App />, document.getElementById('app'));


// var req = require('reqwest');
//
// req('/api/markets/?format=json').then(function(resp){
//   console.log(resp);
// });
