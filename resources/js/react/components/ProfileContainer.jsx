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
  selectedIconcolor:"rgba(255,255,255,1)"
};

var ProfileContainer = React.createClass({
  getInitialState: function(){
    return {
      intital: 0
    }
  },
  _positionRoute: function(){
    browserHistory.push('/app/perfil/minhas-posicoes/');
  },
  _ordersRoute: function(){
    browserHistory.push('/app/perfil/minhas-ordens/');
  },
  _historyRoute: function(){
    browserHistory.push('/app/perfil/historico-transacoes/');
  },
  _fundsRoute: function(){
    browserHistory.push('/app/perfil/fundos/');
  },
  _configRoute: function(){
    browserHistory.push('/app/perfil/minhas-configuracoes/');
  },
  _logout: function(){
    window.location = "/accounts/logout/";
  },
  shouldComponentUpdate: function(){
    return true;
  },
  render: function() {
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
          <li onTouchTap={this._positionRoute}><IconButton><TrendingUp color={positionColor} className="profile-mobile-menu__item" /></IconButton></li>
          <li onTouchTap={this._ordersRoute}><IconButton><ActionGavel color={ordersColor} className="profile-mobile-menu__item" /></IconButton></li>
          <li onTouchTap={this._historyRoute}><IconButton><_History color={historyColor} className="profile-mobile-menu__item" /></IconButton></li>
          <li onTouchTap={this._fundsRoute}><IconButton><Money color={fundsColor} className="profile-mobile-menu__item" /></IconButton></li>
          <li onTouchTap={this._configRoute}><IconButton><Settings color={configColor} className="profile-mobile-menu__item" /></IconButton></li>
        </ul>
      </div>
    )
    if (document.documentElement.clientWidth > window.gvar.breakpoint){
      submenu = (
        <Paper style={style.paper}>
          <Menu>
            <MenuItem style={{cursor:'pointer'}} primaryText="Minhas posições" onTouchTap={this._positionRoute} leftIcon={<TrendingUp />} />
            <MenuItem style={{cursor:'pointer'}} primaryText="Minhas Ordens" onTouchTap={this._ordersRoute} leftIcon={<ActionGavel />} />
            <MenuItem style={{cursor:'pointer'}} primaryText="Histórico" onTouchTap={this._historyRoute} leftIcon={<_History />} />
            <MenuItem style={{cursor:'pointer'}} primaryText="Fundos" onTouchTap={this._fundsRoute} leftIcon={<Money />} />
            <Divider />
            <MenuItem style={{cursor:'pointer'}} primaryText="Configurações" onTouchTap={this._configRoute} leftIcon={<Settings />} />
            <Divider />
            <MenuItem style={{cursor:'pointer'}} primaryText="Sair" onTouchTap={this._logout} leftIcon={<Power />} />
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
});

export default ProfileContainer;
