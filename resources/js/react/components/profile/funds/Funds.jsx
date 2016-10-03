import React from 'react';
import {connect} from 'react-redux';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

var style = {
  firstColumn: {
    paddingRight: 10,
    paddingLeft: 10,
    width: 200,
    fontSize: 15
  },
  secondColumn: {
    fontSize: 15,
    textAlign: 'right',
    paddingRight: 10,
    paddingLeft: 10
  },
  title:{
    margin: "20px 10px 10px 10px",
    fontSize: 22
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  style.firstColumn.width = 300;
  style.title.fontSize = 28;
  style.firstColumn.paddingLeft = 24;
  style.firstColumn.paddingRight = 24;
  style.secondColumn.paddingLeft = 24;
  style.secondColumn.paddingRight = 24;
}
if (document.documentElement.clientWidth > window.gvar.desktopbreak) {
  style.firstColumn.width = 700;
}

class Funds extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    if (this.props.funds === false) {
      return (
        <div>
          <h2 style={style.title}>Fundos</h2>
          <br/>
          <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
            <div className="bouncer">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
          <br/>
        </div>
      )
    }
    return (
      <div>
        <h2 style={style.title}>Fundos</h2>
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <Table>
              <TableBody displayRowCheckbox={false}
                         showRowHover={true}>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={style.firstColumn}>
                    Saldo disponível (R$)
                  </TableRowColumn>
                  <TableRowColumn style={style.secondColumn}>{this.props.funds.total}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={style.firstColumn}>
                    Saldo de transações (R$)
                  </TableRowColumn>
                  <TableRowColumn style={style.secondColumn}>{this.props.funds.transactions}</TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn className="multiple-market-table__choice"
                                  style={style.firstColumn}>
                    Provisão em ordens (R$)
                  </TableRowColumn>
                  <TableRowColumn style={style.secondColumn}>{this.props.funds.risk}</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </CardText>
        </Card>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    funds: state.profileUser.balance
  };
}

export default connect(mapStateToProps)(Funds);
