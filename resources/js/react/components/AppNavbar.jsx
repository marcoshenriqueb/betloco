import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconMenuIcon from 'material-ui/svg-icons/navigation/menu';
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
      <MenuItem style={{cursor:'pointer'}} primaryText="Mercados" onTouchTap={this._marketRoute} key={0} />
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
        <MenuItem style={{cursor:'pointer'}} primaryText="Perfil" onTouchTap={this._profileRoute}  key={1} />,
        <MenuItem style={{cursor:'pointer'}} primaryText="Sair" onTouchTap={this._logout}  key={2} />
      )
    }else {
      menuItems.push(
        <MenuItem style={{cursor:'pointer'}} primaryText="Cadastro"  key={1} />,
        <MenuItem style={{cursor:'pointer'}} primaryText="Entrar"  key={2} />
      )
    }

    return (
      <div className="appbar">
        <IndexLink style={{color:'white'}} to='/app/'>
          <h1 className="appbar-logo">BetLoco</h1>
        </IndexLink>
        <div className="appbar-nav">
          {userData}
          <IconMenu
            iconButtonElement={<IconButton iconStyle={{fill:'rgb(255,255,255)'}}><IconMenuIcon /></IconButton>}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            {menuItems}
          </IconMenu>
        </div>
      </div>
    );
  }
});

export default AppNavbar;
