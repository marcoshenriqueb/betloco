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
    if (this.props.market.choices != undefined) {
      return (
        <div>
          <h2>{this.props.market.title}</h2>
          <div className="orderrequest-container">
            {this.props.market.choices.map((choice) => {
              return <OrderRequest choice={choice} key={choice.id} />
            })}
          </div>
          <br/>
          <div className="orderbook-container">
            {this.props.market.choices.map((choice) => {
              return <OrderBook choice={choice} key={choice.id} />
            })}
          </div>
          <br/>
          <Details market={this.props.market} />
          <br/>
        </div>
      );
    }else {
      return (<div/>);
    }
  }
});

export default MarketDetailCard;
