import React from 'react';
import req from 'reqwest';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

var styles = {
  firstColumn: {
    width: 450
  }
}

var MyHistory = React.createClass({
  getInitialState: function() {
    return {
      history: []
    };
  },
  getHistory: function(){
    var that = this;
    req('/api/markets/my-history/?format=json').then(function(response){
      var history = response;
      that.setState({
        history: history
      });
    });
  },
  componentDidMount: function() {
    this.getHistory();
  },
  render: function(){
    var rows = null;
    if (this.state.history.length > 0) {
      rows = this.state.history.map((h, k)=> (
        <TableRow key={k}>
          <TableRowColumn className="multiple-market-table__choice"
                          style={{width:styles.firstColumn.width, fontSize:14}}>
            {h.choice__market__title}
          </TableRowColumn>
          <TableRowColumn style={{width:80}}>{h.choice__title}</TableRowColumn>
          <TableRowColumn>{h.amount_sum}</TableRowColumn>
          <TableRowColumn>{h.price_avg.toFixed(2) * h.amount_sum}</TableRowColumn>
          <TableRowColumn style={{width:180}}>{moment(h.created_at).format('DD/MM/YYYY HH:mm')}</TableRowColumn>
        </TableRow>
      ));
    }
    return (
      <div>
        <h2 style={{marginTop:20}}>Histórico de transações</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <Table>
              <TableHeader adjustForCheckbox={false}
                           displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn style={styles.firstColumn}>Mercado</TableHeaderColumn>
                  <TableHeaderColumn style={{width:80}}>Posição</TableHeaderColumn>
                  <TableHeaderColumn>Qtde</TableHeaderColumn>
                  <TableHeaderColumn>Valor (R$)</TableHeaderColumn>
                  <TableHeaderColumn style={{width:180}}>Data Ordem</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}
                         showRowHover={true}>
                {rows}
              </TableBody>
            </Table>
          </CardText>
        </Card>
      </div>
    )
  }
});

export default MyHistory;
