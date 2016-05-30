import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import OrderBook from './OrderBook.jsx';

var styles = {
  cardtext: {
    paddingTop: 0
  }
}

var MarketDetailCard = React.createClass({
  render: function() {
    return (
      <div>
        <h2>{this.props.market.title}</h2>
        <div className="orderbook-container">
          <OrderBook />
          <OrderBook />
        </div>
      </div>
    );
  }
});

export default MarketDetailCard;
