import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteProductModal({showModal, setShowModal, deleteItem}) {

  const handleClose = () => {
    setShowModal(false);
  };
  const handleDelete = () => {
    deleteItem();
    setShowModal(false);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Yes, delete this product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteProductModal;