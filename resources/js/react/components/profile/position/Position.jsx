import React from 'react';
import req from 'reqwest';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Open from 'material-ui/svg-icons/action/open-in-browser';

var styles = {
  firstColumn: {
    width: 400
  }
}

var Position = React.createClass({
  getInitialState: function() {
    return {
      positions: []
    };
  },
  getPositions: function(){
    var that = this;
    req('/api/markets/my-positions/?format=json').then(function(response){
      var positions = response;
      that.setState({
        positions: positions
      });
    });
  },
  componentDidMount: function() {
    this.getPositions();
  },
  render: function(){
    var rows = null;
    if (this.state.positions.length > 0) {
      rows = this.state.positions.map((p, k)=> (
        <TableRow key={k}>
          <TableRowColumn className="multiple-market-table__choice"
                          style={{width:styles.firstColumn.width, fontSize:15}}>
            {p.choice.market__title}
          </TableRowColumn>
          <TableRowColumn>{p.choice.title}</TableRowColumn>
          <TableRowColumn>{p.position}</TableRowColumn>
          <TableRowColumn>
            <IndexLink to={'/app/mercado/' + p.choice.market__id + '/'}>
              <Open/>
            </IndexLink>
          </TableRowColumn>
        </TableRow>
      ));
    }
    return (
      <div>
        <h2 style={{marginTop:20}}>Posições em Aberto</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <Table>
              <TableHeader adjustForCheckbox={false}
                           displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn style={styles.firstColumn}>Mercado</TableHeaderColumn>
                  <TableHeaderColumn>Posição</TableHeaderColumn>
                  <TableHeaderColumn>Qtde</TableHeaderColumn>
                  <TableHeaderColumn>Link</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}
                         showRowHover={true}>
                {rows}
              </TableBody>
            </Table>
          </CardText>
        </Card>
      </div>
    )
  }
});

export default Position;
