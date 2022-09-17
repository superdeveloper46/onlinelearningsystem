// import _ from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  StudentList: [],
};

export const studentSlice = createSlice({
  name: "Student",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setStudentList: (state, action) => {
      state.StudentList = action.payload;
    },
  },
  extraReducers: {},
});

export const { setStudentList } = studentSlice.actions;

export default studentSlice.reducer;
