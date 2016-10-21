import React from 'react';
import TextField from 'material-ui/TextField';

export default class Payment extends React.Component {
  componentDidMount(){
    window.paypalCheckoutReady = function() {
      paypal.checkout.setup('VAQU6PNYNSX5L', {
        environment: 'sandbox',
        container: 'paypal-container'
      });
    };
  }
  render() {
    return (
      <div>
        <form id="paypal-container" method="post" action="/api/transactions/checkout/">
          <input type="hidden"
                 value={document.getElementById('token').getAttribute('value')}
                 name="csrfmiddlewaretoken"/>
          <input type="hidden"
                value={window.location}
                name="return_url"/>
          <input type="hidden"
                value={window.location}
                name="cancel_url"/>
          <TextField
            hintText="Valor" name="value"
          /><br/>
        </form>
      </div>
    )
  }
}
