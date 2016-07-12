import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ActionGavel from 'material-ui/svg-icons/action/gavel';
import { IndexLink } from 'react-router';

var styles = {
  noMarginTop: {
    marginTop: 0
  },
  noPaddingTop: {
    paddingTop: 0
  },
  td: {
    textAlign: 'center'
  },
  tdBig: {
    textAlign: 'center',
    display: 'none',
    width: 80
  },
  choice: {
    fontSize: 18,
    width: 150
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint) {
  styles.tdBig.display = "table-cell";
  styles.tdBig.width = 'inherit';
  styles.choice.width = 250;
}

var MultipleMarketTable = React.createClass({
  render: function() {
    if (this.props._event.markets != undefined && this.props._event.markets.length > 1) {
      var totalPrice = 0;
      for (var k in this.props._event.markets) {
        if (this.props._event.markets[k].choices[0].title == "Sim") {
          var yes = this.props._event.markets[k].choices[0];
          var no = this.props._event.markets[k].choices[1];
        }else {
          var yes = this.props._event.markets[k].choices[1];
          var no = this.props._event.markets[k].choices[0];
        }
        if (yes.lastCompleteOrder != null) {
          totalPrice += yes.lastCompleteOrder.price;
        }
      }
      var rows = this.props._event.markets.map((m, k)=> {
        if (m.choices[0].title == "Sim") {
          var yes = m.choices[0];
          var no = m.choices[1];
        }else {
          var yes = m.choices[1];
          var no = m.choices[0];
        }
        var prob = (yes.lastCompleteOrder != null) ? yes.lastCompleteOrder.price*100 / totalPrice : 0;
        return (
          <TableRow key={k}>
            <TableRowColumn style={styles.choice} className="multiple-market-table__choice">
              <IndexLink to={'/app/mercado/' + m.id + '/'}>
                {m.title_short}
              </IndexLink>
            </TableRowColumn>
            <TableRowColumn style={styles.td}>{(yes.lastCompleteOrder != null) ? yes.lastCompleteOrder.price*100+'¢' : '0'}</TableRowColumn>
            <TableRowColumn style={styles.tdBig}>{(no.lastCompleteOrder != null) ? no.lastCompleteOrder.price*100+'¢' : '0'}</TableRowColumn>
            <TableRowColumn style={styles.tdBig}>{prob.toFixed(1)}%</TableRowColumn>
            <TableRowColumn style={styles.td}>{m.volume}</TableRowColumn>
            <TableRowColumn style={styles.tdBig}>
              <IndexLink to={'/app/mercado/' + m.id + '/'}>
                <IconButton><ActionGavel color="rgb(0, 188, 212)" /></IconButton>
              </IndexLink>
            </TableRowColumn>
          </TableRow>
        )
      })
      return (
        <Card initiallyExpanded={true}>
          <CardHeader actAsExpander={true} showExpandableButton={true} title="Mercados" />
          <CardText expandable={true} style={styles.noPaddingTop}>
            <Table>
            <TableHeader enableSelectAll={false}
                         displaySelectAll={false}
                         adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn style={{width: styles.choice.width}}>Escolha</TableHeaderColumn>
                  <TableHeaderColumn style={styles.td}>Preço Sim</TableHeaderColumn>
                  <TableHeaderColumn style={styles.tdBig}>Preço Não</TableHeaderColumn>
                  <TableHeaderColumn style={styles.tdBig}>Probabilidade</TableHeaderColumn>
                  <TableHeaderColumn style={styles.td}>Volume</TableHeaderColumn>
                  <TableHeaderColumn style={styles.tdBig}></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody showRowHover={true}
                         displayRowCheckbox={false}>
                {rows}
              </TableBody>
            </Table>
          </CardText>
        </Card>
      );
    }else {
      return (<div/>)
    }
  }
});

export default MultipleMarketTable;
