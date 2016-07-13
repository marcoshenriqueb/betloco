import React from 'react';
import req from 'reqwest';
import PlaceOrderDialog from './PlaceOrderDialog.jsx';
import ConfirmOrderDialog from './ConfirmOrderDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

var OrderDialog = React.createClass({
  getInitialState: function(){
    return {
      amount: '',
      amountError: false,
      price: '',
      priceError: false,
      content: 0,
      error: false,
      disabled: false
    };
  },
  componentDidUpdate: function(props, state){
    console.log(state);
  },
  handleAmountChange: function(e){
    if (!isNaN(e.target.value) && Number.isInteger(Number(e.target.value))) {
      var amount = Number(e.target.value);
      if (Number(e.target.value) == 0) {
        amount = '';
      }
      this.setState({
        amount: amount
      })
    }
  },
  handlePriceChange: function(e){
    if (!isNaN(e.target.value) && e.target.value < 100 && e.target.value >= 0 && Number.isInteger(Number(e.target.value))) {
      var price = Number(e.target.value);
      if (Number(e.target.value) == 0) {
        price = '';
      }
      this.setState({
        price: price
      })
    }
  },
  handleOrder: function(){
    if (this.state.amount.length != 0) {
      if (this.state.price.length != 0) {
        this.setState({
          content: 1,
          priceError: false,
          amountError: false
        });
      }else {
        this.setState({
          priceError: true,
          amountError: false
        });
      }
    }else {
      this.setState({
        amountError: true
      });
    }
  },
  handleConfirmOrder:function(){
    this.setState({
      disabled: true
    });
    var choiceId = this.props.dialogContent.choice.id
    if (this.props.dialogContent.buy && (this.state.price/100)*this.state.amount > this.props.balance) {
      this.setState({
        error: "Saldo insuficiente para completar a operação!"
      });
    }else if (!this.props.dialogContent.buy && this.state.amount > this.props.custody[choiceId].position) {
      this.setState({
        error: "Quantidade em custódia insuficiente para realizar a venda!"
      });
    }else {
      var amount = this.props.dialogContent.buy ? this.state.amount : this.state.amount * -1;
      var data = {
        price: this.state.price / 100,
        amount: amount,
        choice: this.props.dialogContent.choice.id
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
  },
  returnStep: function(){
    this.setState({
      content: 0,
      error: false,
      disabled: false
    });
  },
  returnStepAndClose: function(){
    this.setState({
      amount: '',
      price: '',
      content: 0,
      amountError: false,
      priceError: false,
      error: false,
      disabled: false
    });
    this.props.closeDialog();
  },
  render: function(){
    var styles = {
      dialog:{
        width: "100%"
      },
      body: {
        padding: "0px 10px 10px 10px"
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
    var title = this.props.dialogContent.buy ? 'Compra de ' : 'Venda de ';
    title += this.props.dialogContent.choice.title;
    if (this.state.content == 0) {
      var actions = [
        <FlatButton
          label="Cancelar"
          primary={true}
          onTouchTap={this.returnStepAndClose}
        />,
        <FlatButton
          label={this.props.dialogContent.buy ? 'Comprar' : 'Vender'}
          primary={true}
          keyboardFocused={true}
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
                          handlePriceChange={this.handlePriceChange} />
      );
    }else if (1) {
      var actions = [
        <FlatButton
          label="Cancelar"
          primary={true}
          onTouchTap={this.returnStepAndClose}
        />,
        <FlatButton
          label="Confirmar"
          primary={true}
          keyboardFocused={true}
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
                            price={this.state.price}
                            balance={this.props.balance}
                            custody={this.props.custody[this.props.dialogContent.choice.id]} />
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
});

export default OrderDialog;
