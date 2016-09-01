import React from 'react';
import TextField from 'material-ui/TextField';
import OrderTable from './OrderTable.jsx';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import RaisedButton from 'material-ui/RaisedButton';
import Money from 'material-ui/svg-icons/editor/attach-money';

var style = {
  input: {
    width: "100%"
  },
  icon: {
    fill: window.gvar.primarycolor,
    marginTop: 15
  }
}

var PlaceOrderDialog = React.createClass({
  render: function(){
    if (this.props.dialogContent.buy) {
      var orders = this.props.dialogContent.market.topBuys;
    }else {
      var orders = this.props.dialogContent.market.topSells;
    }
    var orderTable = null;
    var formTitle = null;
    var bestOfferButton = false;
    var bestPrice = '--';
    if (orders.length > 0) {
      bestOfferButton = true;
      bestPrice = (orders[0].price*100).toFixed(0) + '¢'
    }
    if (document.documentElement.clientWidth > window.gvar.breakpoint) {
      orderTable = (
        <Paper zDepth={1}
               className="order-dialog__table">
          <OrderTable buy={this.props.dialogContent.buy}
                        orders={orders}
                        headerStyle={{
                          backgroundColor:window.gvar.primarycolor,
                          color: window.gvar.lightcolor,
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
                <RaisedButton
                  label={bestPrice}
                  labelPosition="before"
                  style={{marginTop:20}}
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
