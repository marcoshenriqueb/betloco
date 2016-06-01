import React from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
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
  },
  cardtext: {
    paddingTop: 0
  }
}

var OrderRequest = React.createClass({
  render: function() {
    return (
      <Card style={styles.card} className="orderrequest-card">
        <div className="orderrequest-card__header">
          <p>{this.props.choice.title} (70%)</p>
        </div>
        <CardActions style={styles.cardpadding}>
          <div className="orderrequest-card__orders-column">
            <div className="orderrequest-card__buy-column">
              <FlatButton style={styles.buysellbtn} labelStyle={styles.buyselllbl} label="Comprar" />
            </div>
            <div className="orderrequest-card__sell-column">
              <FlatButton style={styles.buysellbtn} labelStyle={styles.buyselllbl} label="Vender" />
            </div>
          </div>
        </CardActions>
        <CardText style={styles.cardtext} className="orderrequest-card__details">
          <span><strong>R$ 0,70</strong>/papel</span><br />
          <span><strong>0</strong> papéis em custódia</span>
        </CardText>
      </Card>
    );
  }
});

export default OrderRequest;