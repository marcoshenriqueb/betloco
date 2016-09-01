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
    display: 'none'
  },
  choice: {
    fontSize: 16,
    width: 140
  },
  choiceHeader: {
    width: 140
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint) {
  styles.tdBig.display = "table-cell";
  styles.choice.width = 250;
  styles.choiceHeader.width = 250;
  styles.choice.fontSize = 18;
}else {
  styles.td.paddingRight = 5;
  styles.td.paddingLeft = 5;
  styles.choice.paddingLeft = 5;
  styles.choice.paddingRight = 5;
  styles.choiceHeader.paddingLeft = 5;
  styles.choiceHeader.paddingRight = 5;
}

var MultipleMarketTable = React.createClass({
  render: function() {
    if (this.props._event.markets != undefined && this.props._event.markets.length > 1) {
      var totalPrice = 0;
      for (var k in this.props._event.markets) {
        if (this.props._event.markets[k].lastCompleteOrder != null) {
          totalPrice += this.props._event.markets[k].lastCompleteOrder.price;
        }
      }
      var rows = this.props._event.markets.map((m, k)=> {
        var prob = (m.lastCompleteOrder != null) ? m.lastCompleteOrder.price*100 / totalPrice : 0;
        return (
          <TableRow key={k}>
            <TableRowColumn style={styles.choice} className="multiple-market-table__choice">
              <IndexLink to={'/app/mercado/' + m.id + '/'}>
                {m.title_short}
              </IndexLink>
            </TableRowColumn>
            <TableRowColumn style={styles.td}>{(m.lastCompleteOrder != null) ? (m.lastCompleteOrder.price*100).toFixed(0)+'¢' : '0'}</TableRowColumn>
            <TableRowColumn style={styles.tdBig}>{prob.toFixed(1)}%</TableRowColumn>
            <TableRowColumn style={styles.td}>{m.volume}</TableRowColumn>
            <TableRowColumn style={styles.tdBig}>
              <IndexLink to={'/app/mercado/' + m.id + '/'}>
                <IconButton><ActionGavel color={window.gvar.primarycolor} /></IconButton>
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
                  <TableHeaderColumn style={styles.choiceHeader}>Escolha</TableHeaderColumn>
                  <TableHeaderColumn style={styles.td}>Preço</TableHeaderColumn>
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
