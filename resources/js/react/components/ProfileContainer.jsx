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
  _logout: function(){
    window.location = "/accounts/logout/";
  },
  render: function() {
    return (
      <div className="profile-container">
        <div className="profile-menu-container">
          <Paper style={style.paper}>
            <Menu>
              <MenuItem primaryText="Minhas posições" onTouchTap={this._positionRoute} leftIcon={<TrendingUp />} />
              <MenuItem primaryText="Minhas Ordens" onTouchTap={this._ordersRoute} leftIcon={<ActionGavel />} />
              <MenuItem primaryText="Histórico" onTouchTap={this._historyRoute} leftIcon={<_History />} />
              <MenuItem primaryText="Fundos" onTouchTap={this._fundsRoute} leftIcon={<Money />} />
              <Divider />
              <MenuItem primaryText="Configurações" leftIcon={<Settings />} />
              <Divider />
              <MenuItem primaryText="Sair" onTouchTap={this._logout} leftIcon={<Power />} />
            </Menu>
          </Paper>
        </div>
        <div className="profile-content-container">
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default ProfileContainer;
