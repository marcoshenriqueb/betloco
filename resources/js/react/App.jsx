import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navbar from './components/AppNavbar.jsx';
import {grey700} from 'material-ui/styles/colors';
import {
  getUser,
  getBalance
} from './redux/actions/profile/userActions';

import {
  togglenav
} from './redux/actions/navigation';

const muiTheme = getMuiTheme({
  fontFamily: "'Open Sans', sans-serif",
  raisedButton: {
    fontWeight: '700',
    primaryColor: '#00BCD4'
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

class App extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.props.getBalance();
    this.props.getUser();
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div onTouchTap={this.props.togglenav.bind(this)}>
          <Navbar user={this.props.user}
                  balance={this.props.balance}
                  navopen={this.props.navopen}
                  togglenav={this.props.togglenav.bind(this)} />
          {React.cloneElement(this.props.children, {
            balance: this.props.balance,
            updateBalance: this.props.getBalance
          })}
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state){
  return {
    user: state.profileUser.user,
    balance: state.profileUser.balance,
    navopen: state.nav.navopen
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getUser,
    getBalance,
    togglenav
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
