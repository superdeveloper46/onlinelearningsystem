import Cookies from "universal-cookie";
import _ from "lodash";
import { toast } from "../libs";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfileInfo, updateProfile } from "../apis/common";
import { getStudentInfo } from "../apis/course";

const cookies = new Cookies();
const keepMeLoggedIn = cookies.get("keepMeLoggedIn") || false;
const loginData =
  keepMeLoggedIn && localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")) : {};

if (loginData?.studentIdHash) {
  localStorage.setItem("Hash", loginData?.studentIdHash);
  localStorage.setItem("AdminHash", loginData?.AdminHash);
} else {
  localStorage.setItem("Hash", null);
  localStorage.setItem("AdminHash", null);
}

// get Course List and Course Grades
export const readProfileInfo = createAsyncThunk("profile/read_profile", async (thunkAPI) => {
  const profile = await getProfileInfo();
  return profile;
});

// update profile avatar image
export const updateProfileImage = createAsyncThunk("profile/update_profile_image", async (data, thunkAPI) => {
  const res = await updateProfile(data);
  if (res.Result === "OK") {
    return "data:image;base64," + data.Photo;
  } else {
    return null;
  }
});

export const navigateStudent = createAsyncThunk("auth/impersonate", async (studentId, thunkAPI) => {
  const data = await getStudentInfo(studentId);
  return data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authenticated: loginData.studentIdHash ? true : false,
    Admin: {
      IsAdmin: loginData.IsAdmin ? true : false,
      AdminHash: loginData.AdminHash,
    },
    Student: {
      Name: loginData.StudentName,
      Picture: loginData.Picture,
      Hash: loginData.studentIdHash,
    },
    Profile: {
      Email: null,
      FullName: null,
      Photo: null,
      UserName: null,
      Password: null,
    },
  },
  reducers: {
    signin: (state, action) => {
      if (action.payload.keepMeLoggedIn) {
        cookies.set("keepMeLoggedIn", true, { path: "/", maxAge: 86400 * 30 });
      } else {
        cookies.set("keepMeLoggedIn", true, { path: "/" });
      }
      localStorage.setItem("loginData", JSON.stringify(action.payload.data));
      localStorage.setItem("Hash", action.payload.data.studentIdHash);
      localStorage.setItem("AdminHash", action.payload.data.AdminHash);

      return {
        ...state,
        authenticated: true,
        Student: {
          Name: action.payload.data.StudentName,
          Picture: action.payload.data.Picture,
          Hash: action.payload.data.studentIdHash,
        },
        Admin: {
          IsAdmin: action.payload.data.IsAdmin || false,
          AdminHash: action.payload.data.AdminHash || "",
        },
      };
    },
    signout: (state, action) => {
      cookies.remove("keepMeLoggedIn");
      localStorage.clear();
      state.authenticated = false;
    },
  },
  extraReducers: {
    [readProfileInfo.fulfilled]: (state, action) => {
      state.Profile = _.pick(action.payload, ["Email", "FullName", "Photo", "UserName", "Password"]);
    },
    [readProfileInfo.rejected]: (state, action) => {
      toast.error("An unknown error occured");
    },
    [updateProfileImage.fulfilled]: (state, action) => {
      if (action.payload) {
        toast.success("Picture uploaded successfully.");
        state.Profile.Photo = action.payload;
      } else {
        toast.error("An unknown error occured");
      }
    },
    [updateProfileImage.rejected]: (state, action) => {
      toast.error("An unknown error occured");
    },
    [navigateStudent.fulfilled]: (state, action) => {
      localStorage.setItem("Hash", action.payload.studentIdHash);
      state.Student = {
        Name: action.payload.StudentName,
        Picture: action.payload.Picture,
        Hash: action.payload.studentIdHash,
      };
    },
    [navigateStudent.rejected]: (state, action) => {
      toast.error("An unknown error occured");
    },
  },
});

// Action creators are generated for each case reducer function
export const { signin, signout } = authSlice.actions;

export default authSlice.reducer;
