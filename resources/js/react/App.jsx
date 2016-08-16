import React from 'react';
import req from 'reqwest';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navbar from './components/AppNavbar.jsx';
import {grey700} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  fontFamily: "'Open Sans', sans-serif",
  raisedButton: {
    fontWeight: '700'
  },
  flatButton: {
    fontWeight: '700'
  },
  menuItem:{
    textTransform: 'uppercase'
  },
  palette: {
    primary1Color: grey700
  }
});

var App = React.createClass({
  getInitialState: function(){
    return {
      balance: false,
      user:false
    };
  },
  getUser: function(){
    var that = this;
    req('/api/users/me/?format=json').then(function(response){
      that.setState({
        user: response
      });
    });
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
    this.getUser();
  },
  render: function() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Navbar user={this.state.user} balance={this.state.balance} />
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
