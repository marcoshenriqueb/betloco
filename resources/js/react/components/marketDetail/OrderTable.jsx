import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  rowheight:{
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    cursor: 'pointer'
  },
  rowheightHeader:{
    height: 40,
    paddingRight: 10,
    paddingLeft: 10
  },
  header: {
    height: 40
  },
  th:{
    color: 'inherit',
    fontWeight : 'inherit',
    height: 40,
    paddingRight: 10,
    paddingLeft: 10
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  styles.rowheight.paddingRight = 24;
  styles.rowheight.paddingLeft = 24;
  styles.rowheightHeader.paddingRight = 24;
  styles.rowheightHeader.paddingLeft = 24;
  styles.th.paddingRight = 24;
  styles.th.paddingLeft = 24;
}

export default class OrderTable extends React.Component {
  render(){
    var orders = null;
    if (this.props.orders.length > 0) {
      orders = this.props.orders.map((o, k) => {
        var openDialogWithOrder = (e) => {
          this.props.openDialog(this.props.market, !this.props.buy, o);
        }
        return <TableRow style={styles.rowheight} key={k} onTouchTap={openDialogWithOrder}>
                <TableRowColumn style={styles.rowheight}>
                  {(!this.props.inverted)?(o.price*100).toFixed(0) + '¢':o.amount}
                </TableRowColumn>
                <TableRowColumn style={styles.rowheight}>
                  {(!this.props.inverted)?o.amount:(o.price*100).toFixed(0) + '¢'}
                </TableRowColumn>
              </TableRow>
      })
    }
    var title = this.props.buy ? "Compra" : "Venda";
    if (this.props.headerStyle != undefined && this.props.headerStyle != false) {
      styles.header = this.props.headerStyle;
    }
    var title = this.props.buy ? "Compra" : "Venda";
    return (
      <Table>
        <TableHeader adjustForCheckbox={false}
                     displaySelectAll={false}>
          <TableRow style={styles.header}>
            <TableHeaderColumn style={styles.th}>{title}</TableHeaderColumn>
            <TableHeaderColumn style={styles.rowheightHeader}></TableHeaderColumn>
          </TableRow>
          <TableRow style={styles.rowheightHeader}>
            <TableHeaderColumn style={styles.rowheightHeader}>
              {(!this.props.inverted)?'Preço':'Qtde'}
            </TableHeaderColumn>
            <TableHeaderColumn style={styles.rowheightHeader}>
              {(!this.props.inverted)?'Qtde':'Preço'}
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}
                   showRowHover={true}>
          {orders}
        </TableBody>
      </Table>
    );
  }
}
