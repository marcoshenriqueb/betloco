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

export default class OrderBook extends React.Component {
  render() {
    var expanded = false;
    var content = (
      <CardText expandable={true} style={styles.cardtext} className="orderbook-card__details">
        <p className="warning">Não há ordens nesse mercado</p>
      </CardText>
    )
    if (this.props.market.topBuys.length > 0 || this.props.market.topSells.length > 0) {
      expanded = true;
      content = (
        <CardText expandable={true} style={styles.cardtext} className="orderbook-card__details">
          <OrderTable buy={true}
                      inverted={true}
                      headerStyle={{}}
                      openDialog={this.props.openDialog}
                      market={this.props.market}
                      orders={this.props.market.topSells} />

          <OrderTable buy={false}
                      headerStyle={{}}
                      openDialog={this.props.openDialog}
                      market={this.props.market}
                      orders={this.props.market.topBuys} />
        </CardText>
      )
    }
    return (
      <Card style={styles.card} className="orderbook-card" initiallyExpanded={expanded}>
        <CardHeader actAsExpander={true} showExpandableButton={true} title="Livro de Ofertas" />
        {content}
      </Card>
    );
  }
}
