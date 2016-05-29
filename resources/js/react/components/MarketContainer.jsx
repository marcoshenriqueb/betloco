import React from 'react';
import req from 'reqwest';
import SearchComp from './markets/SearchComp.jsx';
import Market from './markets/Market.jsx';

var MarketContainer = React.createClass({
  getInitialState: function() {
    return {
      markets: [],
      search: '',
      next: null
    };
  },
  handleUserInput: function(filterText) {
    this.setState({
      search: filterText,
    });
  },
  getMarkets: function(url){
    if (url == undefined) {
      url = '/api/markets/?format=json';
    }
    var that = this;
    req(url).then(function(response){
      var markets = that.state.markets.concat(response.results);
      that.setState({
        markets: markets,
        next: response.next
      });
    });
  },
  getNextMarketPage: function(){
    this.getMarkets(this.state.next);
  },
  componentDidMount: function() {
    this.getMarkets();
  },
  render: function() {
    var nextPageButton = null;
    if (this.state.next != null) {
      nextPageButton = (<button onClick={this.getNextMarketPage}>Mais</button>);
    }
    return (
      <div className="app-content">
        <SearchComp search={this.state.search} onUserInput={this.handleUserInput} />
        <Market markets={this.state.markets} search={this.state.search} />
        {nextPageButton}
      </div>
    );
  }
});

export default MarketContainer;
