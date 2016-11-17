import React from 'react';
import Disqus from './Disqus.jsx';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MultipleMarketTable from './eventDetail/MultipleMarketTable.jsx';
import Detail from './marketDetail/Details.jsx';
import Breadcrumb from './general/Breadcrumb.jsx';

import {
  getEvent,
  resetEvent
} from '../redux/actions/eventActions';

var style = {
  title:{
    marginTop:10,
    fontSize: 20
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  style.title.fontSize = 28;
}

class EventDetailContainer extends React.Component {

  componentDidMount() {
    this.props.getEvent(this.props.params.id);
  }

  componentWillUnmount(){
    this.props.resetEvent();
  }

  render() {
    if (this.props._event == null) {
      return (
        <div style={{
                  width:'100%',
                  height: '60vh',
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center'
                }}>
          <div className="bouncer">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      )
    }
    var breadcrumb = null;
    if (this.props._event.title != undefined) {
      var path = [
        {
          title_short: "evento",
          title: this.props._event.title,
          path: null
        }
      ]
      breadcrumb = (
        <Breadcrumb path={path} />
      )
    }
    return (
      <div className="marketdetail-content container">
        {breadcrumb}
        <h2 style={style.title}>{this.props._event.title}</h2>
        <MultipleMarketTable _event={this.props._event} />
        <br/>
        <Detail market={this.props._event} />
        <br/>
        <Disqus identifier={'event|' + this.props._event.id}
                url={"https://www.guroo.bet/app/evento/" + this.props._event.id + "/"}
                title={this.props._event.title} />
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    _event: state._event._event
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getEvent,
    resetEvent
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(EventDetailContainer);
