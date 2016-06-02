import React from 'react';
import PlaceOrderDialog from './PlaceOrderDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

var styles = {
  dialog:{
    width: 556
  }
}

var OrderDialog = React.createClass({
  getInitialState: function(){
    return {
      amount: '',
      amountError: false,
      price: '',
      priceError: false,
      content: 0
    };
  },
  handleAmountChange: function(e){
    if (!isNaN(e.target.value)) {
      this.setState({
        amount: e.target.value
      })
    }
  },
  handlePriceChange: function(e){
    if (!isNaN(e.target.value) && e.target.value < 100 && e.target.value >= 0) {
      this.setState({
        price: e.target.value
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

  },
  returnStepAndClose: function(){
    this.setState({
      amount: '',
      price: '',
      content: 0
    });
    this.props.closeDialog();
  },
  render: function(){
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
          onTouchTap={this.props.closeDialog}
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
        />,
      ];
      var content = (
        <div/>
      );
    }
    return (
      <Dialog
          title={title}
          contentStyle={styles.dialog}
          actions={actions}
          modal={false}
          open={this.props.dialog}
          onRequestClose={this.props.closeDialog} >
        {content}
      </Dialog>
    );
  }
});

export default OrderDialog;
