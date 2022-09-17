import React from "react";
import { Table } from "react-bootstrap";
import Avatar from "../../../components/common/Avatar";
import Images from "../../../assets/images";
import _ from "lodash";

import "./TableStudent.scss";

function TableStudents() {
  return (
    <Table className="table borderless table-students">
      <thead>
        <tr>
          <th> STUDENT </th>
          <th> GRADE </th>
          <th> LAST ACTIVITY </th>
          <th> EMAIL </th>
          <th> ACTION </th>
        </tr>
      </thead>
      <tbody>
        {_.times(20, (t) => (
          <tr>
            <td>
              <Avatar src={Images.ProfileImg} style={{ marginRight: 6 }}></Avatar> Bryan
            </td>
            <td>A</td>
            <td>Week 2</td>
            <td>bobbymarh@gmail.com</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TableStudents;
