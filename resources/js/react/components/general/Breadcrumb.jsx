import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { IndexLink } from 'react-router';

var color = 'rgba(0, 0, 0, 0.541176)';
var style = {
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    fontSize: 12,
    color: color
  }
}

var Breadcrumb = React.createClass({
  render: function() {
    var path = [];
    var parray = this.props.path;
    for (var k in parray) {
      var title = "evento";
      if (document.documentElement.clientWidth > window.gvar.breakpoint) {
        title = parray[k].title;
      }
      if (parray[k].path != null) {
        path.push(<div key={k} style={style.container}>
          <ArrowRight color={color} />
          <IndexLink to={parray[k].path}>
            <FlatButton label={title} labelStyle={style.label}/>
          </IndexLink>
        </div>)
      }else {
        path.push(<div key={k} style={style.container}>
          <ArrowRight color={color} />
          <FlatButton disabled={true} label={parray[k].title} labelStyle={style.label}/>
        </div>)
      }
    }
    return (
      <div className="breadcrumb">
        <IndexLink to={'/app/'}>
          <IconButton iconStyle={{height:20,width:20,fill:color}} style={{paddingLeft: 0,paddingRight: 0, marginLeft:-15}}>
            <ActionHome />
          </IconButton>
        </IndexLink>
        {path}
      </div>
    );
  }
});

export default Breadcrumb;
