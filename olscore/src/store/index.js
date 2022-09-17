import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./auth.slice";
import appSlice from "./app.slice";
import courseSlice from "./course.slice";
import moduleSlice from "./module.slice";
import chatSlice from "./chat.slice";
import studentSlice from "./student.slice";

export default configureStore({
  reducer: {
    auth: authSlice,
    app: appSlice,
    course: courseSlice,
    module: moduleSlice,
    student: studentSlice,
    chat: chatSlice,
  },
});
