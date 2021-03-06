import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward';
import LinearProgress from 'material-ui/LinearProgress';
import { browserHistory } from 'react-router';
import moment from 'moment';
import { IndexLink } from 'react-router';

const style = {
  linear: {
    height: 6,
    'marginTop': 5
  },
  cardtext: {
    'paddingTop': 0
  },
  title: {
    cursor:'pointer',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: '22px',
    fontFamily: window.gvar.titlefont
  },
  marketTitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: window.gvar.titlefont
  },
  btn: {
    marginLeft: 10
  },
  varIcon: {
    height: 14,
    width: 14,
    position: 'relative',
    top: 2
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint) {
  style.title.lineHeight = '28px';
  style.title.marginBottom = 0;
  style.marketTitle.fontSize = 18;
  style.title.fontSize = 20;
  style.title.minHeight = 60;
}

export default class EventCard extends React.Component{
  shouldComponentUpdate(nextProps){
    if (nextProps.prices != null) {
      return true;
    }
    return false;
  }

  goToMarketDetail(){
    if (this.props._event._source.markets.length == 1) {
      browserHistory.push('/app/mercado/' + this.props._event._source.markets[0].id + '/');
    }else {
      browserHistory.push('/app/evento/' + this.props._event._source.id + '/');
    }
  }

  render() {
    if (this.props._event._source.markets.length == 1) {
      let m = this.props._event._source.markets[0]
      let price = null;
      let change = null;
      let iconBuy = null;
      let iconSell = null;
      let classBuy = null;
      let classSell = null;
      if (this.props.prices != null && this.props.prices[m.id] != null) {
        price = this.props.prices[m.id].price;
        if (m.lastDayPrice != undefined) {
          if (price - m.lastDayPrice > 0) {
            change = ((price - m.lastDayPrice)*100).toFixed(0) + 'p.p.';
            iconBuy = <ArrowUp color={window.gvar.positivecolor} style={style.varIcon} />;
            iconSell = <ArrowDown color={window.gvar.negativecolor} style={style.varIcon} />;
            classBuy = 'positive-color';
            classSell = 'negative-color';
          }else if (price - m.lastDayPrice < 0) {
            change = ((price - m.lastDayPrice)*-100).toFixed(0) + 'p.p.';
            iconBuy = <ArrowDown color={window.gvar.negativecolor} style={style.varIcon} />;
            iconSell = <ArrowUp color={window.gvar.positivecolor} style={style.varIcon} />;
            classBuy = 'negative-color';
            classSell = 'positive-color';
          }
        }
      }
      var textContent = [
        <div key={1}>
          <div className="marketcard-predictions__choices">
            <h5 style={style.marketTitle}>Sim</h5>
            <p>
              {
                price != null ?
                (price * 100).toFixed(0) + '% ':
                ''
              }
              <span className={classBuy}>
                {iconBuy}
                {change}
              </span>
            </p>
          </div>
          <LinearProgress style={style.linear}
                          mode="determinate"
                          value={price != null ? price * 100 : 0} />
        </div>,
        <div key={2}>
          <div className="marketcard-predictions__choices">
            <h5 style={style.marketTitle}>Não</h5>
            <p>
              {
                price != null ?
                (100-(price * 100)).toFixed(0) + '% ':
                ''
              }
              <span className={classSell}>
                {iconSell}
                {change}
              </span>
            </p>
          </div>
          <LinearProgress style={style.linear}
                          mode="determinate"
                          value={price != null ? 100-(price * 100) : 0} />
        </div>
      ]
    }else {
      let totalPrice = 0;
      let totalLastPrice = 0;
      if (this.props.prices != null) {
        for (let k in this.props._event._source.markets) {
          let m = this.props._event._source.markets[k];
          if (this.props.prices[m.id] != null) {
            totalPrice += this.props.prices[m.id].price;
          }
          if (m.lastDayPrice != undefined) {
            totalLastPrice += m.lastDayPrice;
          }
        }
      }
      const markets = this.props._event._source.markets.sort((a, b)=>{
        return b.volume - a.volume;
      });
      var textContent = markets.map((m, k)=> {
        let prob = null;
        let change = null;
        let icon = null;
        let className = null;
        if (this.props.prices != null) {
          prob = this.props.prices[m.id] != null ? this.props.prices[m.id].price / totalPrice * 100 : 0;
          if (m.lastDayPrice != undefined && totalLastPrice > 0 && m.lastDayPrice/totalLastPrice < 1) {
            if (prob - m.lastDayPrice/totalLastPrice*100 > 0) {
              change = (prob - m.lastDayPrice/totalLastPrice * 100).toFixed(0) + 'p.p.';
              icon = <ArrowUp color={window.gvar.positivecolor} style={style.varIcon} />;
              className = 'positive-color';
            }else if (prob - m.lastDayPrice/totalLastPrice*100 < 0) {
              change = ((prob - m.lastDayPrice/totalLastPrice * 100)*-1).toFixed(0) + 'p.p.';
              icon = <ArrowDown color={window.gvar.negativecolor} style={style.varIcon} />;
              className = 'negative-color';
            }
          }
        }
        if (k < 2) {
          return (
            <div key={k}>
              <div className="marketcard-predictions__choices">
                <IndexLink to={'/app/mercado/' + m.id + '/'}>
                  <h5 style={style.marketTitle}>{m.title_short}</h5>
                </IndexLink>
                <p>
                  {
                    (prob!=null)?
                    prob.toFixed(0)+'% ':''
                  }
                  <span className={className}>
                    {icon}
                    {change}
                  </span>
                </p>
              </div>
              <LinearProgress style={style.linear}
                              mode="determinate"
                              value={prob} />
            </div>
          )
        }
      })
    }
    return (
      <Card className="marketcard">
        <CardTitle
          title={this.props._event._source.title}
          titleStyle={style.title}
          onTouchTap={this.goToMarketDetail.bind(this)}
          subtitle={
            <div className="marketcard-subtitle">
              <span>Volume: {this.props._event._source.volume} papéis negociados</span>
              <span>Encerramento: {moment(this.props._event._source.deadline).format("DD/MM/YYYY HH:mm")}</span>
            </div>
          }
        />
        <CardText style={style.cardtext} className="marketcard-predictions">
          {
            textContent
          }
          <br/>
        </CardText>
      </Card>
    );
  }
}

EventCard.propTypes = {
  _event: React.PropTypes.object.isRequired
};
