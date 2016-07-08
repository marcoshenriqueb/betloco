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
      expanded: false,
      checked: false
    }
  },
  handleCheck: function(c){
    c.checked = !this.state.checked;
    this.setState({
      checked: !this.state.checked
    });
  },
  handleSearchChange: function(val){
    this.props.onUserInput(val.target.value);
  },
  componentDidUpdate: function(){
    if (!checkbox) {
      checkbox = document.getElementById('check');
      if (checkbox) {
        checkbox.addEventListener('click', (e)=>{
          console.log('click');
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
            <SelectField value={1}
                         onChange={this.handleChange}
                         floatingLabelText="Categoria"
                         autoWidth={true}
                         style={style.firstSelect}>
              <MenuItem value={1} primaryText="Todas" />
              <MenuItem value={2} primaryText="Política" />
              <MenuItem value={3} primaryText="Esportes" />
              <MenuItem value={4} primaryText="Economia" />
            </SelectField>
            <SelectField value={1}
                         onChange={this.handleChange}
                         floatingLabelText="Ordem"
                         autoWidth={true}
                         style={style.secSelect}>
              <MenuItem value={1} primaryText="Mais novo" />
              <MenuItem value={2} primaryText="Mais antigo" />
              <MenuItem value={3} primaryText="Maior volume" />
              <MenuItem value={4} primaryText="Menor volume" />
              <MenuItem value={4} primaryText="Mais perto de vencer" />
              <MenuItem value={4} primaryText="Mais longe de vencer" />
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
