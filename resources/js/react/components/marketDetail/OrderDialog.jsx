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
  resetOrderState,
  addBookOrder,
  handleConfirmOrder
} from '../../redux/actions/orderActions';

class OrderDialog extends React.Component {
  handleConfirmOrderAndCallback(){
    this.props.handleConfirmOrder(()=>{
      this.returnStepAndClose();
      this.props.updateBalance();
    })
  }

  componentDidUpdate(prevProps){
    if (this.props.content == 0 && this.props.dialogContent != undefined && prevProps.dialogContent == undefined) {
      if (this.props.dialogContent.order == undefined) {
        this.props.addBestPrice();
      }else {
        this.props.addBookOrder(this.props.dialogContent.order);
      }
    }
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
    if (this.props.content == 0) {
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
          onTouchTap={this.props.handleOrder}
        />,
      ];
      var content = (
        <PlaceOrderDialog closeDialog={this.props.closeDialog}
                          dialogContent={this.props.dialogContent}
                          amount={this.props.amount}
                          amountError={this.props.amountError}
                          price={this.props.price}
                          priceError={this.props.priceError}
                          handleAmountChange={this.props.handleAmountChange}
                          handlePriceChange={this.props.handlePriceChange}
                          addAmount={this.props.addAmount}
                          removeAmount={this.props.removeAmount}
                          addBestPrice={this.props.addBestPrice} />
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
          onTouchTap={this.handleConfirmOrderAndCallback.bind(this)}
          disabled={this.props.disabled}
        />,
        <FlatButton
          label="Voltar"
          primary={true}
          onTouchTap={this.props.returnStep}
          style={{float:'left'}}
        />,
      ];
      var content = (
        <ConfirmOrderDialog amount={this.props.amount}
                            buy={this.props.dialogContent.buy}
                            market={this.props.dialogContent.market}
                            price={this.props.price}
                            balance={this.props.balance}
                            custody={this.props.custody} />
      );
    }
    var error = null;
    if (this.props.error) {
      error = (<p className="error-warning">{this.props.error}</p>)
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
    resetOrderState,
    addBookOrder,
    handleConfirmOrder
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(OrderDialog);
