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
import {Tabs, Tab} from 'material-ui/Tabs';

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
};

var ProfileContainer = React.createClass({
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
  tabChange: function(e){
    console.log(e);
  },
  render: function() {
    switch (window.location.pathname.split('/')[3]) {
      case 'minhas-ordens':
        var initial = 1;
        break;
      case 'historico-transacoes':
        var initial = 2;
        break;
      case 'fundos':
        var initial = 3;
        break;
      case 'minhas-configuracoes':
        var initial = 4;
        break;
      default:
        var initial = 0;
    }
    var submenu = (
      <Tabs onChange={this.tabChange} initialSelectedIndex={initial}>
        <Tab icon={<TrendingUp />} onClick={this._positionRoute} />
        <Tab icon={<ActionGavel />} onClick={this._ordersRoute} />
        <Tab icon={<_History />} onClick={this._historyRoute} />
        <Tab icon={<Money />} onClick={this._fundsRoute} />
        <Tab icon={<Settings />} onClick={this._configRoute} />
      </Tabs>
    )
    if (document.documentElement.clientWidth > window.gvar.breakpoint){
      submenu = (
        <Paper style={style.paper}>
          <Menu>
            <MenuItem primaryText="Minhas posições" onTouchTap={this._positionRoute} leftIcon={<TrendingUp />} />
            <MenuItem primaryText="Minhas Ordens" onTouchTap={this._ordersRoute} leftIcon={<ActionGavel />} />
            <MenuItem primaryText="Histórico" onTouchTap={this._historyRoute} leftIcon={<_History />} />
            <MenuItem primaryText="Fundos" onTouchTap={this._fundsRoute} leftIcon={<Money />} />
            <Divider />
            <MenuItem primaryText="Configurações" onTouchTap={this._configRoute} leftIcon={<Settings />} />
            <Divider />
            <MenuItem primaryText="Sair" onTouchTap={this._logout} leftIcon={<Power />} />
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
