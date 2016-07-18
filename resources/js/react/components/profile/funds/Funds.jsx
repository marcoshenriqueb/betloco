import React from 'react';
import req from 'reqwest';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

var style = {
  firstColumn: {
    paddingRight: 10,
    paddingLeft: 10,
    width: 200,
    fontSize: 15
  },
  secondColumn: {
    fontSize: 15,
    textAlign: 'right',
    paddingRight: 10,
    paddingLeft: 10
  },
  title:{
    margin: "20px 10px 10px 10px",
    fontSize: 22
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  style.title.fontSize = 28;
  style.firstColumn.paddingLeft = 24;
  style.firstColumn.paddingRight = 24;
  style.firstColumn.width = 700;
  style.secondColumn.paddingLeft = 24;
  style.secondColumn.paddingRight = 24;
}

var Funds = React.createClass({
  getInitialState: function() {
    return {
      funds: false
    };
  },
  getFunds: function(){
    var that = this;
    req('/api/transactions/balance/?format=json').then(function(response){
      var funds = response;
      that.setState({
        funds: funds
      });
    });
  },
  componentDidMount: function() {
    this.getFunds();
  },
  render: function(){
    if (this.state.funds === false) {
      return (
        <div>
          <h2 style={style.title}>Fundos</h2>
          <br/>
          <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
            <div className="bouncer">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
          <br/>
        </div>
      )
    }
    return (
      <div>
        <h2 style={style.title}>Fundos</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <Table>
              <TableBody displayRowCheckbox={false}
                         showRowHover={true}>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={style.firstColumn}>
                    Saldo disponível (R$)
                  </TableRowColumn>
                  <TableRowColumn style={style.secondColumn}>{this.state.funds.total}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={style.firstColumn}>
                    Saldo de transações (R$)
                  </TableRowColumn>
                  <TableRowColumn style={style.secondColumn}>{this.state.funds.transactions}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={style.firstColumn}>
                    Provisão em ordens (R$)
                  </TableRowColumn>
                  <TableRowColumn style={style.secondColumn}>{this.state.funds.buyOrders}</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </CardText>
        </Card>
      </div>
    )
  }
});

export default Funds;
