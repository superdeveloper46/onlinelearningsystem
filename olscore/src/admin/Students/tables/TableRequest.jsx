import React from "react";
import { Table } from "react-bootstrap";
import Avatar from "../../../components/common/Avatar";
import Images from "../../../assets/images";
import _ from "lodash";

import "./TableRequest.scss";

function TableStudents() {
  return (
    <Table className="table borderless table-request">
      <thead>
        <tr>
          <th> STUDENT </th>
          <th> SCHOOL NAME </th>
          <th> COURSE NAME </th>
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
            <td>University of Chicago</td>
            <td>Basic Programming with Javascript</td>
            <td>bobbymarsh.project@gmail.com</td>
            <td>
              <button className="button button-primary button-sm me-2">Accept</button>
              <button className="button button-primary button-outline button-sm">Reject</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TableStudents;
