import React from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

var MarketDetailCard = React.createClass({
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
        <CardText>
          {this.props.market.description}
        </CardText>
        <CardActions>
          <FlatButton label="Action1" />
        </CardActions>
      </Card>
    );
  }
});

export default MarketDetailCard;
