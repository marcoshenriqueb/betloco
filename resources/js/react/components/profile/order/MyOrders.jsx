import React from 'react';
import req from 'reqwest';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Open from 'material-ui/svg-icons/action/open-in-browser';

var style = {
  title:{
    margin: "20px 10px 10px 10px",
    fontSize: 22
  },
  firstColumn: {
    paddingRight: 10,
    paddingLeft: 10,
    width: 150
  },
  firstRowColumn: {
    fontSize:15,
    paddingRight: 10,
    paddingLeft: 10,
    width: 150
  },
  th: {
    paddingRight: 10,
    paddingLeft: 10
  },
  thBig: {
    display: 'none'
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  style.title.fontSize = 28;
  style.th.paddingLeft = 24;
  style.th.paddingRight = 24;
  style.thBig.display = 'table-cell';
  style.firstColumn.paddingLeft = 24;
  style.firstColumn.paddingRight = 24;
  style.firstColumn.width = 500;
  style.firstRowColumn.paddingLeft = 24;
  style.firstRowColumn.paddingRight = 24;
  style.firstRowColumn.width = 500;
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
    var returnTitle = function(p){
      return p.choice__market__title_short;
    }
    if (document.documentElement.clientWidth > window.gvar.breakpoint) {
      returnTitle = function(p){
        return p.choice__market__title;
      }
    }
    var rows = null;
    if (this.state.orders.length > 0) {
      rows = this.state.orders.map((o, k)=> (
        <TableRow key={k}>
          <TableRowColumn className="multiple-market-table__choice"
                          style={style.firstRowColumn}>
            {returnTitle(o)}
          </TableRowColumn>
          <TableRowColumn style={style.thBig}>{o.choice__title}</TableRowColumn>
          {
            (document.documentElement.clientWidth > window.gvar.breakpoint) ?
              (
                <TableRowColumn style={style.th}>{o.amount}</TableRowColumn>
              )
            :
              (
                <TableRowColumn style={style.th}>{(o.amount*o.price).toFixed(0)}</TableRowColumn>
              )
          }
          <TableRowColumn style={style.thBig}>{(o.price*100).toFixed(0)}¢</TableRowColumn>
          <TableRowColumn style={style.th}>
            <IndexLink to={'/app/mercado/' + o.choice__market__id + '/'}>
              <Open/>
            </IndexLink>
          </TableRowColumn>
        </TableRow>
      ));
    }
    return (
      <div>
        <h2 style={style.title}>Ordens em Aberto</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <Table>
              <TableHeader adjustForCheckbox={false}
                           displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn style={style.firstColumn}>Mercado</TableHeaderColumn>
                  <TableHeaderColumn style={style.thBig}>Posição</TableHeaderColumn>
                  <TableHeaderColumn style={style.th}>
                    {(document.documentElement.clientWidth > window.gvar.breakpoint) ? "Qtde":"R$"}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={style.thBig}>Preço</TableHeaderColumn>
                  <TableHeaderColumn style={style.th}>Link</TableHeaderColumn>
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
