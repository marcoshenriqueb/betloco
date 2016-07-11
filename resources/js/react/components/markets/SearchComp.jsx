import React from 'react';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {fullWhite} from 'material-ui/styles/colors';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

var style = {
  card: {
    margin: 20
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textField: {
    width: '100%'
  },
  firstSelect: {
    marginRight: 40,
    width: 180
  },
  secSelect: {
    marginRight: 40,
  }
};

if (document.documentElement.clientWidth > window.gvar.breakpoint) {
  style.textField.width = '90%';
}

var checkbox = false;

var SearchComp = React.createClass({
  getInitialState: function(){
    return {
      expanded: false
    }
  },
  handleCheck: function(c){
    c.checked = !this.props.checked;
    this.props.handleCheck();
  },
  handleSearchChange: function(val){
    this.props.onUserInput(val.target.value);
  },
  componentDidUpdate: function(){
    if (!checkbox) {
      checkbox = document.getElementById('check');
      if (checkbox) {
        checkbox.addEventListener('click', (e)=>{
          this.handleCheck(checkbox.children[0]);
        })
      }
    }
    if (this.state.expanded == false) {
      checkbox = false;
    }
  },
  render: function() {
    var filterToogle = null;
    if (document.documentElement.clientWidth > window.gvar.breakpoint) {
      filterToogle = (
        <FloatingActionButton
          primary={true}
          mini={true}
          onTouchTap={()=>{
            this.setState({
              expanded: !this.state.expanded
            });
          }}>
          <FilterIcon color={fullWhite} />
        </FloatingActionButton>
      )
    }
    return (
      <Card className="container" style={style.card} expanded={this.state.expanded}>
        <CardActions
          style={{padding:'22px 16px'}}
          children={(
            <div style={style.header}>
              <TextField
                style={style.textField}
                hintText="Procurar mercados"
                value={this.props.search}
                onChange={this.handleSearchChange}
              />
              {filterToogle}
            </div>
          )}
        />
        <CardText expandable={true} style={{paddingTop:0}}>
          <div className="filter-container">
            <SelectField value={this.props.category}
                         onChange={this.props.handleCategoryChange}
                         floatingLabelText="Categoria"
                         style={style.firstSelect}>
              <MenuItem value="todas" primaryText="Todas" />
              <MenuItem value="politica" primaryText="Política" />
              <MenuItem value="esportes" primaryText="Esportes" />
              <MenuItem value="economia" primaryText="Economia" />
            </SelectField>
            <SelectField value={this.props.order}
                         onChange={this.props.handleOrderChange}
                         floatingLabelText="Ordem"
                         style={style.secSelect}>
              <MenuItem value="_score|desc" primaryText="Relevância" />
              <MenuItem value="created_at|desc" primaryText="Mais novo" />
              <MenuItem value="created_at|asc" primaryText="Mais antigo" />
              <MenuItem value="volume|desc" primaryText="Maior volume" />
              <MenuItem value="volume|asc" primaryText="Menor volume" />
              <MenuItem value="deadline|asc" primaryText="Mais perto de vencer" />
              <MenuItem value="deadline|desc" primaryText="Mais longe de vencer" />
            </SelectField>
            <p id="check">
              <input type="checkbox" />
              <label>Incluir mercados encerrados</label>
            </p>
          </div>
        </CardText>
      </Card>
    );
  }
});

export default SearchComp;
