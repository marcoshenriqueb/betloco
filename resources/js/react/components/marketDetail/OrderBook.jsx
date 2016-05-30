import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  card: {
    display: 'inline-block'
  },
  cardpadding: {
    padding: 10
  },
  buyselllbl: {
    'fontSize': 14,
    'paddingRight': 8,
    'paddingLeft': 8
  },
  buysellbtn: {
    'minWidth': 40
  },
  cardheadertitle: {
    color: 'rgb(255,255,255)',
    'marginLeft': 8
  }
}

var OrderBook = React.createClass({
  render: function() {
    return (
      <Card style={styles.card} className="orderbook-card">
        <div className="orderbook-card__header">
          <p>Sim (70%)</p>
        </div>
        <CardActions style={styles.cardpadding}>
          <div className="orderbook-card__orders-column">
            <div className="orderbook-card__buy-column">
              <FlatButton style={styles.buysellbtn} labelStyle={styles.buyselllbl} label="Comprar" />
            </div>
            <div className="orderbook-card__sell-column">
              <FlatButton style={styles.buysellbtn} labelStyle={styles.buyselllbl} label="Vender" />
            </div>
          </div>
        </CardActions>
        <CardText expandable={true}>

        </CardText>
      </Card>
    );
  }
});

export default OrderBook;
