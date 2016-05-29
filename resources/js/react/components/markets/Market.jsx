import React from 'react';
import MarketCard from './MarketCard.jsx';

var Market = React.createClass({
  render: function() {
    return (
      <div className="container">
      {
        this.props.markets.filter(function(market){
          return market.title.toLowerCase().indexOf(this.props.search.toLowerCase()) !== -1;
        }.bind(this)).map((market) => {
          return <MarketCard market={market} key={market.id} />
        })
      }
      </div>
    );
  }
});

export default Market;
