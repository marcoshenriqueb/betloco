import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const styles = {
  title: {
    cursor: 'pointer',
  },
};

var AppNavbar = React.createClass({

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
            <MenuItem primaryText="Mercados" />
            <MenuItem primaryText="Perfil" />
            <MenuItem primaryText="Sair" />
          </IconMenu>
        }
      />
    );
  }
});

export default AppNavbar;
