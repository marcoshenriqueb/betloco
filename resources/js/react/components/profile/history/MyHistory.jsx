import React from 'react';
import req from 'reqwest';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

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
  },
  thDate: {
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
  style.thDate.width = 180;
  style.firstColumn.paddingLeft = 24;
  style.firstColumn.paddingRight = 24;
  style.firstColumn.width = 450;
  style.firstRowColumn.paddingLeft = 24;
  style.firstRowColumn.paddingRight = 24;
  style.firstRowColumn.width = 450;
}

var MyHistory = React.createClass({
  getInitialState: function() {
    return {
      history: false
    };
  },
  getHistory: function(){
    var that = this;
    req('/api/markets/my-history/?format=json').then(function(response){
      var history = response;
      that.setState({
        history: history
      });
    });
  },
  componentDidMount: function() {
    this.getHistory();
  },
  render: function(){
    var title = (<h2 style={style.title}>Histórico de transações</h2>);
    if (this.state.history === false) {
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
    }else if (this.state.history.length == 0) {
      return (
        <div>
          {title}
          <p className="error-warning">Você não tem nenhuma transação realizada</p>
        </div>
      )
    }
    var returnTitle = function(p){
      return p.choice__market__title_short;
    }
    if (document.documentElement.clientWidth > window.gvar.breakpoint) {
      returnTitle = function(p){
        return p.choice__market__title;
      }
    }
    var rows = null;
    if (this.state.history.length > 0) {
      rows = this.state.history.map((h, k)=> (
        <TableRow key={k}>
          <TableRowColumn className="multiple-market-table__choice"
                          style={style.firstRowColumn}>
            {returnTitle(h)}
          </TableRowColumn>
          <TableRowColumn style={style.thBig}>{h.choice__title}</TableRowColumn>
          <TableRowColumn style={style.thBig}>{h.amount_sum}</TableRowColumn>
          <TableRowColumn style={style.th}>{h.price_avg.toFixed(2) * h.amount_sum}</TableRowColumn>
          <TableRowColumn style={style.thDate}>
            {
              (document.documentElement.clientWidth > window.gvar.breakpoint) ?
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
                  <TableHeaderColumn style={style.thBig}>Posição</TableHeaderColumn>
                  <TableHeaderColumn style={style.thBig}>Qtde</TableHeaderColumn>
                  <TableHeaderColumn style={style.th}>
                    {(document.documentElement.clientWidth > window.gvar.breakpoint) ? "Valor (R$)":"R$"}
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
});

export default MyHistory;
