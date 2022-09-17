import * as React from "react";
import { Form } from "react-bootstrap";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

import "./index.scss";
import { getCourseObjective, getCourseObjectiveLoadGrades } from "../../../apis/course";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GradeBreakdown({ CourseInstanceId }) {
  const [tableData, setTableData] = React.useState(null);

  React.useEffect(() => {
    if (CourseInstanceId && CourseInstanceId > 0) {
      getCourseObjective(CourseInstanceId)
        .then((objectivesData) => {
          getCourseObjectiveLoadGrades(CourseInstanceId).then((gradesData) => {
            let labels = [];
            let data = [];
            objectivesData.CourseObjectiveList.forEach((objective, index) => {
              objective.Modules.forEach((module, moduleIndex) => {
                labels.push(module.Description);
                data.push(gradesData[index].Modules[moduleIndex].Completion);
              });
            });
            setTableData({ labels, datasets: [{ label: "", data, backgroundColor: "#AADBEF" }] });
          });
        })
        .catch((err) => {});
    }
  }, [CourseInstanceId]);

  return (
    <div className="graph-card-container">
      <div className="graph-card-header">
        <label>Grade Breakdown</label>
        {/* <Form.Select style={{ maxWidth: 240 }} onChange={(e) => setCourseInstanceId(e.target.value)} value={CourseInstanceId}>
          {courseList.map((course) => (
            <option value={course.CourseInstanceId} key={course.CourseInstanceId}>
              {course.Name}
            </option>
          ))}
        </Form.Select> */}
      </div>
      <div className="graph-card-body">
        {tableData && (
          <Bar
            options={{
              responsive: true,
              maxBarThickness: 33,
              plugins: {
                legend: {
                  display: false,
                  // position: "top"
                },
                // title: {
                //   display: true,
                //   text: "Chart.js Bar Chart",
                // },
              },
              elements: {
                bar: {
                  backgroundColor: "#AADBEF",
                  borderRadius: 8,
                  borderWidth: 0,
                  maxBarThickness: 33,
                },
              },
            }}
            data={tableData}
          />
        )}
      </div>
    </div>
  );
}

export default GradeBreakdown;
