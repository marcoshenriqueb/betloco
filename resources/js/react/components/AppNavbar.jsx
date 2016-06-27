import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconMenuIcon from 'material-ui/svg-icons/navigation/menu';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { browserHistory } from 'react-router';

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
    browserHistory.push('/app/perfil/');
  },
  _marketRoute: function(){
    browserHistory.push('/app/');
  },
  render: function() {
    return (
      <AppBar
        title="BetLoco"
        onTitleTouchTap={this._marketRoute}
        showMenuIconButton={false}
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><IconMenuIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="Mercados" onTouchTap={this._marketRoute} />
            <MenuItem primaryText="Perfil" onTouchTap={this._profileRoute} />
            <MenuItem primaryText="Sair" onTouchTap={this._logout} />
          </IconMenu>
        }
      />
    );
  }
});

export default AppNavbar;
