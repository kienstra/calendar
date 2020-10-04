import React, { useContext } from 'react';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth-context';

const Event = ( { event, onClose } ) => {
  const auth = useContext(AuthContext);

  return (
    <Modal show={true}>
      <h1>Event</h1>
      <p>{ event.title }</p>
      <p>{ event.extendedProps.description }</p>
      <Button onClick={onClose}>
        Close
      </Button>
      { auth.userId === event.extendedProps.creator && (
        <a
          className="button button--inverse"
          target="_blank"
          rel="noopener noreferrer"
          href={ `/events/${ event.id }` }
        >
          Edit
        </a>
      ) }

    </Modal>
  );
};

export default Event;
