import React from 'react';
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
  constructor(props) {
    super(props);
  }

  openDisqus(){
    var identifier = 'event|' + this.props._event.id;
    var url = "https://www.guroo.bet/app/evento/" + this.props._event.id + "/";
    var title = this.props._event.title
    if (window.DISQUS != undefined) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier;
          this.page.url = url;
          this.page.title = title;
        }
      })
    }else {
      var disqus_config = function () {
          this.page.url = url;
          this.page.identifier = identifier;
          this.page.title = title;
      };
      (function() {
          var d = document, s = d.createElement('script');
          s.src = '//guroo.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
      })();
    }
  }

  componentDidMount() {
    this.props.getEvent(this.props.params.id, this.openDisqus.bind(this));
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
        <div id="disqus_thread"></div>
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
