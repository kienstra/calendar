import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Calendar from '../components/Calendar';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserEvents = () => {
  const [loadedEvents, setLoadedEvents] = useState();
  const { error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;
  const fetchEvents = useCallback( async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/events/user/${userId}`
      );

      setLoadedEvents(responseData.events);
    } catch (err) { }
  }, [userId, sendRequest] );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, sendRequest, userId]);

  const eventDeletedHandler = deletedEventId => {
    setLoadedEvents(prevEvents =>
      prevEvents.filter(event => event.id !== deletedEventId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Calendar events={loadedEvents} fetchEvents={fetchEvents} onDelete={eventDeletedHandler} />
    </>
  );
};

export default UserEvents;
