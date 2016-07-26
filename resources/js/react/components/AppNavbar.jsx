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
      {
        style:{cursor:'pointer'},
        text: "Mercados",
        touch: this._marketRoute
      }
    ]
    if (window.gvar.user != 'anom') {
      userData = (
        <div className="appbar-nav__info-container">
          <div className="appbar-nav__info">
            <span>Disponível</span>
            <div className="appbar-nav__info-holder">
              R$ {(this.props.balance)?this.props.balance.total.toFixed(2):'0'}
            </div>
          </div>
          {
            (document.documentElement.clientWidth > window.gvar.desktopbreak) ?
            <div className="appbar-nav__info appbar-nav__info-warning">
              <span>Risco</span>
              <div className="appbar-nav__info-holder">
                R$ {(this.props.balance)?this.props.balance.risk.toFixed(2):'0'}
              </div>
            </div> : null
          }
        </div>
      )
      menuItems.push(
        {
          style:{cursor:'pointer'},
          text: "Perfil",
          touch: this._profileRoute
        },
        {
          style:{cursor:'pointer'},
          text: "Sair",
          touch: this._logout
        }
      )
    }else {
      menuItems.push(
        {
          style:{cursor:'pointer'},
          text: "Cadastro",
          touch: null
        },
        {
          style:{cursor:'pointer'},
          text: "Entrar",
          touch: null
        }
      )
    }
    if (document.documentElement.clientWidth > window.gvar.desktopbreak) {
      var appnav = (
        <ul className="appbar-nav__list">
          {menuItems.map((i,k)=> (
            <li style={i.style} onTouchTap={i.touch} key={k} >
              {i.text}
            </li>
          ))}
        </ul>
      )
    }else {
      var appnav = (
        <IconMenu
          iconButtonElement={<IconButton iconStyle={{fill:'rgb(255,255,255)'}}><IconMenuIcon /></IconButton>}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          {menuItems.map((i,k)=> (
            <MenuItem style={i.style} primaryText={i.text} onTouchTap={i.touch} key={k} />
          ))}
        </IconMenu>
      )
    }
    console.log(appnav);
    return (
      <div className="appbar">
        <IndexLink style={{color:'white'}} to='/app/'>
          <h1 className="appbar-logo">Guroo</h1>
        </IndexLink>
        <div className="appbar-nav">
          {userData}
          {appnav}
        </div>
      </div>
    );
  }
});

export default AppNavbar;
