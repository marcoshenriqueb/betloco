import React from 'react';
import TextField from 'material-ui/TextField';
import OrderTable from './OrderTable.jsx';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import FlatButton from 'material-ui/FlatButton';
import Money from 'material-ui/svg-icons/editor/attach-money';

var primarycolor = window.gvar.primarycolor;
var style = {
  input: {
    width: "100%"
  },
  icon: {
    fill: primarycolor,
    marginTop: 15
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
    var bestOfferButton = false;
    if (orders.length > 0) {
      bestOfferButton = true;
    }
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
          <div className="order-dialog__form__inputs__container">
            <div className="order-dialog__form__inputs">
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
              />
            </div>
            <div className="order-dialog__form__buttons">
              <div>
                <IconButton iconStyle={style.icon}
                            tooltip="Diminui 100"
                            touch={true}
                            tooltipPosition="bottom-left"
                            style={{marginRight: 15}}
                            onTouchTap={this.props.removeAmount}>
                  <ContentRemove />
                </IconButton>
                <IconButton iconStyle={style.icon}
                            tooltip="Aumenta 100"
                            touch={true}
                            tooltipPosition="bottom-left"
                            onTouchTap={this.props.addAmount} >
                  <ContentAdd />
                </IconButton>
              </div>
              <div>
                <FlatButton
                  label="Melhor oferta"
                  keyboardFocused={true}
                  labelPosition="before"
                  style={{marginTop:20}}
                  primary={true}
                  onTouchTap={this.props.addBestPrice}
                  disabled={!bestOfferButton}
                />
              </div>
            </div>
          </div>
          <br />
          <span className="order-dialog__form-help">O preço deve ser em centavos, de ¢1 a ¢99, representando a probabilidade de 1% a 99%.</span>
        </div>
      </div>
    )
  }
});

export default PlaceOrderDialog;
