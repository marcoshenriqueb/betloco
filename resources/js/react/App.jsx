import React from 'react';
import req from 'reqwest';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navbar from './components/AppNavbar.jsx';

const muiTheme = getMuiTheme({});

var App = React.createClass({
  getInitialState: function(){
    return {
      balance: false,
    };
  },
  getBalance: function(){
    var that = this;
    req('/api/transactions/balance/?format=json').then(function(response){
      that.setState({
        balance: response
      });
    });
  },
  componentDidMount: function(){
    this.getBalance();
  },
  render: function() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Navbar balance={this.state.balance} />
          {React.cloneElement(this.props.children, {
            balance: this.state.balance,
            updateBalance: this.getBalance
          })}
        </div>
      </MuiThemeProvider>
    );
  }
});

export default App;
