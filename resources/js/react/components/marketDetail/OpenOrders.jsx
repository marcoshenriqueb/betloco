import React from 'react';
import req from 'reqwest';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';

var styles = {
  noMarginTop: {
    marginTop: 0
  },
  noPaddingTop: {
    paddingTop: 0
  }
}

var OpenOrders = React.createClass({
  getInitialState: function(){
    return {
      orders: []
    }
  },
  componentDidMount: function(){
    this.getOpenOrders();
  },
  getOpenOrders: function(){
    var that = this;
    req('/api/markets/open-orders/?market=' + this.props.market_id + '&format=json').then(function(response){
      var orders = response;
      that.setState({
        orders: orders
      });
    });
  },
  render: function() {
    var choices = {}
    this.props.choices.map((c)=> {
      choices[c.id] = c.title
    });
    return (
      <Card initiallyExpanded={true}>
        <CardHeader actAsExpander={true} showExpandableButton={true} title="Ordens em aberto" />
        <CardText expandable={true} style={styles.noPaddingTop}>
          <Table>
            <TableBody showRowHover={true}>
              {this.state.orders.map((o, k)=> (
                <TableRow key={k}>
                  <TableRowColumn>{choices[o.choice]}</TableRowColumn>
                  <TableRowColumn>{o.amount}</TableRowColumn>
                  <TableRowColumn>{o.price}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }
});

export default OpenOrders;
