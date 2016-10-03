import React from 'react';
import EventCard from './EventCard.jsx';

export default class _Event extends React.Component {
  shouldComponentUpdate(nextProps){
    if (JSON.stringify(this.props.events) === JSON.stringify(nextProps.events) &&
        JSON.stringify(this.props.prices) === JSON.stringify(nextProps.prices)) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div className="container markets-container">
        {
          this.props.events.map((_event, id) => {
            return <EventCard _event={_event}
                              key={id}
                              prices={this.props.prices} />
          })
        }
      </div>
    );
  }
}

_Event.propTypes = {
  events: React.PropTypes.array.isRequired
};
