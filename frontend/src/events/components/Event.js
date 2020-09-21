import React from 'react';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';

const Event = ( { event, onClose } ) => {
  return (
    <Modal show={true}>
      <h1>Event</h1>
      <p>{ event.title }</p>
      <p>{ event.extendedProps.description }</p>
      <Button onClick={onClose} >
        Close
      </Button>
    </Modal>
  );
};

export default Event;
