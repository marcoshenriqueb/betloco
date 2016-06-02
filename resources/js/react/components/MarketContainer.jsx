import React from 'react';
import req from 'reqwest';
import SearchComp from './markets/SearchComp.jsx';
import Market from './markets/Market.jsx';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

var MarketContainer = React.createClass({
  getInitialState: function() {
    return {
      markets: [],
      search: '',
      next: null
    };
  },
  getMarkets: function(search){
    var url = '/api/markets/?format=json';
    if (search != undefined) {
      console.log(search);
      url += '&search=' + search;
    }
    var that = this;
    req(url).then(function(response){
      that.setState({
        markets: response.results,
        next: response.next
      });
    });
  },
  getNextMarketPage: function(){
    var that = this;
    req(this.state.next).then(function(response){
      var markets = that.state.markets.concat(response.results);
      that.setState({
        markets: markets,
        next: response.next
      });
    });
  },
  componentDidMount: function() {
    this.getMarkets();
  },
  handleUserInput: function(filterText) {
    this.getMarkets(filterText);
    this.setState({
      search: filterText,
    });
  },
  render: function() {
    var nextPageButton = null;
    if (this.state.next != null) {
      nextPageButton = (
        <FloatingActionButton mini={true} onClick={this.getNextMarketPage}>
          <ContentAdd />
        </FloatingActionButton>
      );
    }
    return (
      <div className="app-content">
        <SearchComp search={this.state.search} onUserInput={this.handleUserInput} />
        <Market markets={this.state.markets} search={this.state.search} />
        {nextPageButton}
        <br />
        <br />
      </div>
    );
  }
});

export default MarketContainer;
