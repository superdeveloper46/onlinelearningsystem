import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form } from "react-bootstrap";

import "./NewCourse.scss";

function DialogNewCourse(props) {
  return (
    <Modal centered {...props} dialogClassName="modal-700">
      <Modal.Header closeButton>
        <Modal.Title as="h5">Create New Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Course Name</Form.Label>
          <Form.Control placeholder="e.g. Data Science 800" size="lg"></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>School</Form.Label>
          <Form.Select size="lg" placeholder="== Choose One=="></Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Quarter</Form.Label>
          <Form.Select size="lg" placeholder="== Choose One=="></Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Delivery Mechanism</Form.Label>
          <Form.Select size="lg" placeholder="== Choose One=="></Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <button className="button button-primary button-block" onClick={() => {}}>
          Create Course
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default DialogNewCourse;
