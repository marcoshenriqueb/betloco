import React from 'react';
import req from 'reqwest';
import MultipleMarketTable from './eventDetail/MultipleMarketTable.jsx';
import Detail from './marketDetail/Details.jsx';
import Breadcrumb from './general/Breadcrumb.jsx';

var style = {
  title:{
    marginTop:10,
    fontSize: 22
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  style.title.fontSize = 28;
}

var EventDetailContainer = React.createClass({
  getInitialState: function() {
    return {
      _event: null,
    };
  },
  getEvent: function(){
    var that = this;
    req('/api/markets/' + this.props.params.id + '/?format=json').then(function(response){
      var _event = response;
      that.setState({
        _event: _event
      });
      that.openDisqus();
    });
  },
  openDisqus(){
    var identifier = 'event|' + this.state._event.id;
    var url = "http://www.guroo.bet/app/evento/" + this.state._event.id + "/";
    if (window.DISQUS != undefined) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier;
          this.page.url = url;
        }
      })
    }else {
      var disqus_config = function () {
          this.page.url = url;
          this.page.identifier = identifier;
      };
      (function() {
          var d = document, s = d.createElement('script');
          s.src = '//guroo.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
      })();
    }
  },
  componentDidMount: function() {
    this.getEvent();
  },
  render: function() {
    if (this.state._event == null) {
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
    if (this.state._event.title != undefined) {
      var path = [
        {
          title_short: "evento",
          title: this.state._event.title,
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
        <h2 style={style.title}>{this.state._event.title}</h2>
        <MultipleMarketTable _event={this.state._event} />
        <br/>
        <Detail market={this.state._event} />
        <br/>
        <div id="disqus_thread"></div>
      </div>
    );
  }
});

export default EventDetailContainer;
