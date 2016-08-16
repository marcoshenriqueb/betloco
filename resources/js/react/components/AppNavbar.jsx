import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconMenuIcon from 'material-ui/svg-icons/navigation/menu';
import { browserHistory } from 'react-router';
import { IndexLink } from 'react-router';
import Avatar from 'material-ui/Avatar';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

const styles = {
  title: {
    cursor: 'pointer',
  },
  menuItem: {
    textTransform: 'capitalize',
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
          <li style={menuItems[0].style} className={menuItems[0].className} onTouchTap={menuItems[0].touch}>
            {menuItems[0].text}
          </li>
          {
            this.props.user?
            (<li style={menuItems[1].style}
                 className={menuItems[1].className}
                 onTouchTap={this.props.togglenav}
                 id="navtoggle">
              <Avatar style={{marginRight:5}} size={30} src={window.gvar.usravatar} />
              {this.props.user.username}
              <NavigationExpandMoreIcon color="white"/>
              {
                this.props.navopen?
                (<ul className="appbar-nav__dropdown">
                  <li onTouchTap={menuItems[1].touch}>{menuItems[1].text}</li>
                  <li onTouchTap={menuItems[2].touch}>{menuItems[2].text}</li>
                </ul>):
                (<div/>)
              }
            </li>):
            [
              <li style={menuItems[1].style} className={menuItems[1].className} onTouchTap={menuItems[1].touch}>
                {menuItems[1].text}
              </li>,
              <li style={menuItems[2].style} className={menuItems[2].className} onTouchTap={menuItems[2].touch}>
                {menuItems[2].text}
              </li>
            ]
          }
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
