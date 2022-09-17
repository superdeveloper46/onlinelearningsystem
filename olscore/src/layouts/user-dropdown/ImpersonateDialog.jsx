import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { navigateStudent } from "../../store/auth.slice";

function ImpersonateDialog(props) {
  const [selectedStudentId, setSelectedStudentId] = useState(-1);
  const Name = useSelector((store) => store.auth.Student.Name);
  const StudentList = useSelector((store) => store.student.StudentList);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedStudentId(StudentList.find((item) => item.Name === Name)?.Id);
  }, [Name, StudentList]);

  return (
    <Modal size="lg" centered {...props}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">Impersonate Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label>Select Student to impersonate</Form.Label>
        <Form.Select
          size="lg"
          onChange={(e) => {
            setSelectedStudentId(e.target.value);
          }}
          value={selectedStudentId}
        >
          {StudentList?.map((student) => (
            <option key={student.Id} value={student.Id}>
              {student.Name}
            </option>
          ))}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="button button-primary"
          onClick={() => {
            if (selectedStudentId > 0)
              dispatch(navigateStudent(selectedStudentId)).then(() => {
                props.onHide();
              });
          }}
        >
          Impersonate
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ImpersonateDialog;
