import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { API_URL } from "../../../Global";
import axios from "axios";

import OlsLoader from "../../../components/loader/ols";

import Icons from "../../../assets/icons";
import LogoInline from "../../../assets/images/logo-white.svg";
import InputField from "../../../components/fields/InputField";

import { signin } from "../../../store/auth.slice";

import "./LoginPage.scss";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const passwordRef = React.useRef(null);

  const onClickBtnLogin = () => {
    const data = {
      username: email,
      password: password,
    };
    setLoading(true);
    axios
      .post(`${API_URL}login`, data)
      .then((res) => res.data)
      .then((jsonResponse) => {
        const error = jsonResponse.error;
        const guid = jsonResponse.studentIdHash;
        if (guid === "-1") {
          if (error === "Password was incorrect") {
            setEmailError("");
            setPasswordError("Incorrect Password");
          }
          if (error === "Could not find a login with that username") {
            setEmailError("Invalid User");
            setPasswordError("");
          }
        } else {
          dispatch(signin({ keepMeLoggedIn: rememberMe, data: jsonResponse }));
          navigate("/");
        }
      })
      .catch((error) => console.log("Error: ", error))
      .then(() => setLoading(false));
  };

  if (isLoading) return <OlsLoader></OlsLoader>;

  return (
    <div className="bg-contatiner">
      <div className="bg-hero">
        <div className="login-section">
          <div className="login-container">
            <div className="custom-card over-section">
              <div>
                <h2 className="text-uppercase font-28">Log In</h2>
                <p className="font-18 auth-subheader pb-2">
                  Using Data to Improve Learning Experiences
                </p>
              </div>
              <div>
                <InputField
                  type="email"
                  placeholder="Email"
                  LeftIcon={Icons.Auth.User}
                  error={emailError}
                  className="py-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      passwordRef.current.focus();
                    }
                  }}
                />
                <InputField
                  type="password"
                  placeholder="Password"
                  LeftIcon={Icons.Auth.Key}
                  hasRightIcon={true}
                  showPassIcon={true}
                  error={passwordError}
                  className="py-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  inputRef={passwordRef}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) onClickBtnLogin();
                  }}
                />
                <div className="keep-logged-in text-cus-secondary pt-2">
                  <input
                    type="checkbox"
                    className="form-check-input form-success-check-input"
                    id="keepLoggedIn"
                    checked={rememberMe}
                    onChange={(e) => {
                      setRememberMe(e.target.checked);
                    }}
                  />
                  <label className="ps-2 mb-0" htmlFor="keepLoggedIn">
                    Remembered Me
                  </label>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between pt-5">
                <Link
                  to="/forgotpassword"
                  className="link-cus-primary text-capitalize"
                >
                  Forgot Password ?
                </Link>
                <button className="btn-cus-primary px-5" onClick={onClickBtnLogin}>
                  SIGN IN
                </button>
              </div>
            </div>
            <div className="wide-section py-3">
              <img src={LogoInline} alt="logo" className="logo-image" />
              <div className="mb-5">
                <h3 className="font-24 text-white mb-2">Need an account ?</h3>
                <p className="font-18 text-cus-secondary">
                  Use the request login button to ask your instructor for one
                </p>
              </div>
              <div className="wide-btn-group gap-4">
                <Link to="/requestlogin" className="btn-cus-secondary px-3">
                  REQUEST ACCOUNT
                </Link>
                <Link to="/contactus" className="link-cus-secondary contact-us">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
