import React from 'react';
import req from 'reqwest';
import MarketDetailCard from './marketDetail/MarketDetailCard.jsx';

var MarketDetailContainer = React.createClass({
  getInitialState: function() {
    return {
      market: {},
      dialog: false,
      dialogContent: undefined
    };
  },
  getMarket: function(){
    var that = this;
    req('/api/markets/' + this.props.params.id + '/?format=json').then(function(response){
      var market = response;
      that.setState({
        market: market
      });
    });
  },
  componentDidMount: function() {
    this.getMarket();
  },
  openDialog: function(choice, buy){
    this.setState({
      dialog: true,
      dialogContent: {
        choice: choice,
        buy: buy
      }
    });
  },
  closeDialog: function(){
    this.setState({dialog: false});
  },
  render: function() {
    return (
      <div className="marketdetail-content container">
        <br />
        <MarketDetailCard dialog={this.state.dialog}
                          dialogContent={this.state.dialogContent}
                          openDialog={this.openDialog}
                          closeDialog={this.closeDialog}
                          market={this.state.market} />
      </div>
    );
  }
});

export default MarketDetailContainer;
