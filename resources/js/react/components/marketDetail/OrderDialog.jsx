import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PlaceOrderDialog from './PlaceOrderDialog.jsx';
import ConfirmOrderDialog from './ConfirmOrderDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import {
  handleAmountChange,
  removeAmount,
  addAmount,
  handlePriceChange,
  addBestPrice,
  handleOrder,
  returnStep,
  resetOrderState
} from '../../redux/actions/orderActions';

class OrderDialog extends React.Component {
  handleConfirmOrder(){
    this.setState({
      disabled: true
    });
    var amount = this.props.dialogContent.buy ? this.state.amount : this.state.amount * -1;
    var data = {
      price: this.state.price / 100,
      amount: amount,
      market: this.props.dialogContent.market.id
    };
    var that = this;
    req({
      url: '/api/markets/order/?format=json',
      headers: {
        'X-CSRFToken': document.getElementById('token').getAttribute('value')
      },
      method: 'post',
      data: data
    }).then(function(response){
      that.returnStepAndClose();
      that.props.updateBalance();
    }).catch(function(response){
      if (response.status == 400) {
        that.setState({
          error: JSON.parse(response.response).non_field_errors[0]
        });
      }
    });
  }

  returnStepAndClose(){
    this.props.resetOrderState();
    this.props.closeDialog();
  }

  render(){
    var styles = {
      dialog:{
        width: "100%"
      },
      body: {
        padding: "0px 10px 10px 10px",
        minHeight: 250
      }
    }
    var autoScroll = true;
    if (document.documentElement.clientWidth > window.gvar.breakpoint){
      styles.dialog.width = 556;
      styles.body.padding = "0px 24px 24px 24px";
      autoScroll = false;
    }
    if (this.props.dialogContent == undefined) {
      return (<div/>)
    }
    var title = this.props.dialogContent.buy ? 'Comprar' : 'Vender';
    var btnColor = this.props.dialogContent.buy ? window.gvar.successcolor : window.gvar.warningcolor;
    if (this.state.content == 0) {
      var actions = [
        <FlatButton
          label="Cancelar"
          primary={true}
          onTouchTap={this.returnStepAndClose.bind(this)}
        />,
        <RaisedButton
          label={this.props.dialogContent.buy ? 'Comprar' : 'Vender'}
          backgroundColor={btnColor}
          labelColor="white"
          onTouchTap={this.handleOrder}
        />,
      ];
      var content = (
        <PlaceOrderDialog closeDialog={this.props.closeDialog}
                          dialogContent={this.props.dialogContent}
                          amount={this.state.amount}
                          amountError={this.state.amountError}
                          price={this.state.price}
                          priceError={this.state.priceError}
                          handleAmountChange={this.handleAmountChange}
                          handlePriceChange={this.handlePriceChange}
                          addAmount={this.addAmount}
                          removeAmount={this.removeAmount}
                          addBestPrice={this.addBestPrice} />
      );
    }else if (1) {
      var actions = [
        <FlatButton
          label="Cancelar"
          primary={true}
          onTouchTap={this.returnStepAndClose.bind(this)}
        />,
        <RaisedButton
          label="Confirmar"
          backgroundColor={btnColor}
          labelColor="white"
          onTouchTap={this.handleConfirmOrder}
          disabled={this.state.disabled}
        />,
        <FlatButton
          label="Voltar"
          primary={true}
          onTouchTap={this.returnStep}
          style={{float:'left'}}
        />,
      ];
      var content = (
        <ConfirmOrderDialog amount={this.state.amount}
                            buy={this.props.dialogContent.buy}
                            market={this.props.dialogContent.market}
                            price={this.state.price}
                            balance={this.props.balance}
                            custody={this.props.custody} />
      );
    }
    var error = null;
    if (this.state.error) {
      error = (<p className="error-warning">{this.state.error}</p>)
    }
    return (
      <Dialog
          title={title}
          contentStyle={styles.dialog}
          bodyStyle={styles.body}
          actions={actions}
          autoDetectWindowHeight={false}
          repositionOnUpdate={true}
          autoScrollBodyContent={autoScroll}
          modal={false}
          open={this.props.dialog}>
        {content}
        {error}
      </Dialog>
    );
  }
}

function mapStateToProps(state){
  return {
    amount: state.order.amount,
    amountError: state.order.amountError,
    price: state.order.price,
    priceError: state.order.priceError,
    content: state.order.content,
    error: state.order.error,
    disabled: state.order.disabled
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    handleAmountChange,
    removeAmount,
    addAmount,
    handlePriceChange,
    addBestPrice,
    handleOrder,
    returnStep,
    resetOrderState
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(OrderDialog);
