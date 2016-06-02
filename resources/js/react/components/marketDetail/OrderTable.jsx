import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  rowheight:{
    height: 40
  },
  header: {
    height: 40
  },
  th:{
    color: 'inherit',
    fontWeight : 'inherit',
    height: 40
  }
}

var OrderTable = React.createClass({
  render: function(){
    var orders = null;
    if (this.props.orders.length > 0) {
      orders = this.props.orders.map((o, k) => {
        return <TableRow style={styles.rowheight} key={k}>
                <TableRowColumn style={styles.rowheight}>R$ {o.price.toFixed(2)}</TableRowColumn>
                <TableRowColumn style={styles.rowheight}>{o.amount}</TableRowColumn>
              </TableRow>
      })
    }
    var title = this.props.buy ? "Compra" : "Venda";
    if (this.props.headerStyle != undefined) {
      styles.header = this.props.headerStyle;
    }
    return (
      <Table>
        <TableHeader adjustForCheckbox={false}
                     displaySelectAll={false}>
          <TableRow style={styles.header}>
            <TableHeaderColumn style={styles.th}>Ofertas</TableHeaderColumn>
            <TableHeaderColumn style={styles.rowheight}></TableHeaderColumn>
          </TableRow>
          <TableRow style={styles.rowheight}>
            <TableHeaderColumn style={styles.rowheight}>Preço</TableHeaderColumn>
            <TableHeaderColumn style={styles.rowheight}>Qtde</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}
                   showRowHover={true}>
          {orders}
        </TableBody>
      </Table>
    );
  }
});

export default OrderTable;
