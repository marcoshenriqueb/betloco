import React from 'react';
import Disqus from './Disqus.jsx';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import MarketDetailCard from './marketDetail/MarketDetailCard.jsx';
import Breadcrumb from './general/Breadcrumb.jsx';

import {
  getMarket,
  getCustody,
  getOpenOrders,
  deleteOrders,
  openDialog,
  closeDialog,
  connectToMarket,
  disconnectToMarket,
  resetMarket
} from '../redux/actions/marketActions';

class MarketDetailContainer extends React.Component {

  componentDidMount() {
    this.props.connectToMarket(this.props.params.id, ()=>{
      this.props.getCustody(this.props.params.id);
      this.props.getOpenOrders(this.props.params.id);
      this.props.updateBalance();
    });
    this.props.getMarket(this.props.params.id);
    this.props.getCustody(this.props.params.id);
    this.props.getOpenOrders(this.props.params.id);
  }

  componentWillUnmount(){
    this.props.resetMarket();
    this.props.disconnectToMarket(this.props.params.id);
  }

  render() {
    const onDeleteOrders = (o) => {
      this.props.deleteOrders(this.props.params.id, o)
    }
    if (this.props.market == null) {
      return (
        <div style={{
                  width:'100%',
                  height: '60vh',
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center'
                }}>
          <div className="bouncer">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      )
    }
    var breadcrumb = null;
    if (this.props.market.event != undefined) {
      if (this.props.market.event.markets.length > 1) {
        var path = [
          {
            title_short: "evento",
            title: this.props.market.event.title,
            path: '/app/evento/' + this.props.market.event.id + '/'
          },
          {
            title_short: this.props.market.title_short,
            title: this.props.market.title_short,
            path: null
          }
        ]
        breadcrumb = (
          <Breadcrumb path={path} />
        )
      }else {
        var path = [
          {
            title_short: this.props.market.title_short,
            title: this.props.market.title,
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
        <MarketDetailCard dialog={this.props.dialog}
                          balance={this.props.balance}
                          updateBalance={this.props.updateBalance}
                          dialogContent={this.props.dialogContent}
                          openDialog={this.props.openDialog}
                          closeDialog={this.props.closeDialog}
                          custody={this.props.custody}
                          market={this.props.market}
                          orders={this.props.orders}
                          onDeleteOrders={onDeleteOrders} />
        <br/>
        <Disqus identifier={'market|' + this.props.market.id}
                url={"https://www.guroo.bet/app/mercado/" + this.props.market.id + "/"}
                title={this.props.market.title} />
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    market: state.market.market,
    custody: state.market.custody,
    dialog: state.market.dialog,
    dialogContent: state.market.dialogContent,
    orders: state.market.orders
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getMarket,
    getCustody,
    getOpenOrders,
    deleteOrders,
    openDialog,
    closeDialog,
    connectToMarket,
    disconnectToMarket,
    resetMarket
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(MarketDetailContainer);
