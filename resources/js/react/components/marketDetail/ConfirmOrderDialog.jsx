import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  right: {
    textAlign: 'right'
  }
}

var ConfirmOrderDialog = React.createClass({
  render: function(){
    var total = this.props.amount * (this.props.price / 100);
    return(
      <Table>
        <TableHeader adjustForCheckbox={false}
                     displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>Resumo</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}
                   showRowHover={true}>
          <TableRow>
            <TableRowColumn>Quantidade</TableRowColumn>
            <TableRowColumn style={styles.right}>{this.props.amount}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Preço</TableRowColumn>
            <TableRowColumn style={styles.right}>R${this.props.price / 100}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Valor total</TableRowColumn>
            <TableRowColumn style={styles.right}>R${total}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Valor disponível</TableRowColumn>
            <TableRowColumn style={styles.right}>R$10000</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>Valor remanescente</TableRowColumn>
            <TableRowColumn style={styles.right}>R${10000 - total}</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
});

export default ConfirmOrderDialog;
