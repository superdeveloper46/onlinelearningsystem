// import _ from "lodash";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  contacts: [],
  messages: [],
};

export const chatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: {},
});

export default chatSlice.reducer;
