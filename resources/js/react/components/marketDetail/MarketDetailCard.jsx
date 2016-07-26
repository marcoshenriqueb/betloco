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
  },
  title:{
    marginTop:10,
    marginBottom:10,
    fontSize: 24
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  styles.title.fontSize = 32;
}

var MarketDetailCard = React.createClass({
  render: function() {
    if (this.props.market != null) {
      var marketClosed = null;
      var disableOrderRequest = false;
      if (moment(this.props.market.event.deadline).isBefore()) {
        marketClosed = (
          <Chip labelStyle={{color:window.gvar.lightcolor, textTransform:'uppercase', fontWeight: 'bold'}}
                backgroundColor={window.gvar.warningcolor}>Mercado Encerrado
          </Chip>
        )
        disableOrderRequest = true;
      }
      if (this.props.orders.length > 0) {
        var openOrders = (
          <div>
            <OpenOrders orders={this.props.orders}
                      onDeleteOrders={this.props.onDeleteOrders} />
            <br/>
          </div>
        )
      }else {
        var openOrders = null;
      }
      var disable = false;
      return (
        <div>
          <OrderDialog dialog={this.props.dialog}
                       balance={this.props.balance}
                       updateBalance={this.props.updateBalance}
                       closeDialog={this.props.closeDialog}
                       dialogContent={this.props.dialogContent}
                       custody={this.props.custody} />
          <h2 style={styles.title}>
            {this.props.market.title}
            {marketClosed}
          </h2>
          <div className="orderrequest-container">
            <OrderRequest openDialog={this.props.openDialog}
                         market={this.props.market}
                         disableOrderRequest={disableOrderRequest || disable}
                         custody={this.props.custody} />
          </div>
          <br/>
          <div className="orderbook-container">
            <OrderBook market={this.props.market} />
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
