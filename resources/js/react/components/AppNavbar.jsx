import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
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
        showMenuIconButton={false}
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
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
