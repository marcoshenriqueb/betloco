import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  right: {
    textAlign: 'right'
  },
  header: {
    backgroundColor:"rgb(0, 188, 212)",
    color: "#fff",
    fontWeight: "bold"
  },
  th:{
    color: 'inherit',
    fontWeight : 'inherit'
  },
  boldRight: {
    fontWeight: 'bold',
    textAlign: 'right'
  },
  bold:{
    fontWeight: 'bold'
  }
}

var ConfirmOrderDialog = React.createClass({
  render: function(){
    var total = this.props.amount * (this.props.price / 100);
    var rows = [
      {
        border: false,
        th: [
          {content: 'Quantidade', style: null},
          {content: this.props.amount, style: styles.right}
        ]
      },
      {
        border: false,
        th: [
          {content: 'Preço', style: null},
          {content: this.props.price / 100, style: styles.right}
        ]
      },
      {
        border: true,
        th: [
          {content: 'Valor Total', style: null},
          {content: "R$" + total, style: styles.right}
        ]
      }
    ]
    if (this.props.buy) {
      var remaining = this.props.balance - total;
      rows = rows.concat([
        {
          border: true,
          th: [
            {content: 'Valor Disponível', style: styles.bold},
            {content: 'R$' + this.props.balance, style: styles.boldRight}
          ]
        },
        {
          border: true,
          th: [
            {content: 'Valor Restante', style: styles.bold},
            {content: 'R$' + remaining, style: styles.boldRight}
          ]
        }
      ])
    }else {
      var remaining = this.props.custody.position - this.props.amount;
      rows = rows.concat([
        {
          border: true,
          th: [
            {content: 'Quantidade Disponível', style: styles.bold},
            {content: this.props.custody.position, style: styles.boldRight}
          ]
        },
        {
          border: true,
          th: [
            {content: 'Quantidade Restante', style: styles.bold},
            {content: remaining, style: styles.boldRight}
          ]
        }
      ])
    }
    return(
      <div>
        <Table>
          <TableHeader adjustForCheckbox={false}
                       displaySelectAll={false}>
            <TableRow style={styles.header}>
              <TableHeaderColumn style={styles.th}>Resumo</TableHeaderColumn>
              <TableHeaderColumn></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}
                     showRowHover={true}>
            {rows.map((r, k) => (
              <TableRow displayBorder={r.border} key={k}>
                {r.th.map((t, i) => (
                  <TableRowColumn key={i} style={t.style}>{t.content}</TableRowColumn>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
});

export default ConfirmOrderDialog;
