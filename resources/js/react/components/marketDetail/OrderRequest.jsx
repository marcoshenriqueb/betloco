import React from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  card: {
    display: 'inline-block',
    marginBottom: 10
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
    'minWidth': 40,
    'margin': 5
  },
  cardheadertitle: {
    color: 'rgb(255,255,255)',
    'marginLeft': 8
  },
  cardtext: {
    paddingTop: 0
  }
}

var OrderRequest = React.createClass({
  openBuy: function(){
    this.props.openDialog(this.props.choice, true);
  },
  openSell: function(){
    this.props.openDialog(this.props.choice, false);
  },
  render: function() {
    if (this.props.custody) {
      var custody = this.props.custody;
    }else {
      var custody = {
        position: 0
      };
    }
    var disableSell = this.props.disableOrderRequest || custody.position == 0;
    return (
      <Card style={styles.card} className="orderrequest-card">
        <div className="orderrequest-card__header">
          <p>{this.props.choice.title} ({this.props.choice.lastCompleteOrder != null ? (this.props.choice.lastCompleteOrder.price * 100).toFixed(0) : 0}%)</p>
        </div>
        <CardActions style={styles.cardpadding}>
          <div className="orderrequest-card__orders-column">
            <div className="orderrequest-card__buy-column">
              <RaisedButton primary={true} disabled={this.props.disableOrderRequest} onClick={this.openBuy} style={styles.buysellbtn} labelStyle={styles.buyselllbl} label="Comprar" />
            </div>
            <div className="orderrequest-card__sell-column">
              <RaisedButton secondary={true} disabled={disableSell} onClick={this.openSell} style={styles.buysellbtn} labelStyle={styles.buyselllbl} label="Vender" />
            </div>
          </div>
        </CardActions>
        <CardText style={styles.cardtext} className="orderrequest-card__details">
          <span><strong>{custody.position}</strong> papéis em custódia</span>
        </CardText>
      </Card>
    );
  }
});

export default OrderRequest;
