import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

const style = {
  paper: {
    padding: 20,
    margin: 20,
    textAlign: 'center',
    display: 'inline-block'
  },
  textField: {
    width: '90%'
  }
};

var SearchComp = React.createClass({
  getInitialState: function() {
    return {
      search: ''
    };
  },

  render: function() {
    return (
      <Paper className="container" style={style.paper} zDepth={1}>
      <TextField
        style={style.textField}
        hintText="Procurar mercados"
      />
      </Paper>
    );
  }
});

export default SearchComp;
