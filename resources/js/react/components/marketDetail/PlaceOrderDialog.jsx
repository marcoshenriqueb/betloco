import React from 'react';
import TextField from 'material-ui/TextField';
import OrderTable from './OrderTable.jsx';
import Paper from 'material-ui/Paper';

var PlaceOrderDialog = React.createClass({
  render: function(){
    if (this.props.dialogContent.buy) {
      var orders = this.props.dialogContent.choice.topFiveBuys;
    }else {
      var orders = this.props.dialogContent.choice.topFiveSells;
    }
    var amountError = this.props.amountError ? "Digite uma quantidade" : "";
    var priceError = this.props.priceError ? "Digite um preço" : "";
    return(
      <div className="order-dialog">
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
        <div className="order-dialog__form">
          <span>Nova ordem</span><br/>
          <TextField
            value={this.props.amount}
            onChange={this.props.handleAmountChange}
            floatingLabelText="Número de papéis"
            errorText={amountError}
          /><br />
          <TextField
            value={this.props.price}
            onChange={this.props.handlePriceChange}
            floatingLabelText="Preço (¢1 à ¢99)"
            errorText={priceError}
          /><br />
        </div>
      </div>
    )
  }
});

export default PlaceOrderDialog;
