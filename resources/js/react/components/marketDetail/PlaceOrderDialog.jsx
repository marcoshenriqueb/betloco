import React from 'react';
import TextField from 'material-ui/TextField';
import OrderTable from './OrderTable.jsx';
import Paper from 'material-ui/Paper';

var style = {
  input: {
    width: "100%"
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint) {
  style.input = null;
}

var PlaceOrderDialog = React.createClass({
  render: function(){
    if (this.props.dialogContent.buy) {
      var orders = this.props.dialogContent.choice.topBuys;
    }else {
      var orders = this.props.dialogContent.choice.topSells;
    }
    var orderTable = null;
    var formTitle = null;
    if (document.documentElement.clientWidth > window.gvar.breakpoint) {
      orderTable = (
        <Paper zDepth={1}
               className="order-dialog__table">
          <OrderTable buy={this.props.dialogContent.buy}
                        orders={orders}
                        headerStyle={{
                          backgroundColor:"rgb(0, 188, 212)",
                          color: "#fff",
                          fontWeight: "bold"
                        }} />
        </Paper>
      )
      formTitle = (
        <span>Nova ordem</span>
      )
    }
    var amountError = this.props.amountError ? "Digite uma quantidade" : "";
    var priceError = this.props.priceError ? "Digite um preço" : "";
    return(
      <div className="order-dialog">
        {orderTable}
        <div className="order-dialog__form">
          {formTitle}
          <TextField
            value={this.props.amount}
            onChange={this.props.handleAmountChange}
            floatingLabelText="Número de papéis"
            style={style.input}
            errorText={amountError}
          /><br />
          <TextField
            value={this.props.price}
            onChange={this.props.handlePriceChange}
            floatingLabelText="Preço (¢1 à ¢99)"
            style={style.input}
            errorText={priceError}
          /><br />
          <span className="order-dialog__form-help">O preço deve ser em centavos, de ¢1 a ¢99, representando a probabilidade de 1% a 99%.</span>
        </div>
      </div>
    )
  }
});

export default PlaceOrderDialog;
