import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import {
  getEstimatedBalance
} from '../../redux/actions/profile/userActions';

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

class ConfirmOrderDialog extends React.Component {

  componentDidMount(){
    this.getEstimatedBal();
  }

  getEstimatedBal(){
    var preview = {
      amount: (this.props.buy) ? this.props.amount : this.props.amount*-1,
      price: this.props.price/100,
      market__id: this.props.market.id
    }
    this.props.getEstimatedBalance(preview);
  }

  render(){
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
          {content: ((this.props.price/100)*this.props.amount).toFixed(2), style: styles.right}
        ]
      },
      {
        border: true,
        th: [
          {content: 'Variação no Risco (R$)', style: styles.bold},
          {content: (this.props.estimatedBalance)?(this.props.estimatedBalance.risk-this.props.balance.risk).toFixed(2):'0', style: styles.boldRight}
        ]
      },
      {
        border: true,
        th: [
          {content: 'Saldo Estimado (R$)', style: styles.bold},
          {content: (this.props.estimatedBalance)?(this.props.estimatedBalance.total).toFixed(2):'0', style: styles.boldRight}
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
            {content: this.props.custody - this.props.amount, style: styles.boldRight}
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
}

function mapStateToProps(state){
  return {
    estimatedBalance: state.profileUser.estimatedBalance
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getEstimatedBalance
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ConfirmOrderDialog);
