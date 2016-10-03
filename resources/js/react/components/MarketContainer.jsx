import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SearchComp from './markets/SearchComp.jsx';
import _Event from './markets/Event.jsx';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {
  getEvents,
  getNextEventPage
} from '../redux/actions/eventsFetchingActions';

import {
  handleUserInput,
  handleCheck,
  handleCategoryChange,
  handleOrderChange
} from '../redux/actions/searchActions';

class MarketContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getEvents();
  }

  render() {
    var nextPageButton = null;
    if (this.props.next != null) {
      nextPageButton = (
        <FloatingActionButton mini={true} onClick={this.props.getNextEventPage}>
          <ContentAdd />
        </FloatingActionButton>
      );
    }
    var markets = (
      <div>
        <br/>
        <div className="bouncer">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
        <br/>
      </div>
    );
    if (this.props.events != null) {
      markets = (
        <_Event events={this.props.events}
                search={this.props.search}
                prices={this.props.eventPrices} />
      );
    }
    return (
      <div className="app-content">
        <SearchComp search={this.props.search}
                    onUserInput={this.props.handleUserInput}
                    checked={this.props.checked}
                    handleCheck={this.props.handleCheck}
                    category={this.props.category}
                    handleCategoryChange={this.props.handleCategoryChange}
                    order={this.props.order}
                    handleOrderChange={this.props.handleOrderChange} />
        {markets}
        {nextPageButton}
        <br />
        <br />
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    events: state.eventsSearch.events,
    search: state.eventsSearch.search,
    next: state.eventsSearch.next,
    checked: state.eventsSearch.expired,
    category: state.eventsSearch.category,
    order: state.eventsSearch.order,
    eventPrices: state.eventsSearch.eventPrices
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getEvents,
    getNextEventPage,
    handleUserInput,
    handleCheck,
    handleCategoryChange,
    handleOrderChange
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(MarketContainer);
