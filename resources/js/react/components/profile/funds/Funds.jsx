import React from 'react';
import req from 'reqwest';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

var styles = {
  firstColumn: {
    width: 700,
    fontSize: 18
  },
  secondColumn: {
    fontSize: 18,
    textAlign: 'right'
  }
}

var Funds = React.createClass({
  getInitialState: function() {
    return {
      funds: []
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
    return (
      <div>
        <h2 style={{marginTop:20}}>Fundos</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <Table>
              <TableBody displayRowCheckbox={false}
                         showRowHover={true}>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={styles.firstColumn}>
                    Saldo disponível (R$)
                  </TableRowColumn>
                  <TableRowColumn style={styles.secondColumn}>{this.state.funds.total}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={styles.firstColumn}>
                    Saldo de transações (R$)
                  </TableRowColumn>
                  <TableRowColumn style={styles.secondColumn}>{this.state.funds.transactions}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={styles.firstColumn}>
                    Provisão em ordens de compra pendentes (R$)
                  </TableRowColumn>
                  <TableRowColumn style={styles.secondColumn}>{this.state.funds.buyOrders}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={styles.firstColumn}>
                    Ganhos/Perdas em operações (R$)
                  </TableRowColumn>
                  <TableRowColumn style={styles.secondColumn}>{this.state.funds.operations}</TableRowColumn>
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
