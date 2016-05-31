import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  card: {
    display: 'inline-block'
  },
  cardtext: {
    paddingTop: 0
  },
  rowheight:{
    height: 40
  }
}

var OrderBook = React.createClass({
  render: function() {
    return (
      <Card style={styles.card} className="orderbook-card">
        <CardHeader actAsExpander={true} showExpandableButton={true} title="Livro de Ofertas - Sim" />
        <CardText expandable={true} style={styles.cardtext} className="orderbook-card__details">
          <Table>
            <TableHeader adjustForCheckbox={false}
                         displaySelectAll={false}>
              <TableRow style={styles.rowheight}>
                <TableHeaderColumn style={styles.rowheight}>Compra</TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}></TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}>Venda</TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}></TableHeaderColumn>
              </TableRow>
              <TableRow style={styles.rowheight}>
                <TableHeaderColumn style={styles.rowheight}>Preço</TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}>Qtde</TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}>Preço</TableHeaderColumn>
                <TableHeaderColumn style={styles.rowheight}>Qtde</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}
                       showRowHover={true}>
              <TableRow style={styles.rowheight}>
                <TableRowColumn style={styles.rowheight}>R$ 0,70</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>100</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>R$ 0,70</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>100</TableRowColumn>
              </TableRow>
              <TableRow style={styles.rowheight}>
                <TableRowColumn style={styles.rowheight}>R$ 0,70</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>100</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>R$ 0,70</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>100</TableRowColumn>
              </TableRow>
              <TableRow style={styles.rowheight}>
                <TableRowColumn style={styles.rowheight}>R$ 0,70</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>100</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>R$ 0,70</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>100</TableRowColumn>
              </TableRow>
              <TableRow style={styles.rowheight}>
                <TableRowColumn style={styles.rowheight}>R$ 0,70</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>100</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>R$ 0,70</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>100</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }
});

export default OrderBook;
