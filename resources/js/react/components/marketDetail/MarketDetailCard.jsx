import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import OrderRequest from './OrderRequest.jsx';
import OrderBook from './OrderBook.jsx';
import Details from './Details.jsx';
import OrderDialog from './OrderDialog.jsx';

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
          <OrderDialog dialog={this.props.dialog}
                       closeDialog={this.props.closeDialog}
                       dialogContent={this.props.dialogContent} />
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
