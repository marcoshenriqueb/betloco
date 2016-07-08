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
      next: null,
      checked: false,
      category: 'todas',
      order: 'created_at|desc'
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
    url += '&expired=' + this.state.checked;
    url += '&category=' + this.state.category;
    url += '&order=' + this.state.order;
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
    if (filterText.length > 3 || filterText.length == 0) {
      this.getEvents(filterText);
    }
    this.setState({
      search: filterText,
    });
  },
  handleCheck: function(){
    this.setState({
      checked: !this.state.checked
    });
  },
  handleCategoryChange: function(e, k, v){
    this.setState({
      category: v
    });
  },
  handleOrderChange: function(e, k, v){
    this.setState({
      order: v
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
        <SearchComp search={this.state.search}
                    onUserInput={this.handleUserInput}
                    checked={this.state.checked}
                    handleCheck={this.handleCheck}
                    category={this.state.category}
                    handleCategoryChange={this.handleCategoryChange}
                    order={this.state.order}
                    handleOrderChange={this.handleOrderChange} />
        {markets}
        {nextPageButton}
        <br />
        <br />
      </div>
    );
  }
});

export default MarketContainer;
