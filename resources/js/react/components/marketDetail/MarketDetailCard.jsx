import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import OrderRequest from './OrderRequest.jsx';
import OrderBook from './OrderBook.jsx';
import Details from './Details.jsx';
import OpenOrders from './OpenOrders.jsx';
import OrderDialog from './OrderDialog.jsx';

var styles = {
  cardtext: {
    paddingTop: 0
  }
}

var MarketDetailCard = React.createClass({
  render: function() {
    if (this.props.market.choices != undefined) {
      if (this.props.orders.length > 0) {
        var openOrders = (
          <div>
            <OpenOrders choices={this.props.market.choices}
                      orders={this.props.orders}
                      onDeleteOrders={this.props.onDeleteOrders} />
            <br/>
          </div>
        )
      }else {
        var openOrders = null;
      }
      return (
        <div>
          <OrderDialog dialog={this.props.dialog}
                       closeDialog={this.props.closeDialog}
                       dialogContent={this.props.dialogContent}
                       custody={this.props.custody} />
          <h2>{this.props.market.title}</h2>
          <div className="orderrequest-container">
            {this.props.market.choices.map((choice) => {
              return <OrderRequest openDialog={this.props.openDialog}
                                   choice={choice}
                                   custody={this.props.custody[choice.id]}
                                   key={choice.id} />
            })}
          </div>
          <br/>
          <div className="orderbook-container">
            {this.props.market.choices.map((choice) => {
              return <OrderBook choice={choice} key={choice.id} />
            })}
          </div>
          <br/>
          {openOrders}
          <Details market={this.props.market.event} />
          <br/>
        </div>
      );
    }else {
      return (<div/>);
    }
  }
});

export default MarketDetailCard;
