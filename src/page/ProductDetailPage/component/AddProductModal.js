import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AddProductModal({ showModal, setShowModal, addItemToCart }) {

  const handleClose = () => {
    setShowModal(false);
  };
  const handleAdd = () => {
    addItemToCart();
    setShowModal(false);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to add this item again?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Yes, add this product to my cart
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddProductModal;