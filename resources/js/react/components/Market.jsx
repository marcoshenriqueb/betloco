import React from 'react';
import req from 'reqwest';
import MarketCard from './MarketCard.jsx';

var Market = React.createClass({
  getInitialState: function() {
    return {
      markets: []
    };
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
      <div className="container">
      {
        this.state.markets.map((market) => {
          return <MarketCard market={market} key={market.id} />
        })
      }
      </div>
    );
  }
});

export default Market;
