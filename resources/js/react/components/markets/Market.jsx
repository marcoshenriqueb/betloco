import React from 'react';
import MarketCard from './MarketCard.jsx';

var Market = React.createClass({
  render: function() {
    return (
      <div className="container markets-container">
        {
          this.props.markets.map((market, id) => {
            return <MarketCard market={market} key={id} />
          })
        }
      </div>
    );
  }
});

export default Market;
