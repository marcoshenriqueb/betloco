import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navbar from './components/AppNavbar.jsx';
import SearchComp from './components/SearchComp.jsx';
import Market from './components/Market.jsx';

var App = React.createClass({

  render: function() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div>
          <Navbar />
          <div className="app-content">
            <SearchComp />
            <Market />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
});

export default App;
