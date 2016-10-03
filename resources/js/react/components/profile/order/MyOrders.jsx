import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { IndexLink } from 'react-router';
import {Card, CardHeader, CardActions, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Open from 'material-ui/svg-icons/action/open-in-browser';

import {
  getOrders
} from '../../../redux/actions/profile/positionActions';

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
  style.firstRowColumn.paddingLeft = 24;
  style.firstRowColumn.paddingRight = 24;
}
if (document.documentElement.clientWidth > window.gvar.desktopbreak) {
  style.firstColumn.width = 500;
  style.firstRowColumn.width = 500;
}

class MyOrders extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getOrders();
  }

  render(){
    var title = (<h2 style={style.title}>Ordens em Aberto</h2>);
    if (this.props.orders === false) {
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
    }else if (this.props.orders.length == 0) {
      return (
        <div>
          {title}
          <p className="error-warning">Você não tem nenhuma ordem em aberto</p>
        </div>
      )
    }

    var returnTitle = function(p){
      return p.market__title_short;
    }
    if (document.documentElement.clientWidth > window.gvar.desktopbreak) {
      returnTitle = function(p){
        return p.market__title;
      }
    }
    var rows = null;
    if (this.props.orders.length > 0) {
      rows = this.props.orders.map((o, k)=> (
        <TableRow key={k}>
          <TableRowColumn className="multiple-market-table__choice"
                          style={style.firstRowColumn}>
            {returnTitle(o)}
          </TableRowColumn>
          {
            (document.documentElement.clientWidth > window.gvar.breakpoint) ?
              (
                <TableRowColumn style={style.th}>{o.amount}</TableRowColumn>
              )
            :
              (
                <TableRowColumn style={style.th}>{(o.amount*o.price).toFixed(0)}</TableRowColumn>
              )
          }
          <TableRowColumn style={style.thBig}>{(o.price*100).toFixed(0)}¢</TableRowColumn>
          <TableRowColumn style={style.th}>
            <IndexLink to={'/app/mercado/' + o.market__id + '/'}>
              <Open/>
            </IndexLink>
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
                  <TableHeaderColumn style={style.th}>
                    {(document.documentElement.clientWidth > window.gvar.breakpoint) ? "Qtde":"R$"}
                  </TableHeaderColumn>
                  <TableHeaderColumn style={style.thBig}>Preço</TableHeaderColumn>
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
}

function mapStateToProps(state){
  return {
    orders: state.profilePosition.orders
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getOrders
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(MyOrders);
