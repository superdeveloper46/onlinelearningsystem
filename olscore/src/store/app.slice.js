// import _ from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: {
    darkMode: false,
  },
  sidebar: {
    opened: true,
  },
  schoolList: [],
};

export const appSlice = createSlice({
  name: "App",
  initialState,
  reducers: {},
  extraReducers: {},
});

export default appSlice.reducer;
