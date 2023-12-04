import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmDataFeatures = ({ show, handleClose, handleConfirm, output, selectedDatu }) => {
    console.log("here");
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`Confirm the output is: ${output}, for ${selectedDatu}.`}
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
export default ConfirmDataFeatures