import React from 'react';
import req from 'reqwest';
import MultipleMarketTable from './eventDetail/MultipleMarketTable.jsx';
import Detail from './marketDetail/Details.jsx';

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
    return (
      <div className="marketdetail-content container">
        <br/>
        <h2>{this.state._event.title}</h2>
        <MultipleMarketTable _event={this.state._event} />
        <br/>
        <Detail market={this.state._event} />
        <br/>
      </div>
    );
  }
});

export default EventDetailContainer;
