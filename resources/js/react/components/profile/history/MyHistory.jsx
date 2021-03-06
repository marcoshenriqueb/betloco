import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

import {
  getHistory
} from '../../../redux/actions/profile/positionActions';

var style = {
  title:{
    margin: "20px 10px 10px 10px",
    fontSize: 22
  },
  firstColumn: {
    paddingRight: 10,
    paddingLeft: 10
  },
  firstRowColumn: {
    overflow: 'hidden',
    fontSize:15,
    paddingRight: 10,
    paddingLeft: 10
  },
  th: {
    textAlign: 'right',
    paddingRight: 10,
    paddingLeft: 10,
    width: 80
  },
  thBig: {
    textAlign: 'right',
    display: 'none',
    width: 80
  },
  thDate: {
    textAlign: 'right',
    width: 80,
    paddingRight: 10,
    paddingLeft: 10
  }
}

if (document.documentElement.clientWidth > window.gvar.breakpoint){
  style.title.fontSize = 28;
  style.th.paddingLeft = 24;
  style.th.paddingRight = 24;
  style.thBig.display = 'table-cell';
  style.firstColumn.paddingLeft = 24;
  style.firstColumn.paddingRight = 24;
  style.firstRowColumn.paddingLeft = 24;
  style.firstRowColumn.paddingRight = 24;
}
if (document.documentElement.clientWidth > window.gvar.desktopbreak) {
  style.thDate.width = 140;
  style.firstColumn.width = 450;
  style.firstRowColumn.width = 450;
}

class MyHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getHistory();
  }

  render(){
    var title = (<h2 style={style.title}>Histórico de transações</h2>);
    if (this.props.history === false) {
      return (
        <div>
          {title}
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
    }else if (this.props.history.length == 0) {
      return (
        <div>
          {title}
          <p className="error-warning">Você não tem nenhuma transação realizada</p>
        </div>
      )
    }
    var returnTitle = function(p){
      return p.market__title_short;
    }
    if (document.documentElement.clientWidth > window.gvar.breakpoint) {
      returnTitle = function(p){
        return p.market__title;
      }
    }
    var rows = null;
    if (this.props.history.length > 0) {
      rows = this.props.history.map((h, k)=> (
        <TableRow key={k}>
          <TableRowColumn className="multiple-market-table__choice"
                          style={style.firstRowColumn}>
            {returnTitle(h)}
          </TableRowColumn>
          <TableRowColumn style={style.thBig}>{h.amount_sum}</TableRowColumn>
          <TableRowColumn style={style.th}>
            {(document.documentElement.clientWidth > window.gvar.breakpoint)?h.price_avg.toFixed(2)*100:h.price_avg.toFixed(2)*h.amount_sum}
          </TableRowColumn>
          <TableRowColumn style={style.thDate}>
            {
              (document.documentElement.clientWidth > window.gvar.desktopbreak) ?
                moment(h.created_at).format('DD/MM/YYYY HH:mm')
              :
                moment(h.created_at).format('DD/MM/YY')
            }
          </TableRowColumn>
        </TableRow>
      ));
    }
    return (
      <div>
        {title}
        <Card initiallyExpanded={true}>
          <CardText expandable={true}>
            <Table>
              <TableHeader adjustForCheckbox={false}
                           displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn style={style.firstColumn}>Mercado</TableHeaderColumn>
                  <TableHeaderColumn style={style.thBig}>Qtde</TableHeaderColumn>
                  <TableHeaderColumn style={style.th}>
                    {(document.documentElement.clientWidth > window.gvar.breakpoint) ? "Preço (¢)":"R$"}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={style.thDate}>Data Ordem</TableHeaderColumn>
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
}

function mapStateToProps(state){
  return {
    history: state.profilePosition.history
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getHistory
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(MyHistory);
