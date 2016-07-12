import React from 'react';
import req from 'reqwest';
import MarketDetailCard from './marketDetail/MarketDetailCard.jsx';
import Breadcrumb from './general/Breadcrumb.jsx';

var MarketDetailContainer = React.createClass({
  getInitialState: function() {
    return {
      market: {},
      custody: {},
      dialog: false,
      dialogContent: undefined,
      orders: []
    };
  },
  getMarket: function(){
    var that = this;
    req('/api/markets/choice/' + this.props.params.id + '/?format=json').then(function(response){
      var market = response;
      that.setState({
        market: market
      });
    });
  },
  getCustody: function(){
    var that = this;
    req('/api/markets/custody/' + this.props.params.id + '/?format=json').then(function(response){
      var custody = response;
      that.setState({
        custody: custody
      });
    });
  },
  getOpenOrders: function(){
    var that = this;
    req('/api/markets/open-orders/?market=' + this.props.params.id + '&format=json').then(function(response){
      var orders = response;
      that.setState({
        orders: orders
      });
    });
  },
  deleteOrders: function(orders){
    var that = this;
    req({
      url: '/api/markets/open-orders/?market=' + this.props.params.id + '&format=json&orders=' + JSON.stringify(orders),
      headers: {
        'X-CSRFToken': document.getElementById('token').getAttribute('value')
      },
      method: 'delete'
    }).then(function(response){
      that.props.updateBalance();
    });
  },
  connectToMarket: function(){
    var that = this;
    var socket = new WebSocket("ws://" + window.location.host + "/market/" + this.props.params.id + '/');
    socket.onopen = function() {
      socket.onmessage = function(e) {
        var m = JSON.parse(e.data);
        that.setState({
          market: m.market
        });
        that.getCustody();
        that.getOpenOrders();
      }
    }
  },
  componentDidMount: function() {
    this.getMarket();
    this.getCustody();
    this.connectToMarket();
    this.getOpenOrders();
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
    var breadcrumb = null;
    if (this.state.market.event != undefined) {
      if (this.state.market.event.markets.length > 1) {
        var path = [
          {
            title_short: "evento",
            title: this.state.market.event.title,
            path: '/app/evento/' + this.state.market.event.id + '/'
          },
          {
            title_short: this.state.market.title_short,
            title: this.state.market.title_short,
            path: null
          }
        ]
        breadcrumb = (
          <Breadcrumb path={path} />
        )
      }else {
        var path = [
          {
            title: this.state.market.title,
            path: null
          }
        ]
        breadcrumb = (
          <Breadcrumb path={path} />
        )
      }
    }
    return (
      <div className="marketdetail-content container">
        {breadcrumb}
        <MarketDetailCard dialog={this.state.dialog}
                          balance={this.props.balance}
                          updateBalance={this.props.updateBalance}
                          dialogContent={this.state.dialogContent}
                          openDialog={this.openDialog}
                          closeDialog={this.closeDialog}
                          custody={this.state.custody}
                          market={this.state.market}
                          orders={this.state.orders}
                          onDeleteOrders={this.deleteOrders} />
      </div>
    );
  }
});

export default MarketDetailContainer;
