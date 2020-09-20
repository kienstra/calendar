import React, { useContext } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './EventForm.css';

const NewEvent = ( { fetchEvents, onClose, startTime } ) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
    },
    false
  );

  const eventSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('start', startTime);
      await sendRequest(process.env.REACT_APP_BACKEND_URL + '/events', 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      });
      fetchEvents();
    } catch (err) {}
    onClose();
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal show={true}>
        <form className="event-form" onSubmit={eventSubmitHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <h1>New Event</h1>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
          />
          <Input
            id="description"
            element="input"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            ADD EVENT
          </Button>
          <Button onClick={ onClose } >
            CANCEL
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default NewEvent;
