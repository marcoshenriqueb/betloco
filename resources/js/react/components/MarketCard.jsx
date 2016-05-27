import React from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';

var style = {
  linear: {
    height: 6,
    'marginTop': 5
  },
  cardtext: {
    'paddingTop': 0
  }
}

var MarketCard = React.createClass({
  render: function() {
    return (
      <Card className="marketcard">
        <CardTitle
          title={this.props.market.title}
          subtitle={
            <div className="marketcard-subtitle">
              <span>Mercado: {this.props.market.market_type}</span>
              <span>Taxa: {this.props.market.trading_fee * 100}%</span>
              <span>Volume: 500 contratos</span>
              <span>Encerramento: 31/12/2016</span>
            </div>
          }
        />
        <CardText style={style.cardtext} className="marketcard-predictions">
          {
            this.props.market.choices.map((c)=>{return (
              <div key={c.id}>
                <div className="marketcard-predictions__choices">
                  <h5>{c.title}</h5>
                  <p>(70%)</p>
                </div>
                <LinearProgress style={style.linear} mode="determinate" value={70} />
              </div>
            )})
          }
        </CardText>
        <CardActions>
          <FlatButton primary={true} label="Ver Mercado" />
        </CardActions>
      </Card>
    );
  }
});

export default MarketCard;
