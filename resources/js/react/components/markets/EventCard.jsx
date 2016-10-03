import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
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
  goToMarketDetail(){
    if (this.props._event._source.markets.length == 1) {
      browserHistory.push('/app/mercado/' + this.props._event._source.markets[0].id + '/');
    }else {
      browserHistory.push('/app/evento/' + this.props._event._source.id + '/');
    }
  }

  render() {
    if (this.props._event._source.markets.length == 1) {
      var m = this.props._event._source.markets[0]
      var textContent = [
        <div key={1}>
          <div className="marketcard-predictions__choices">
            <h5 style={style.marketTitle}>Sim</h5>
            <p>{m.lastCompleteOrder != null ? '(' + (m.lastCompleteOrder.price * 100).toFixed(1) + '%)' : '(0%)'}</p>
          </div>
          <LinearProgress style={style.linear}
                          mode="determinate"
                          value={m.lastCompleteOrder != null ? m.lastCompleteOrder.price * 100 : 0} />
        </div>,
        <div key={2}>
          <div className="marketcard-predictions__choices">
            <h5 style={style.marketTitle}>Não</h5>
            <p>{m.lastCompleteOrder != null ? '(' + (100-(m.lastCompleteOrder.price * 100)).toFixed(1) + '%)' : '(0%)'}</p>
          </div>
          <LinearProgress style={style.linear}
                          mode="determinate"
                          value={m.lastCompleteOrder != null ? 100-(m.lastCompleteOrder.price * 100) : 0} />
        </div>
      ]
    }else {
      var totalPrice = 0;
      for (var k in this.props._event._source.markets) {
        if (this.props._event._source.markets[k].lastCompleteOrder != null) {
          totalPrice += this.props._event._source.markets[k].lastCompleteOrder.price;
        }
      }
      var textContent = this.props._event._source.markets.map((m, k)=> {
        var prob = m.lastCompleteOrder != null ? m.lastCompleteOrder.price / totalPrice * 100 : 0;
        if (k < 2) {
          return (
            <div key={k}>
              <div className="marketcard-predictions__choices">
                <IndexLink to={'/app/mercado/' + m.id + '/'}>
                  <h5 style={style.marketTitle}>{m.title_short}</h5>
                </IndexLink>
                <p>({prob.toFixed(1)}%)</p>
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
          <div className="marketcard-warning">
            <span>*Última atualização de preço: {moment(this.props._event._source.updated_at).format("DD/MM/YYYY HH:mm")}</span>
          </div>
        </CardText>
      </Card>
    );
  }
}
