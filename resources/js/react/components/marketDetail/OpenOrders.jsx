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
  }
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
    var choices = {}
    this.props.choices.map((c)=> {
      choices[c.id] = c.title
    });
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
                <TableHeaderColumn>Título</TableHeaderColumn>
                <TableHeaderColumn>Tipo</TableHeaderColumn>
                <TableHeaderColumn>Qtde</TableHeaderColumn>
                <TableHeaderColumn>Preço</TableHeaderColumn>
                <TableHeaderColumn>Valor</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} deselectOnClickaway={false}>
              {this.props.orders.map((o, k)=> (
                <TableRow selected={this.state.selectedOrders.indexOf(k) >= 0} key={k}>
                  <TableRowColumn>{choices[o.choice]}</TableRowColumn>
                  <TableRowColumn>{(o.amount < 0) ? 'Venda' : 'Compra'}</TableRowColumn>
                  <TableRowColumn>{(o.amount < 0) ? o.amount*-1 : o.amount}</TableRowColumn>
                  <TableRowColumn>{o.price}</TableRowColumn>
                  <TableRowColumn>R$ {(o.amount < 0) ? o.price*o.amount*-1 : o.price*o.amount}</TableRowColumn>
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
            label="cancelar"
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
