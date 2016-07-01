import React from 'react';
import req from 'reqwest';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';

var MyConfig = React.createClass({
  getInitialState: function() {
    return {
      funds: []
    };
  },
  getFunds: function(){
    var that = this;
    req('/api/transactions/balance/?format=json').then(function(response){
      var funds = response;
      that.setState({
        funds: funds
      });
    });
  },
  componentDidMount: function() {
    this.getFunds();
  },
  render: function(){
    return (
      <div>
        <h2 style={{marginTop:20}}>Configurações</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            
          </CardText>
        </Card>
      </div>
    )
  }
});

export default MyConfig;
