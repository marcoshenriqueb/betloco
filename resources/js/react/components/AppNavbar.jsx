import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconMenuIcon from 'material-ui/svg-icons/navigation/menu';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { browserHistory } from 'react-router';
import { IndexLink } from 'react-router';

const styles = {
  title: {
    cursor: 'pointer',
  },
};

var AppNavbar = React.createClass({
  _logout: function(){
    window.location = "/accounts/logout/";
  },
  _profileRoute: function(){
    browserHistory.push('/app/perfil/minhas-posicoes/');
  },
  _marketRoute: function(){
    browserHistory.push('/app/');
  },
  render: function() {
    var userData = null;
    var menuItems = [
      <MenuItem style={{cursor:'pointer'}} primaryText="Mercados" onTouchTap={this._marketRoute} />
    ]
    if (window.gvar.user != 'anom') {
      userData = (
        <div className="appbar-nav__info-container">
          <span>Saldo Disponível</span>
          <div className="appbar-nav__info-holder">
            R$ {(this.props.balance)?this.props.balance.total.toFixed(2):'0'}
          </div>
        </div>
      )
      menuItems.push(
        <MenuItem style={{cursor:'pointer'}} primaryText="Perfil" onTouchTap={this._profileRoute} />,
        <MenuItem style={{cursor:'pointer'}} primaryText="Sair" onTouchTap={this._logout} />
      )
    }else {
      menuItems.push(
        <MenuItem style={{cursor:'pointer'}} primaryText="Cadastro" />,
        <MenuItem style={{cursor:'pointer'}} primaryText="Entrar" />
      )
    }
    return (
      <AppBar
        title={
          <IndexLink style={{color:'white'}} to='/app/'>
            BetLoco
          </IndexLink>
        }
        showMenuIconButton={false}
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <div className="appbar-nav">
                {userData}
                <IconButton iconStyle={{fill:'rgb(255,255,255)'}}><IconMenuIcon /></IconButton>
              </div>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            {menuItems}
          </IconMenu>
        }
      >
      </AppBar>
    );
  }
});

export default AppNavbar;
