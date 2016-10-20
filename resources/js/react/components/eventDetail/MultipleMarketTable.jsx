import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ActionGavel from 'material-ui/svg-icons/action/gavel';
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward';
import { IndexLink } from 'react-router';

const styles = {
  noMarginTop: {
    marginTop: 0
  },
  noPaddingTop: {
    paddingTop: 0
  },
  td: {
    textAlign: 'right'
  },
  tdBig: {
    textAlign: 'right',
    display: 'none'
  },
  choice: {
    fontSize: 16,
    width: 140
  },
  choiceHeader: {
    width: 140
  },
  varIcon: {
    height: 14,
    width: 14,
    position: 'relative',
    top: 2
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

export default class MultipleMarketTable extends React.Component {
  render() {
    if (this.props._event.markets != undefined && this.props._event.markets.length > 1) {
      var totalPrice = 0;
      for (var k in this.props._event.markets) {
        if (this.props._event.markets[k].lastCompleteOrder != null) {
          totalPrice += this.props._event.markets[k].lastCompleteOrder.price;
        }
      }
      var rows = this.props._event.markets.map((m, k)=> {
        var prob = (m.lastCompleteOrder != null) ? m.lastCompleteOrder.price*100 / totalPrice : 0;
        let varColorClass = null;
        let varIcon = null;
        let varNumber = '-';
        if (m.lastCompleteOrder != null && m.lastDayPrice!=undefined) {
          if (m.lastCompleteOrder.price-m.lastDayPrice>0) {
            varNumber = ((m.lastCompleteOrder.price-m.lastDayPrice)*100).toFixed(0) + '¢';
            varColorClass = 'positive-color';
            varIcon = <ArrowUp color={window.gvar.positivecolor} style={styles.varIcon}/>;
          }else if (m.lastCompleteOrder.price-m.lastDayPrice<0) {
            varNumber = ((m.lastCompleteOrder.price-m.lastDayPrice)*-100).toFixed(0) + '¢';
            varColorClass = 'negative-color';
            varIcon = <ArrowDown color={window.gvar.negativecolor} style={styles.varIcon}/>;
          }
        }
        return (
          <TableRow key={k}>
            <TableRowColumn style={styles.choice} className="multiple-market-table__choice">
              <IndexLink to={'/app/mercado/' + m.id + '/'}>
                {m.title_short}
              </IndexLink>
            </TableRowColumn>
            <TableRowColumn style={styles.td}>{(m.lastCompleteOrder != null) ? (m.lastCompleteOrder.price*100).toFixed(0)+'¢' : '0'}</TableRowColumn>
            <TableRowColumn style={styles.td}
                            className={varColorClass}>
              {varIcon}
              {varNumber}
            </TableRowColumn>
            <TableRowColumn style={styles.tdBig}>{prob.toFixed(1)}%</TableRowColumn>
            <TableRowColumn style={styles.td}>{m.volume}</TableRowColumn>
            <TableRowColumn style={styles.tdBig}>
              <IndexLink to={'/app/mercado/' + m.id + '/'}>
                <IconButton><ActionGavel color={window.gvar.successcolor} /></IconButton>
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
                  <TableHeaderColumn style={styles.td}>Var</TableHeaderColumn>
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
}
