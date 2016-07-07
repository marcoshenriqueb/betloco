import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {fullWhite} from 'material-ui/styles/colors';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';

var style = {
  paper: {
    padding: 20,
    margin: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textField: {
    width: '100%'
  }
};

if (document.documentElement.clientWidth > window.gvar.breakpoint) {
  style.textField.width = '90%';
}

var SearchComp = React.createClass({
  handleSearchChange: function(val){
    this.props.onUserInput(val.target.value);
  },

  render: function() {
    var filterToogle = null;
    if (document.documentElement.clientWidth > window.gvar.breakpoint) {
      filterToogle = (
        <FloatingActionButton
          primary={true}
          mini={true}>
          <FilterIcon color={fullWhite} />
        </FloatingActionButton>
      )
    }
    return (
      <Paper className="container" style={style.paper} zDepth={1}>
        <TextField
          style={style.textField}
          hintText="Procurar mercados"
          value={this.props.search}
          onChange={this.handleSearchChange}
        />
        {filterToogle}
      </Paper>
    );
  }
});

export default SearchComp;
