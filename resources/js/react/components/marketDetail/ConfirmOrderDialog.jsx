import React from 'react';
import req from 'reqwest';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  right: {
    textAlign: 'right'
  },
  header: {
    backgroundColor:window.gvar.primarycolor,
    color: window.gvar.lightcolor,
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
    fontWeight: 'bold',
    width: 200,
    paddingLeft: 24,
    paddingRight: 24
  }
}

var ConfirmOrderDialog = React.createClass({
  getInitialState: function(){
    return {
      estimatedBalance: false
    }
  },
  componentDidMount: function(){
    this.getEstimatedBalance();
  },
  getEstimatedBalance: function(){
    var preview = {
      amount: (this.props.buy) ? this.props.amount : this.props.amount*-1,
      price: this.props.price/100,
      choice__id: this.props.choice.id
    }
    var that = this;
    req('/api/transactions/balance/?preview=' + encodeURI(JSON.stringify(preview)) + '&format=json').then(function(response){
      console.log(response);
      that.setState({
        estimatedBalance: response
      });
    });
  },
  render: function(){
    var rows = [
      {
        border: false,
        th: [
          {content: 'Quantidade', style: {width:200}},
          {content: this.props.amount, style: styles.right}
        ]
      },
      {
        border: false,
        th: [
          {content: 'Preço', style: {width:200}},
          {content: this.props.price + '¢', style: styles.right}
        ]
      },
      {
        border: true,
        th: [
          {content: 'Valor Total (R$)', style: {width:200}},
          {content: (this.props.price/100)*this.props.amount, style: styles.right}
        ]
      },
      {
        border: true,
        th: [
          {content: 'Variação no Risco (R$)', style: styles.bold},
          {content: (this.state.estimatedBalance)?this.state.estimatedBalance.risk-this.props.balance.risk:'0', style: styles.boldRight}
        ]
      },
      {
        border: true,
        th: [
          {content: 'Saldo Estimado (R$)', style: styles.bold},
          {content: (this.state.estimatedBalance)?this.state.estimatedBalance.total:'0', style: styles.boldRight}
        ]
      }
    ]
    if (!this.props.buy) {
      var remaining = this.props.balance;
      rows = [
        rows[0],
        rows[1],
        rows[2],
        {
          border: true,
          th: [
            {content: 'Quantidade Restante', style: styles.bold},
            {content: this.props.custody.position - this.props.amount, style: styles.boldRight}
          ]
        },
        rows[3],
        rows[4]
      ]
    }
    if (document.documentElement.clientWidth <= window.gvar.breakpoint) {
      for (var k in rows) {
        for (var i in rows[k].th) {
          if (rows[k].th[i].style != null) {
            rows[k].th[i].style.paddingRight = 10;
            rows[k].th[i].style.paddingLeft = 10;
          }else {
            rows[k].th[i].style = {
              paddingLeft: 10,
              paddingRight: 10
            }
          }
        }
      }
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
