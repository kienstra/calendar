import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';

import Event from '../components/Event';
import NewEvent from '../components/NewEvent';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Calendar = ({ events, fetchEvents }) => {
  const [ isCreatingEvent, setIsCreatingEvent ] = useState(false);
  const [ isViewingEvent, setIsViewingEvent ] = useState(false);
  const [ eventBeingViewed, setEventBeingViewed ] = useState({});
  const [ newEventStartTime, setNewEventStartTime ] = useState('');
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const isCalendarForCurrentUser = auth.userId === useParams().userId;

  const handleEventChange = async changeInfo => {
    if ( changeInfo.event.start === changeInfo.oldEvent.start || ! changeInfo.event.id ) {
      return;
    }

    try {
      await sendRequest(
        `http://localhost:5000/api/events/${changeInfo.event.id}`,
        'PATCH',
        JSON.stringify({
          description: changeInfo.event.extendedProps.description,
          start: changeInfo.event.startStr,
          title: changeInfo.event.title,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
    } catch (err) { }
  };

  const renderEventContent = (eventInfo) => {
    return <i>{eventInfo.event.title}</i>;
  }

  /**
   * Handles clicking to add a new event.
   *
   * @param {Object} selectInfo The info associated with selecting.
   */
  const handleDateSelect = (selectInfo) => {
    selectInfo.view.calendar.unselect(); // Clear date selection.
    setNewEventStartTime(selectInfo.startStr);
    setIsCreatingEvent(true);
  }

  const handleNewEventClose = () => setIsCreatingEvent( false );
  const handleViewEventClose = () => setIsViewingEvent( false );

  const handleEventClick = (eventClickInfo) => {
    setEventBeingViewed(eventClickInfo.event);
    setIsViewingEvent(true);
  };

  return (
    <>
      {isCreatingEvent && <NewEvent fetchEvents={fetchEvents} startTime={newEventStartTime} onClose={handleNewEventClose} />}
      {isViewingEvent && <Event event={ eventBeingViewed } onClose={handleViewEventClose} />}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        eventChange={handleEventChange}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        editable={isCalendarForCurrentUser}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        eventContent={renderEventContent}
        select={handleDateSelect}
        events={events}
      />
    </>
  )
};

export default Calendar;
