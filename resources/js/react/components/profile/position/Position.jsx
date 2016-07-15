import React from 'react';
import req from 'reqwest';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Open from 'material-ui/svg-icons/action/open-in-browser';

var style = {
  title:{
    margin: "20px 10px 10px 10px",
    fontSize: 22
  },
  firstColumn: {
    paddingRight: 10,
    paddingLeft: 10,
    width: 150
  },
  firstRowColumn: {
    fontSize:15,
    paddingRight: 10,
    paddingLeft: 10,
    width: 150
  },
  th: {
    paddingRight: 10,
    paddingLeft: 10
  },
  thBig: {
    display: 'none'
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  style.title.fontSize = 28;
  style.th.paddingLeft = 24;
  style.th.paddingRight = 24;
  style.thBig.display = 'table-cell';
  style.firstColumn.paddingLeft = 24;
  style.firstColumn.paddingRight = 24;
  style.firstColumn.width = 500;
  style.firstRowColumn.paddingLeft = 24;
  style.firstRowColumn.paddingRight = 24;
  style.firstRowColumn.width = 500;
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
    var returnTitle = function(p){
      return p.choice.market__title_short;
    }
    if (document.documentElement.clientWidth > window.gvar.breakpoint) {
      returnTitle = function(p){
        return p.choice.market__title;
      }
    }
    var rows = null;
    if (this.state.positions.length > 0) {
      rows = this.state.positions.map((p, k)=> (
        <TableRow key={k}>
          <TableRowColumn className="multiple-market-table__choice"
                          style={style.firstRowColumn}>
            {returnTitle(p)}
          </TableRowColumn>
          <TableRowColumn style={style.thBig}>{p.choice.title}</TableRowColumn>
          <TableRowColumn style={style.th}>{p.position}</TableRowColumn>
          <TableRowColumn style={style.th}>
            <IndexLink to={'/app/mercado/' + p.choice.market__id + '/'}>
              <Open/>
            </IndexLink>
          </TableRowColumn>
        </TableRow>
      ));
    }
    return (
      <div>
        <h2 style={style.title}>Posições</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <Table>
              <TableHeader adjustForCheckbox={false}
                           displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn style={style.firstColumn}>Mercado</TableHeaderColumn>
                  <TableHeaderColumn style={style.thBig}>Posição</TableHeaderColumn>
                  <TableHeaderColumn style={style.th}>Qtde</TableHeaderColumn>
                  <TableHeaderColumn style={style.th}>Link</TableHeaderColumn>
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
