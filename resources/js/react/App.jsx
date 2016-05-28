import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navbar from './components/AppNavbar.jsx';
import MarketContainer from './components/MarketContainer.jsx';

var App = React.createClass({
  render: function() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <Navbar />
          <MarketContainer />
        </div>
      </MuiThemeProvider>
    );
  }
});

export default App;
