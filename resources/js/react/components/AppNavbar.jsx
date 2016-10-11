import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconMenuIcon from 'material-ui/svg-icons/navigation/menu';
import { IndexLink } from 'react-router';
import Avatar from 'material-ui/Avatar';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Money from 'material-ui/svg-icons/editor/attach-money';
import MoneyOff from 'material-ui/svg-icons/editor/money-off';

import {
  _login,
  _logout,
  _register,
  _profileRoute,
  _marketRoute
} from '../redux/actions/navigation';

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

export default class AppNavbar extends React.Component {
  render() {
    var logo = (document.documentElement.clientWidth > window.gvar.breakpoint)?window.gvar.logo:window.gvar.logo2;
    var userData = null;
    var menuItems = [
      {
        style:styles.menuItem,
        text: "Mercados",
        touch: _marketRoute
      }
    ]
    if (window.gvar.user != 'anom') {
      userData = (
        <div className="appbar-nav__info-container">
          <div className="appbar-nav__info">
            <span>
              {
                (document.documentElement.clientWidth > window.gvar.breakpoint)?
                'Disponível':<Money style={{fill:'white', height:21, width:21}} />
              }
            </span>
            <div className="appbar-nav__info-holder">
              R$ {(this.props.balance)?this.props.balance.total.toFixed(2):'0'}
            </div>
          </div>
          <div className="appbar-nav__info appbar-nav__info-warning">
            <span>
              {
                (document.documentElement.clientWidth > window.gvar.breakpoint)?
                'Risco':<MoneyOff style={{fill:'white', height:21, width:21}} />
              }
            </span>
            <div className="appbar-nav__info-holder">
              R$ {(this.props.balance)?this.props.balance.risk.toFixed(2):'0'}
            </div>
          </div>
        </div>
      )
      menuItems.push(
        {
          style:styles.menuItem,
          text: "Perfil",
          touch: _profileRoute
        },
        {
          style:styles.menuItem,
          text: "Sair",
          touch: _logout
        }
      )
    }else {
      menuItems.push(
        {
          style:styles.menuItem,
          text: "Cadastro",
          touch: _register
        },
        {
          style:styles.menuItem,
          text: "Entrar",
          touch: _login
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
      if (this.props.user.socialaccount_set != undefined && this.props.user.socialaccount_set.length > 0) {
        console.log(this.props.user.socialaccount_set[0].extra_data.picture.data.url);
        var picture = this.props.user.socialaccount_set[0].extra_data.picture.data.url;
      }else {
        var picture = window.gvar.usravatar
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
              <Avatar style={{marginRight:5}} size={30} src={picture} />
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
              <li key={0} style={menuItems[1].style} className={menuItems[1].className} onTouchTap={menuItems[1].touch}>
                {menuItems[1].text}
              </li>,
              <li key={1} style={menuItems[2].style} className={menuItems[2].className} onTouchTap={menuItems[2].touch}>
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
        <IndexLink style={{paddingTop:4}} to='/app/'>
          <img className="appbar-logo" src={logo} />
        </IndexLink>
        <div className="appbar-nav">
          {userData}
          {appnav}
        </div>
      </div>
    );
  }
}
