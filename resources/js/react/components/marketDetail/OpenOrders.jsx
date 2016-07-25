import React from 'react';
import req from 'reqwest';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

var styles = {
  noMarginTop: {
    marginTop: 0
  },
  noPaddingTop: {
    paddingTop: 0
  },
  th: {
    paddingRight: 10,
    paddingLeft: 10
  },
  thBig: {
    display: 'none',
    paddingRight: 10,
    paddingLeft: 10
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  styles.thBig.display = "table-cell";
  styles.thBig.paddingRight = 24;
  styles.thBig.paddingLeft = 24;
  styles.th.paddingRight = 24;
  styles.th.paddingLeft = 24;
}

var OpenOrders = React.createClass({
  getInitialState:function(){
    return {
      delete: false,
      selectedOrders : [],
      selectable: true
    }
  },
  rowSelected : function(rows){
    if (rows.length > 0) {
      this.setState({
        delete: true,
        selectedOrders: rows
      });
    }else {
      this.setState({
        delete: false,
        selectedOrders: rows
      });
    }
  },
  onCancelClick: function(){
    this.setState({
      delete: false,
      selectedOrders: []
    });
  },
  onDeleteClick: function(){
    var that = this;
    var deleted = this.props.orders.filter(function(v, k){
      return that.state.selectedOrders.indexOf(k) >= 0;
    });
    this.props.onDeleteOrders(deleted);
    this.setState({
      delete: false,
      selectable: false
    });
  },
  componentWillReceiveProps: function(){
    this.setState({
      selectable: true,
      selectedOrders: []
    });
  },
  render: function() {
    var calculateAmount = function(a){
      return a;
    }
    if (document.documentElement.clientWidth > window.gvar.breakpoint) {
      calculateAmount = function(a){
        return (a < 0) ? a*-1 : a;
      }
    }
    return (
      <Card initiallyExpanded={true}>
        <CardHeader actAsExpander={true} showExpandableButton={true} title="Minhas Ordens em aberto" />
        <CardText expandable={true} style={styles.noPaddingTop}>
          <Table multiSelectable={true}
                 onRowSelection={this.rowSelected}
                 selectable={this.state.selectable}>
          <TableHeader enableSelectAll={false}
                       displaySelectAll={true}
                       adjustForCheckbox={true}>
              <TableRow>
                <TableHeaderColumn style={styles.thBig}>Tipo</TableHeaderColumn>
                <TableHeaderColumn style={styles.th}>Qtde</TableHeaderColumn>
                <TableHeaderColumn style={styles.th}>Preço</TableHeaderColumn>
                <TableHeaderColumn style={styles.thBig}>Valor</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} deselectOnClickaway={false}>
              {this.props.orders.map((o, k)=> (
                <TableRow selected={this.state.selectedOrders.indexOf(k) >= 0} key={k}>
                  <TableRowColumn style={styles.thBig}>{(o.amount < 0) ? 'Venda' : 'Compra'}</TableRowColumn>
                  <TableRowColumn style={styles.th}>{calculateAmount(o.amount)}</TableRowColumn>
                  <TableRowColumn style={styles.th}>{(o.price*100).toFixed(0)}¢</TableRowColumn>
                  <TableRowColumn style={styles.thBig}>R$ {((o.amount < 0) ? o.price*o.amount*-1 : o.price*o.amount).toFixed(2)}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <RaisedButton
            icon={<ActionDelete />}
            secondary={true}
            onTouchTap={this.onDeleteClick}
            disabled={!this.state.delete}
            style={{
              margin: 12,
            }}
          />
          <FlatButton
            label="desmarcar"
            onTouchTap={this.onCancelClick}
            style={{
              margin: 12,
            }}
          />
        </CardText>
      </Card>
    );
  }
});

export default OpenOrders;
