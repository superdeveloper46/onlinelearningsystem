import React, { useState } from "react";
import { API_URL } from "../../../Global";
import { FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [visibility, setVisibility] = useState(false);
	const [passError, setPassError] = useState("");
	const [emailError, setEmailError] = useState("");

	const nav = useNavigate();

	const show = () => {
		setVisibility(!visibility);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const data = {
			username: email,
			password: password,
		};
		fetch(`${API_URL}login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((jsonResponse) => {
				console.log("Success: ", jsonResponse);
				const error = jsonResponse.error;
				const guid = jsonResponse.studentIdHash;
				if (guid === "-1") {
					if (error === "Password was incorrect") {
						setPassError("Incorrect Password");
					}
					if (error === "Could not find a login with that username") {
						setEmailError("Invalid User");
					}
				} else {
					localStorage.setItem("KeepMeLoggedIn", true);
					localStorage.setItem("Hash", guid);
					localStorage.setItem("StudentName", jsonResponse.StudentName);
					localStorage.setItem("StudentProfileImage", jsonResponse.Picture);

					if (jsonResponse.IsAdmin & (jsonResponse.AdminHash !== "")) {
						localStorage.setItem("IsAdmin", jsonResponse.IsAdmin);
						localStorage.setItem("AdminHash", jsonResponse.AdminHash);
					}
					// successfully logged on go to course selection
					nav("/courses");
				}
			})
			.catch((error) => console.log("Error: ", error));
	};

	return (
		<section className="hero-section">
			<div className="hero-section-bg d-flex align-items-center">
				<div className="container">
					<div className="row d-flex align-items-center">
						<div className="col-xl-7 col-lg-12 col-md-12 text-xl-left text-center order-xl-1 order-2">
							<div className="my-5">
								<div className="">
									<h1 className="hero-section-heading">
										<span className="font-weight-bold font-4">
											Let's Use Data
											<br />
											to Improve your
											<br />
											Learning Experience
										</span>
									</h1>
								</div>
							</div>
						</div>

						<div className="col-xl-5 col-lg-12 col-md-12 text-xl-right text-center order-xl-2 order-1">
							<form className="login-card my-5" onSubmit={handleSubmit}>
								<div className="text-center">
									<h4 className="login-card-title">user login</h4>
								</div>
								<div className="form-group mb-4">
									<div className="d-flex position-relative">
										<input
											id="txtUser"
											type="text"
											className="form-control custom-input"
											placeholder="Your Username"
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
									{emailError && (
										<div className="input-validation-message">
											<FaExclamationCircle /> {emailError}
										</div>
									)}
								</div>
								<div className="form-group mb-2">
									<div className="d-flex position-relative input-password">
										<input
											type={visibility ? "text" : "password"}
											className="form-control custom-input"
											placeholder="Your Password"
											onChange={(e) => setPassword(e.target.value)}
										/>
										<div className="right-icon">
											{visibility ? (
												<FaEye onClick={show} />
											) : (
												<FaEyeSlash onClick={show} />
											)}
										</div>
									</div>
									{passError && (
										<div className="input-validation-message">
											<FaExclamationCircle /> {passError}
										</div>
									)}
								</div>
								<div className="d-flex mb-4 justify-content-between">
									<div className="keep-logged-in">
										<input
											type="checkbox"
											className="form-check-input"
											id="keepLoggedIn"
										/>
										<label
											className="form-check-label pl-2"
											htmlFor="keepLoggedIn"
										>
											Keep me logged in
										</label>
									</div>
									<div className="forgot-password">
										<Link
											to="/forgotpassword"
											className="forgot-password"
											id="ForgotPassword"
										>
											Forgot password?
										</Link>
									</div>
								</div>
								<div className="text-center login-notice-area">
									<span id="lblMessage" style={{ display: "none" }} />
								</div>
								<div className="d-flex justify-content-center">
									<a
										href="##"
										className="forgot-password"
										id="ForgotPassword"
										style={{ display: "none" }}
									>
										Request New Password
									</a>
									<input
										type="submit"
										className="login-card_quick-link"
										defaultValue="Request Login"
										style={{ display: "none" }}
									/>
								</div>
								<div className="d-flex flex-column align-items-center pb-3">
									<input
										type="submit"
										className="btn custom-primary-btn mb-3"
										value="Submit"
									/>
									<a href="###" className="login-card_quick-link">
										Need a Login?
									</a>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
