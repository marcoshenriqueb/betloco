import React from 'react';
import EventCard from './EventCard.jsx';

export default class _Event extends React.Component {
  render() {
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
}
