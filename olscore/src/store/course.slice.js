import _ from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCourse, getGrades } from "../apis/course";
import { getCourseObjective, getCourseObjectiveLoadGrades } from "../apis/course";
import { setStudentList } from "./student.slice";

// get Course List and Course Grades
export const readCourses = createAsyncThunk("course/read_courses", async (data, thunkAPI) => {
  const { CourseList, StudentList } = await getCourse();
  const grades = (await getGrades()).CourseList;
  thunkAPI.dispatch(setStudentList(StudentList));

  return {
    CourseList: CourseList.map((course, index) => ({
      ..._.pick(course, ["Name", "CourseInstanceId", "Quarter", "Picture"]),
      ..._.pick(grades[index], ["TotalCompletion", "TotalGrade"]),
    })),
  };
});

export const readCourse = createAsyncThunk("course/read_course", async (CourseInstanceId, thunkAPI) => {
  let Course = thunkAPI
    .getState()
    .course.CourseList.find((course) => course.CourseInstanceId === parseInt(CourseInstanceId));
  const objectivesData = await getCourseObjective(CourseInstanceId);
  const gradesData = await getCourseObjectiveLoadGrades(CourseInstanceId);

  const ObjectiveList = objectivesData.CourseObjectiveList.map((objective, index) => ({
    Id: objective.Id,
    Description: objective.Description,
    Modules: objective.Modules.map((module, moduleIndex) => ({
      ...module,
      ..._.pick(gradesData[index].Modules[moduleIndex], "Completion", "Percent", "StrokeDasharray"),
    })),
  }));

  let Modules = [];
  ObjectiveList.forEach((objective, index) => {
    Modules = Modules.concat(objective.Modules);
  });

  return {
    CourseInstanceId,
    Course: {
      ...Course,
      ObjectiveList,
      Modules,
    },
  };
});

export const courseSlice = createSlice({
  name: "course",
  initialState: {
    isLoading: true,
    isCourseLoading: true,
    CourseList: [],
    CourseInstanceId: -1,
    Course: {
      ObjectiveList: [],
      Modules: [],
    },
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCourseLoading: (state, action) => {
      state.isCourseLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readCourses.fulfilled, (state, action) => {
      state.CourseList = action.payload.CourseList;
      state.isLoading = false;
    });
    builder.addCase(readCourses.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error);
    });
    builder.addCase(readCourse.fulfilled, (state, action) => {
      state.CourseInstanceId = action.payload.CourseInstanceId;
      state.Course = action.payload.Course;
      state.isCourseLoading = false;
    });
    builder.addCase(readCourse.rejected, (state, action) => {
      state.CourseInstanceId = -1;
      state.Course = { ObjectiveList: [], Modules: [] };
      state.isCourseLoading = false;
    });
  },
});

export const { setLoading, setCourseLoading } = courseSlice.actions;

export default courseSlice.reducer;
