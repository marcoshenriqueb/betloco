import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  card: {
    display: 'inline-block'
  },
  cardtext: {
    paddingTop: 0,
    'display': 'flex'
  },
  rowheight:{
    height: 40
  }
}

var OrderBook = React.createClass({
  render: function() {
    var buys = null;
    if (this.props.choice.topFiveBuys.length > 0) {
      buys = this.props.choice.topFiveBuys.map((b) => {
        return <TableRow style={styles.rowheight}>
                <TableRowColumn style={styles.rowheight}>R$ {b.price}</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>{b.amount}</TableRowColumn>
              </TableRow>
      })
    }
    var sells = null;
    if (this.props.choice.topFiveSells.length > 0) {
      sells = this.props.choice.topFiveSells.map((s) => {
        return <TableRow style={styles.rowheight}>
                <TableRowColumn style={styles.rowheight}>R$ {s.price}</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>{s.amount}</TableRowColumn>
              </TableRow>
      })
    }
    return (
      <Card style={styles.card} className="orderbook-card">
        <CardHeader actAsExpander={true} showExpandableButton={true} title={"Livro de Ofertas - " + this.props.choice.title} />
        <CardText expandable={true} style={styles.cardtext} className="orderbook-card__details">
          <Table>
            <TableHeader adjustForCheckbox={false}
                         displaySelectAll={false}>
              <TableRow style={styles.rowheight}>
                <TableHeaderColumn style={styles.rowheight}>Compra</TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}></TableHeaderColumn>
              </TableRow>
              <TableRow style={styles.rowheight}>
                <TableHeaderColumn style={styles.rowheight}>Preço</TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}>Qtde</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}
                       showRowHover={true}>
              {buys}
            </TableBody>
          </Table>

          <Table>
            <TableHeader adjustForCheckbox={false}
                         displaySelectAll={false}>
              <TableRow style={styles.rowheight}>
                <TableHeaderColumn style={styles.rowheight}>Venda</TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}></TableHeaderColumn>
              </TableRow>
              <TableRow style={styles.rowheight}>
                <TableHeaderColumn style={styles.rowheight}>Preço</TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}>Qtde</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}
                       showRowHover={true}>
              {sells}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }
});

export default OrderBook;
