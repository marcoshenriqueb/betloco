import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import _History from 'material-ui/svg-icons/action/history';
import Money from 'material-ui/svg-icons/editor/monetization-on';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import ActionGavel from 'material-ui/svg-icons/action/gavel';
import Divider from 'material-ui/Divider';
import Settings from 'material-ui/svg-icons/action/settings';
import Power from 'material-ui/svg-icons/action/power-settings-new';
import FontIcon from 'material-ui/FontIcon';
import { browserHistory } from 'react-router';
import IconButton from 'material-ui/IconButton';

import {
  _profileRoute,
  _ordersRoute,
  _historyRoute,
  _fundsRoute,
  _configRoute,
  _logout
} from '../redux/actions/navigation';

const style = {
  paper: {
    display: 'inline-block',
    float: 'left',
    margin: '16px 16px 16px 0'
  },
  rightIcon: {
    textAlign: 'center',
    lineHeight: '24px',
  },
  iconColor:"rgba(255,255,255,.7)",
  selectedIconcolor:window.gvar.lightcolor
};

export default class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intital: 0
    }
  }

  shouldComponentUpdate(){
    return true;
  }

  render() {
    var positionColor = style.iconColor;
    var ordersColor = style.iconColor;
    var historyColor = style.iconColor;
    var fundsColor = style.iconColor;
    var configColor = style.iconColor;
    switch (window.location.pathname.split('/')[3]) {
      case 'minhas-ordens':
        ordersColor = style.selectedIconcolor;
        break;
      case 'historico-transacoes':
        historyColor = style.selectedIconcolor;
        break;
      case 'fundos':
        fundsColor = style.selectedIconcolor;
        break;
      case 'minhas-configuracoes':
        configColor = style.selectedIconcolor;
        break;
      default:
        positionColor = style.selectedIconcolor;
    }
    var submenu = (
      <div className="profile-mobile-menu">
        <ul className="profile-mobile-menu__list">
          <li onTouchTap={_profileRoute}><IconButton><TrendingUp color={positionColor} className="profile-mobile-menu__item" /></IconButton></li>
          <li onTouchTap={_ordersRoute}><IconButton><ActionGavel color={ordersColor} className="profile-mobile-menu__item" /></IconButton></li>
          <li onTouchTap={_historyRoute}><IconButton><_History color={historyColor} className="profile-mobile-menu__item" /></IconButton></li>
          <li onTouchTap={_fundsRoute}><IconButton><Money color={fundsColor} className="profile-mobile-menu__item" /></IconButton></li>
          <li onTouchTap={_configRoute}><IconButton><Settings color={configColor} className="profile-mobile-menu__item" /></IconButton></li>
        </ul>
      </div>
    )
    if (document.documentElement.clientWidth > window.gvar.breakpoint){
      submenu = (
        <Paper style={style.paper}>
          <Menu>
            <MenuItem style={{cursor:'pointer'}} primaryText="Minhas posições" onTouchTap={_profileRoute} leftIcon={<TrendingUp />} />
            <MenuItem style={{cursor:'pointer'}} primaryText="Minhas Ordens" onTouchTap={_ordersRoute} leftIcon={<ActionGavel />} />
            <MenuItem style={{cursor:'pointer'}} primaryText="Histórico" onTouchTap={_historyRoute} leftIcon={<_History />} />
            <MenuItem style={{cursor:'pointer'}} primaryText="Fundos" onTouchTap={_fundsRoute} leftIcon={<Money />} />
            <Divider />
            <MenuItem style={{cursor:'pointer'}} primaryText="Configurações" onTouchTap={_configRoute} leftIcon={<Settings />} />
            <Divider />
            <MenuItem style={{cursor:'pointer'}} primaryText="Sair" onTouchTap={_logout} leftIcon={<Power />} />
          </Menu>
        </Paper>
      )
    }
    return (
      <div className="profile-container">
        <div className="profile-menu-container">
          {submenu}
        </div>
        <div className="profile-content-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
