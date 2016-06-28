import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import _History from 'material-ui/svg-icons/action/history';
import Money from 'material-ui/svg-icons/editor/monetization-on';
import TrendingUp from 'material-ui/svg-icons/action/trending-up';
import Divider from 'material-ui/Divider';
import Person from 'material-ui/svg-icons/social/person';
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
  render: function() {
    return (
      <div className="profile-container">
        <div className="profile-menu-container">
          <Paper style={style.paper}>
            <Menu>
              <MenuItem primaryText="Minhas posições" onTouchTap={this._positionRoute} leftIcon={<TrendingUp />} />
              <MenuItem primaryText="Histórico" leftIcon={<_History />} />
              <MenuItem primaryText="Fundos" leftIcon={<Money />} />
              <Divider />
              <MenuItem primaryText="Perfil" leftIcon={<Person />} />
              <MenuItem primaryText="Configurações" leftIcon={<Settings />} />
              <Divider />
              <MenuItem primaryText="Sair" leftIcon={<Power />} />
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
