// import _ from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getModuleObjective } from "../apis/course";

const getActivitysFromObjectives = (moduleObjectives) => {
  let tmp = [];
  tmp = tmp.concat(
    moduleObjectives.Materials.map((material, index) => ({
      type: "Material",
      index: index + 1,
      ...material,
    }))
  );
  tmp = tmp.concat(
    moduleObjectives.Quizzes.map((quiz, index) => ({
      type: "Quiz",
      index: index + 1,
      ...quiz,
    }))
  );
  tmp = tmp.concat(
    moduleObjectives.Assessments.map((assignment, index) => ({
      type: "Assignment",
      index: index + 1,
      ...assignment,
    }))
  );
  tmp = tmp.concat(
    moduleObjectives.Polls.map((poll, index) => ({
      type: "Poll",
      index: index + 1,
      ...poll,
    }))
  );

  return tmp;
};

// get Course List and Course Grades
export const readModuleObjective = createAsyncThunk("module/module_objective", async ({ courseInstanceId, moduleId }, thunkAPI) => {
  const module = await getModuleObjective(courseInstanceId, moduleId);
  const moduleObjective = module.ModuleObjectives[0];

  return {
    ModuleId: parseInt(moduleId),
    Description: module.Description,
    ModuleObjectiveId: moduleObjective?.Id,
    ModuleObjectiveDescription: moduleObjective?.Description,
    // Materials: moduleObjective?.Materials,
    // Quizzes: moduleObjective?.Quizzes,
    // Assignments: moduleObjective?.Assessments,
    // Polls: moduleObjective?.Polls,
    Activities: getActivitysFromObjectives(moduleObjective),
  };
});

const initialState = {
  isLoading: true,

  ModuleId: 0,
  Description: "",

  ModuleObjectiveId: 0,
  ModuleObjectiveDescription: "",
  // Materials: [],
  // Polls: [],
  // Quizzes: [],
  // Assignments: [],
  Activities: [],
};

export const moduleSlice = createSlice({
  name: "Module",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: {
    [readModuleObjective.fulfilled]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        ...action.payload,
      };
    },
    [readModuleObjective.rejected]: (state, action) => {
      return {
        ...initialState,
        isLoading: false,
      };
    },
  },
});

export const { setLoading } = moduleSlice.actions;

export default moduleSlice.reducer;
