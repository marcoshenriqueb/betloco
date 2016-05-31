import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import OrderRequest from './OrderRequest.jsx';
import OrderBook from './OrderBook.jsx';
import Details from './Details.jsx';

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
        <div className="orderrequest-container">
          <OrderRequest />
          <OrderRequest />
        </div>
        <br/>
        <div className="orderbook-container">
          <OrderBook />
          <OrderBook />
        </div>
        <br/>
        <Details />
        <br/>
      </div>
    );
  }
});

export default MarketDetailCard;
