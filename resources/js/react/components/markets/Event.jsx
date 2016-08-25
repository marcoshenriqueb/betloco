import React from 'react';
import EventCard from './EventCard.jsx';

var _Event = React.createClass({
  render: function() {
    return (
      <div className="container markets-container">
        {
          this.props.events.map((_event, id) => {
            return <EventCard _event={_event}
                              key={id} />
          })
        }
      </div>
    );
  }
});

export default _Event;
