import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

var styles = {
  noMarginTop: {
    marginTop: 0
  },
  noPaddingTop: {
    paddingTop: 0
  }
}

var Details = React.createClass({
  render: function() {
    return (
      <Card initiallyExpanded={true}>
        <CardHeader actAsExpander={true} showExpandableButton={true} title="Detalhes do Mercado" />
        <CardText expandable={true} style={styles.noPaddingTop}>
          <p style={styles.noMarginTop}>{this.props.market.description}</p>
          <Table>
            <TableBody displayRowCheckbox={false}
                       showRowHover={true}>
              <TableRow>
                <TableRowColumn>Taxa:</TableRowColumn>
                <TableRowColumn>{this.props.market.trading_fee * 100}%</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Volume(papéis):</TableRowColumn>
                <TableRowColumn>{this.props.market.volume}</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Data de Encerramento:</TableRowColumn>
                <TableRowColumn>{this.props.market.deadline}</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Data de Criação:</TableRowColumn>
                <TableRowColumn>{this.props.market.created_at}</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Autor:</TableRowColumn>
                <TableRowColumn>{this.props.market.user}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }
});

export default Details;
