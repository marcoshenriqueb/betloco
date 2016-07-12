import React from 'react';
import req from 'reqwest';
import MultipleMarketTable from './eventDetail/MultipleMarketTable.jsx';
import Detail from './marketDetail/Details.jsx';
import Breadcrumb from './general/Breadcrumb.jsx';

var EventDetailContainer = React.createClass({
  getInitialState: function() {
    return {
      _event: {},
    };
  },
  getEvent: function(){
    var that = this;
    req('/api/markets/' + this.props.params.id + '/?format=json').then(function(response){
      var _event = response;
      that.setState({
        _event: _event
      });
    });
  },
  componentDidMount: function() {
    this.getEvent();
  },
  render: function() {
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
        <h2 style={{marginTop:10}}>{this.state._event.title}</h2>
        <MultipleMarketTable _event={this.state._event} />
        <br/>
        <Detail market={this.state._event} />
        <br/>
      </div>
    );
  }
});

export default EventDetailContainer;
