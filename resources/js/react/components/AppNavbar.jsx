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
  menuItem: {
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontSize: 14
  }
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
        style:styles.menuItem,
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
            (document.documentElement.clientWidth > window.gvar.breakpoint) ?
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
          style:styles.menuItem,
          text: "Perfil",
          touch: this._profileRoute
        },
        {
          style:styles.menuItem,
          text: "Sair",
          touch: this._logout
        }
      )
    }else {
      menuItems.push(
        {
          style:styles.menuItem,
          text: "Cadastro",
          touch: null
        },
        {
          style:styles.menuItem,
          text: "Entrar",
          touch: null
        }
      )
    }
    if (document.documentElement.clientWidth > window.gvar.desktopbreak) {
      switch (window.location.pathname.split('/')[2]) {
        case 'perfil':
          menuItems[1].className = "active";
          break;
        case '':
          menuItems[0].className = "active";
          break;
        default:

      }
      var appnav = (
        <ul className="appbar-nav__list">
          {menuItems.map((i,k)=> (
            <li style={i.style} className={i.className} onTouchTap={i.touch} key={k} >
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
    return (
      <div className="appbar">
        <IndexLink style={{color:'white'}} to='/app/'>
          <h1 className="appbar-logo">Guroooo</h1>
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
