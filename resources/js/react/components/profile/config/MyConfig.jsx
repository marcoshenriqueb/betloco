import React from 'react';
import req from 'reqwest';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

var style = {
  title:{
    margin: "20px 10px 10px 10px",
    fontSize: 22
  },
  subtitle: {
    fontSize: 18
  },
  textfield: {
    fontSize: 14
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  style.title.fontSize = 28;
  style.subtitle.fontSize = 24;
  style.textfield.fontSize = 16;
}

var MyConfig = React.createClass({
  getInitialState: function() {
    return {
      user: false
    };
  },
  getFunds: function(){
    var that = this;
    req('/api/users/me/?format=json').then(function(response){
      var user = response;
      that.setState({
        user: user
      });
    });
  },
  componentDidMount: function() {
    this.getFunds();
  },
  render: function(){
    if (this.state.user === false) {
      return (
        <div>
          <h2 style={style.title}>Configurações</h2>
          <br/>
          <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
            <div className="bouncer">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
          <br/>
        </div>
      )
    }
    return (
      <div>
        <h2 style={style.title}>Configurações</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <h5 className="subtitle" style={style.subtitle}>Perfil</h5>
            <TextField
              style={style.textfield}
              value={this.state.user.username}
              floatingLabelText="Nome de usuário"
              floatingLabelFixed={true}
            /><br/>
            <TextField
              style={style.textfield}
              value={this.state.user.email}
              floatingLabelText="Email"
              floatingLabelFixed={true}
            /><br/>
            <TextField
              style={style.textfield}
              value={this.state.user.password}
              floatingLabelText="Password"
              floatingLabelFixed={true}
              type="password"
            /><br/>
            <FlatButton
              label="Redefinir senha"
              secondary={true}
            />
          </CardText>
        </Card>
      </div>
    )
  }
});

export default MyConfig;
