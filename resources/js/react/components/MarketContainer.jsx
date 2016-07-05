import React from 'react';
import req from 'reqwest';
import SearchComp from './markets/SearchComp.jsx';
import _Event from './markets/Event.jsx';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

var MarketContainer = React.createClass({
  getInitialState: function() {
    return {
      events: null,
      search: '',
      next: null
    };
  },
  getEvents: function(search){
    this.setState({
      events: null
    });
    var url = '/api/markets/?format=json';
    if (search != undefined) {
      url += '&query=' + search;
    }
    var that = this;
    req(url).then(function(response){
      that.setState({
        events: response.hits.hits,
        next: response.next
      });
    });
  },
  getNextEventPage: function(){
    var url = '/api/markets/?format=json&page=' + this.state.next;
    url += '&query=' + this.state.search;
    var that = this;
    req(url).then(function(response){
      var events = that.state.events.concat(response.hits.hits);
      that.setState({
        events: events,
        next: response.next
      });
    });
  },
  componentDidMount: function() {
    this.getEvents();
  },
  handleUserInput: function(filterText) {
    this.getEvents(filterText);
    this.setState({
      search: filterText,
    });
  },
  render: function() {
    var nextPageButton = null;
    if (this.state.next != null) {
      nextPageButton = (
        <FloatingActionButton mini={true} onClick={this.getNextEventPage}>
          <ContentAdd />
        </FloatingActionButton>
      );
    }
    var markets = (
      <div>
        <br/>
        <div className="bouncer">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
        <br/>
      </div>
    );
    if (this.state.events != null) {
      markets = (
        <_Event events={this.state.events} search={this.state.search} />
      );
    }
    return (
      <div className="app-content">
        <SearchComp search={this.state.search} onUserInput={this.handleUserInput} />
        {markets}
        {nextPageButton}
        <br />
        <br />
      </div>
    );
  }
});

export default MarketContainer;
