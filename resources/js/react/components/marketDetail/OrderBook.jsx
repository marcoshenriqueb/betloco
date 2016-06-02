import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import OrderTable from './OrderTable.jsx';

var styles = {
  card: {
    display: 'inline-block'
  },
  cardtext: {
    paddingTop: 0,
    'display': 'flex'
  }
}

var OrderBook = React.createClass({
  render: function() {
    return (
      <Card style={styles.card} className="orderbook-card">
        <CardHeader actAsExpander={true} showExpandableButton={true} title={"Livro de Ofertas - " + this.props.choice.title} />
        <CardText expandable={true} style={styles.cardtext} className="orderbook-card__details">
          <OrderTable buy={true}
                      orders={this.props.choice.topFiveBuys} />

          <OrderTable buy={false}
                      orders={this.props.choice.topFiveSells} />
        </CardText>
      </Card>
    );
  }
});

export default OrderBook;
