import React from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward';
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
  },
  varIcon: {
    height: 14,
    width: 14,
    position: 'relative',
    top: 2
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
    let price = (this.props.market.lastCompleteOrder!=null)?
                ' '+(this.props.market.lastCompleteOrder.price*100).toFixed(0):0;
    let change = null;
    let icon = null;
    let className = null;
    if (this.props.market.lastCompleteOrder!=null && this.props.market.lastDayPrice!=undefined) {
      if (this.props.market.lastCompleteOrder.price-this.props.market.lastDayPrice > 0) {
        change = (this.props.market.lastCompleteOrder.price-this.props.market.lastDayPrice)*100;
        change = change.toFixed(0) + '¢';
        icon = <ArrowUp color={window.gvar.positivecolor} style={styles.varIcon}/>;
        className = 'positive-color';
      }else if (this.props.market.lastCompleteOrder.price-this.props.market.lastDayPrice < 0) {
        change = (this.props.market.lastCompleteOrder.price-this.props.market.lastDayPrice)*-100;
        change = change.toFixed(0) + '¢';
        icon = <ArrowDown color={window.gvar.negativecolor} style={styles.varIcon}/>;
        className = 'negative-color';
      }
      // let change = ()?
      //              ((this.props.market.lastCompleteOrder.price-this.props.market.lastDayPrice)*100).toFixed(0) :
      //              0
    }
    return (
      <div className="order-request">
        <p className="order-request__subtitle">
          Último negócio:
          {price}¢
          <span className={className}>
            {icon}
            {change}
          </span>
        </p>
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
