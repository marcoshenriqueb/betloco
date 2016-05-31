import React from 'react';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';

var styles = {
  noPaddingBottom: {
    paddingBottom: 0
  },
  noPaddingTop: {
    paddingTop: 0
  }
}

var Details = React.createClass({
  render: function() {
    return (
      <Card initiallyExpanded={true}>
        <CardHeader style={styles.noPaddingBottom} actAsExpander={true} showExpandableButton={true} title="Detalhes do Mercado" />
        <CardText expandable={true} style={styles.noPaddingTop}>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <Table>
            <TableBody displayRowCheckbox={false}
                       showRowHover={true}>
              <TableRow>
                <TableRowColumn>Taxa:</TableRowColumn>
                <TableRowColumn>2%</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Volume(papéis):</TableRowColumn>
                <TableRowColumn>10.000</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Data de Encerramento:</TableRowColumn>
                <TableRowColumn>12/12/2016</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Data de Criação:</TableRowColumn>
                <TableRowColumn>01/01/2016</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>Autor:</TableRowColumn>
                <TableRowColumn>Marcos</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }
});

export default Details;
