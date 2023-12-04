import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const FinalConfirmation = ({ show, handleClose, handleConfirm }) => {
    console.log("here");
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`Confirm and send?`}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={ handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default FinalConfirmation