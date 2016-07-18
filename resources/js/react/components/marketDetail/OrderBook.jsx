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
    var expanded = false;
    var content = (
      <CardText expandable={true} style={styles.cardtext} className="orderbook-card__details">
        <p className="warning">Não há ordens de {this.props.choice.title}</p>
      </CardText>
    )
    if (this.props.choice.topBuys.length > 0 || this.props.choice.topSells.length > 0) {
      expanded = true;
      content = (
        <CardText expandable={true} style={styles.cardtext} className="orderbook-card__details">
          <OrderTable buy={true}
                      orders={this.props.choice.topBuys} />

          <OrderTable buy={false}
                      orders={this.props.choice.topSells} />
        </CardText>
      )
    }
    return (
      <Card style={styles.card} className="orderbook-card" initiallyExpanded={expanded}>
        <CardHeader actAsExpander={true} showExpandableButton={true} title={"Livro de Ofertas - " + this.props.choice.title} />
        {content}
      </Card>
    );
  }
});

export default OrderBook;
