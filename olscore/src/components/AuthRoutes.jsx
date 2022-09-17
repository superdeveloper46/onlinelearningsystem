import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login/index.jsx";
import ContactUs from "../pages/auth/ContacUs/index.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword/index.jsx";
import RequestLogin from "../pages/auth/RequestLogin/index.jsx";

function AuthRoutes() {
  return (
    <Routes>
      <Route index element={<Login></Login>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/forgotpassword" element={<ForgotPassword></ForgotPassword>}></Route>
      <Route path="/contactus" element={<ContactUs></ContactUs>}></Route>
      <Route path="/requestlogin" element={<RequestLogin></RequestLogin>}></Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AuthRoutes;
