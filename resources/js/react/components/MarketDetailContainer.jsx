import React from 'react';
import req from 'reqwest';
import MarketDetailCard from './marketDetail/MarketDetailCard.jsx';

var MarketDetailContainer = React.createClass({
  getInitialState: function() {
    return {
      market: {},
    };
  },
  getMarket: function(){
    var that = this;
    req('/api/markets/' + this.props.params.id + '/?format=json').then(function(response){
      var market = response;
      that.setState({
        market: market
      });
    });
  },
  componentDidMount: function() {
    this.getMarket();
  },
  render: function() {
    return (
      <div className="marketdetail-content container">
        <br />
        <MarketDetailCard market={this.state.market} />
      </div>
    );
  }
});

export default MarketDetailContainer;
