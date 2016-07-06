import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

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
    if (Object.keys(this.props.market).length !== 0 || this.props.market.constructor !== Object) {
      return (
        <Card initiallyExpanded={true}>
          <CardHeader actAsExpander={true} showExpandableButton={true} title="Detalhes do Mercado" />
          <CardText expandable={true} style={styles.noPaddingTop}>
            <p style={styles.noMarginTop}>{this.props.market.description}</p>
            <Table>
              <TableBody displayRowCheckbox={false}
                         showRowHover={true}>
                <TableRow>
                  <TableRowColumn>Volume(papéis):</TableRowColumn>
                  <TableRowColumn>{this.props.market.volume}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Data de Encerramento:</TableRowColumn>
                  <TableRowColumn>{moment(this.props.market.deadline).format("DD/MM/YYYY HH:mm")}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Data de Criação:</TableRowColumn>
                  <TableRowColumn>{moment(this.props.market.created_at).format("DD/MM/YYYY HH:mm")}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn>Autor:</TableRowColumn>
                  <TableRowColumn>{this.props.market.user}</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </CardText>
        </Card>
      )
    }
    return (
      <div/>
    );
  }
});

export default Details;
