import React from 'react';
import req from 'reqwest';
import SearchComp from './markets/SearchComp.jsx';
import Market from './markets/Market.jsx';

var MarketContainer = React.createClass({
  getInitialState: function() {
    return {
      markets: [],
      search: ''
    };
  },
  handleUserInput: function(filterText) {
    this.setState({
      search: filterText,
    });
  },
  componentDidMount: function() {
    var that = this;
    req('/api/markets/?format=json').then(function(response){
      that.setState({
        markets: response
      });
    });
  },
  render: function() {
    return (
      <div className="app-content">
        <SearchComp search={this.state.search} onUserInput={this.handleUserInput} />
        <Market markets={this.state.markets} search={this.state.search} />
      </div>
    );
  }
});

export default MarketContainer;
