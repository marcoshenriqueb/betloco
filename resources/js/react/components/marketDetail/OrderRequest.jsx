import React from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  buyselllbl: {
    'fontSize': 14,
    'paddingRight': 8,
    'paddingLeft': 8
  },
  buysellbtn: {
    'width': 87,
    'margin': 5,
    'marginLeft': 0
  }
}

export default class OrderRequest extends React.Component {
  openBuy(){
    this.props.openDialog(this.props.market, true);
  }

  openSell(){
    this.props.openDialog(this.props.market, false);
  }

  render() {
    if (this.props.custody) {
      var custody = this.props.custody;
    }else {
      var custody = 0;
    }
    var bTip = "Caso acredite que sim.";
    var sTip = "Caso acredite que não.";
    if (document.documentElement.clientWidth > window.gvar.breakpoint){
      bTip = "Clique e deixe uma ordem caso acredite que o evento ocorrerá.";
      sTip = "Clique e deixe uma ordem caso acredite que o evento não ocorrerá.";
    }
    return (
      <div className="order-request">
        <span className="order-request__subtitle">Último negócio: {(this.props.market.lastCompleteOrder!=null)?(this.props.market.lastCompleteOrder.price*100).toFixed(0):0}¢</span>
        <br/>
        <span className="order-request__subtitle">{custody} papéis em custódia</span>
        <br/>
        <br/>
        <RaisedButton primary={true} disabled={this.props.disableOrderRequest} onClick={this.openBuy.bind(this)} style={styles.buysellbtn} labelStyle={styles.buyselllbl} label="Comprar" />
        <span className="order-request__subtitle">{bTip}</span>
        <br/>
        <RaisedButton secondary={true} disabled={this.props.disableOrderRequest} onClick={this.openSell.bind(this)} style={styles.buysellbtn} labelStyle={styles.buyselllbl} label="Vender" />
        <span className="order-request__subtitle">{sTip}</span>
      </div>
    );
  }
}
