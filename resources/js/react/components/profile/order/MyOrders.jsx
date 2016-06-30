import React from 'react';
import req from 'reqwest';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Open from 'material-ui/svg-icons/action/open-in-browser';

var styles = {
  firstColumn: {
    width: 500
  }
}

var MyOrders = React.createClass({
  getInitialState: function() {
    return {
      orders: []
    };
  },
  getOrders: function(){
    var that = this;
    req('/api/markets/open-orders/?format=json').then(function(response){
      var orders = response;
      that.setState({
        orders: orders
      });
    });
  },
  componentDidMount: function() {
    this.getOrders();
  },
  render: function(){
    var rows = null;
    if (this.state.orders.length > 0) {
      rows = this.state.orders.map((o, k)=> (
        <TableRow key={k}>
          <TableRowColumn className="multiple-market-table__choice"
                          style={{width:styles.firstColumn.width, fontSize:15}}>
            {o.choice__market__title}
          </TableRowColumn>
          <TableRowColumn>{o.choice__title}</TableRowColumn>
          <TableRowColumn>{o.amount}</TableRowColumn>
          <TableRowColumn>{o.price}</TableRowColumn>
          <TableRowColumn>
            <IndexLink to={'/app/mercado/' + o.choice__market__id + '/'}>
              <Open/>
            </IndexLink>
          </TableRowColumn>
        </TableRow>
      ));
    }
    return (
      <div>
        <h2 style={{marginTop:20}}>Posições em Aberto</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <Table>
              <TableHeader adjustForCheckbox={false}
                           displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn style={styles.firstColumn}>Mercado</TableHeaderColumn>
                  <TableHeaderColumn>Posição</TableHeaderColumn>
                  <TableHeaderColumn>Qtde</TableHeaderColumn>
                  <TableHeaderColumn>Preço R$</TableHeaderColumn>
                  <TableHeaderColumn>Link</TableHeaderColumn>
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

export default MyOrders;
