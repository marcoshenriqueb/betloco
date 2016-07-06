import React from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import { browserHistory } from 'react-router';
import moment from 'moment';

var style = {
  linear: {
    height: 6,
    'marginTop': 5
  },
  cardtext: {
    'paddingTop': 0
  }
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
      var textContent = this.props._event._source.markets[0].choices.map((c, k) => {
        return (
        <div key={k}>
          <div className="marketcard-predictions__choices">
            <h5>{c.title}</h5>
            <p>{c.lastCompleteOrder != null ? '(' + (c.lastCompleteOrder.price * 100).toFixed(1) + '%)' : '(0%)'}</p>
          </div>
          <LinearProgress style={style.linear}
                          mode="determinate"
                          value={c.lastCompleteOrder != null ? c.lastCompleteOrder.price * 100 : 0} />
        </div>
      )})
    }else {
      var totalPrice = 0;
      for (var k in this.props._event._source.markets) {
        if (this.props._event._source.markets[k].choices[0].title == "Sim") {
          var yes = this.props._event._source.markets[k].choices[0];
          var no = this.props._event._source.markets[k].choices[1];
        }else {
          var yes = this.props._event._source.markets[k].choices[1];
          var no = this.props._event._source.markets[k].choices[0];
        }
        if (yes.lastCompleteOrder != null) {
          totalPrice += yes.lastCompleteOrder.price;
        }
      }
      var textContent = this.props._event._source.markets.map((m, k)=> {
        var prob = m.choices[0].lastCompleteOrder != null ? m.choices[0].lastCompleteOrder.price / totalPrice * 100 : 0;
        return (
          <div key={k}>
            <div className="marketcard-predictions__choices">
              <h5>{m.title_short}</h5>
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
          titleStyle={{cursor:'pointer'}}
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
        </CardText>
        <CardActions>
          <FlatButton onTouchTap={this.goToMarketDetail} primary={true} label="Ver Mercado" />
        </CardActions>
      </Card>
    );
  }
});

export default EventCard;
