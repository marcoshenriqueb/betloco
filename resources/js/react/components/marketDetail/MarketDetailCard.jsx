import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import OrderRequest from './OrderRequest.jsx';
import OrderBook from './OrderBook.jsx';
import Details from './Details.jsx';
import OpenOrders from './OpenOrders.jsx';
import OrderDialog from './OrderDialog.jsx';
import Chip from 'material-ui/Chip';
import moment from 'moment';

var styles = {
  cardtext: {
    paddingTop: 0
  }
}
var bgcolor = "rgb(255, 64, 129)";

var MarketDetailCard = React.createClass({
  render: function() {
    if (this.props.market.choices != undefined) {
      var marketClosed = null;
      var disableOrderRequest = false;
      if (moment(this.props.market.event.deadline).isBefore()) {
        marketClosed = (
          <Chip labelStyle={{color:'white', textTransform:'uppercase', fontWeight: 'bold'}}
                backgroundColor={bgcolor}>Mercado Encerrado
          </Chip>
        )
        disableOrderRequest = true;
      }
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
                       balance={this.props.balance}
                       updateBalance={this.props.updateBalance}
                       closeDialog={this.props.closeDialog}
                       dialogContent={this.props.dialogContent}
                       custody={this.props.custody} />
          <h2 style={{marginTop:10}}>
            {this.props.market.title}
            {marketClosed}
          </h2>
          <div className="orderrequest-container">
            {this.props.market.choices.map((choice) => {
              return <OrderRequest openDialog={this.props.openDialog}
                                   choice={choice}
                                   disableOrderRequest={disableOrderRequest}
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
