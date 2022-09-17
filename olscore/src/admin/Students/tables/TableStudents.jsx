import React from "react";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import Avatar from "../../../components/common/Avatar";
import Images from "../../../assets/images";
import _ from "lodash";

import "./TableStudent.scss";

function TableStudents() {
  const StudentList = useSelector((store) => store.student.StudentList);

  return (
    <Table className="table borderless table-students">
      <thead>
        <tr>
          <th> STUDENT </th>
          <th> MODULES DONE </th>
          <th> ON WEEK </th>
          <th> GRADE </th>
          <th> ACTION </th>
        </tr>
      </thead>
      <tbody>
        {StudentList.map((student) => (
          <tr key={student.Id}>
            <td>
              <Avatar src={Images.ProfileImg} style={{ marginRight: 6 }}></Avatar> {student.Name}
            </td>
            <td>168 Modules</td>
            <td>Week 5</td>
            <td>273</td>
            <td>Bryan</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TableStudents;
