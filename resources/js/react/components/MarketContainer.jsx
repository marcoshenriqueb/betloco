import React from 'react';
import req from 'reqwest';
import SearchComp from './markets/SearchComp.jsx';
import _Event from './markets/Event.jsx';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

var MarketContainer = React.createClass({
  getInitialState: function() {
    return {
      events: [],
      search: '',
      next: null
    };
  },
  getEvents: function(search){
    var url = '/api/markets/?format=json';
    if (search != undefined) {
      url += '&search=' + search;
    }
    var that = this;
    req(url).then(function(response){
      that.setState({
        events: response.results,
        next: response.next
      });
    });
  },
  getNextEventPage: function(){
    var that = this;
    req(this.state.next).then(function(response){
      var events = that.state.events.concat(response.results);
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
    return (
      <div className="app-content">
        <SearchComp search={this.state.search} onUserInput={this.handleUserInput} />
        <_Event events={this.state.events} search={this.state.search} />
        {nextPageButton}
        <br />
        <br />
      </div>
    );
  }
});

export default MarketContainer;
