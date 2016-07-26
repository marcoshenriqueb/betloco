import React from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import { browserHistory } from 'react-router';
import moment from 'moment';
import { IndexLink } from 'react-router';

var style = {
  linear: {
    height: 6,
    'marginTop': 5
  },
  cardtext: {
    'paddingTop': 0
  },
  title: {
    cursor:'pointer',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: '24px',
    marginBottom: 10
  },
  marketTitle: {
    fontSize: 20,
    fontWeight: '400'
  },
  btn: {
    marginLeft: 10
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint) {
  style.title.fontSize = 28;
  style.title.lineHeight = '36px';
  style.title.marginBottom = 0;
  style.marketTitle.fontSize = 24;
}

var EventCard = React.createClass({
  goToMarketDetail: function(){
    if (this.props._event._source.markets.length == 1) {
      browserHistory.push('/app/mercado/' + this.props._event._source.markets[0].id + '/');
    }else {
      browserHistory.push('/app/evento/' + this.props._event._source.id + '/');
    }
  },
  render: function() {
    if (this.props._event._source.markets.length == 1) {
      var m = this.props._event._source.markets[0]
      var textContent = [
        <div>
          <div className="marketcard-predictions__choices">
            <h5 style={style.marketTitle}>Sim</h5>
            <p>{m.lastCompleteOrder != null ? '(' + (m.lastCompleteOrder.price * 100).toFixed(1) + '%)' : '(0%)'}</p>
          </div>
          <LinearProgress style={style.linear}
                          mode="determinate"
                          value={m.lastCompleteOrder != null ? m.lastCompleteOrder.price * 100 : 0} />
        </div>,
        <div>
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
      })
    }
    return (
      <Card className="marketcard">
        <CardTitle
          title={this.props._event._source.title}
          titleStyle={style.title}
          onTouchTap={this.goToMarketDetail}
          subtitle={
            <div className="marketcard-subtitle">
              <span>Mercado: {this.props._event._source.event_type}</span>
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
        <CardActions>
          <RaisedButton style={style.btn} onTouchTap={this.goToMarketDetail} primary={true} label="Ver Mercado" />
        </CardActions>
      </Card>
    );
  }
});

export default EventCard;
