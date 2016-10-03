import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import {
  _passwordReset
} from '../../../redux/actions/navigation';

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

class MyConfig extends React.Component {
  constructor(props) {
    super(props)
  }

  render(){
    if (this.props.user === false) {
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
    var content = (
      <h5 className="subtitle" style={style.subtitle}>Usuário não logado</h5>
    )
    if (this.props.user != 'anom') {
      content = [
        <h5 key={0} className="subtitle" style={style.subtitle}>Perfil</h5>,
        <TextField
          style={style.textfield}
          key={1}
          value={this.props.user.username}
          floatingLabelText="Nome de usuário"
          floatingLabelFixed={true}
        />,<br key={2}/>,
        <TextField
          style={style.textfield}
          key={3}
          value={this.props.user.email}
          floatingLabelText="Email"
          floatingLabelFixed={true}
        />,<br key={4}/>,
        <TextField
          style={style.textfield}
          key={5}
          value={this.props.user.password}
          floatingLabelText="Password"
          floatingLabelFixed={true}
          type="password"
        />,<br key={6}/>,
        <FlatButton
          label="Redefinir senha"
          key={7}
          onTouchTap={_passwordReset}
          secondary={true}
        />
      ]
    }
    return (
      <div>
        <h2 style={style.title}>Configurações</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            {content}
          </CardText>
        </Card>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    user: state.profileUser.user
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({

  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(MyConfig);
