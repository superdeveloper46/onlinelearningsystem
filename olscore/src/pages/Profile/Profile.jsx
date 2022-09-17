import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import UserNavigation from "../../layouts/user-navigation";
import Icons from "../../assets/icons";
import { toast } from "../../libs";

import "./Profile.scss";

import { updateProfileImage } from "../../store/auth.slice";
import { updateProfile } from "../../apis/common";

function PageProfile() {
  const dispatch = useDispatch();
  const Profile = useSelector((store) => store.auth.Profile);
  const [form, setForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-page-wrapper">
      <header className="profile-header">
        <h1> Update Profile </h1>
        <UserNavigation darkMode={false}></UserNavigation>
      </header>
      <div className="profile-info">
        <div className="profile-info__left d-flex align-items-center">
          <div className="avatar-editor">
            {Profile.Photo ? (
              <img src={Profile.Photo} alt="Avatar"></img>
            ) : (
              <Skeleton width={80} height={80} circle />
            )}
            <label className="avatar-editor-btn">
              <Icons.Photo></Icons.Photo>
              <input
                type="file"
                hidden
                accept=".png,.jpg"
                onChange={(e) => {
                  if (e.target.files.length === 0) {
                    return toast.warning("Please select image file");
                  }
                  const file = e.target.files[0];
                  if (file.type === "image/png" || file.type === "image/jpeg") {
                    const FR = new FileReader();
                    FR.addEventListener("load", (e) => {
                      const g_UserImgFileBase64String = e.target.result;
                      const substr = "base64,";
                      const index = g_UserImgFileBase64String.indexOf(substr);
                      if (index < 0) return;
                      const imgBase64String =
                        g_UserImgFileBase64String.substring(
                          index + substr.length
                        );
                      if (imgBase64String !== "") {
                        const data = {
                          Photo: imgBase64String,
                          InfoType: "Photo",
                        };
                        dispatch(updateProfileImage(data));
                      }
                    });
                    FR.readAsDataURL(file);
                  } else {
                    return toast.warning("Please select *.png, *.jpg file");
                  }
                }}
              />
            </label>
          </div>
          <div className="student-info d-flex flex-column">
            <span className="fullname">
              {Profile.FullName || <Skeleton height={30} width={250} />}
            </span>
            <span className="email">
              {Profile.Email || <Skeleton height={20} width={300} />}
            </span>
          </div>
          <div className="student-info-item">
            <span className="item__header">JOINED</span>
            <span className="item__content">July 2022</span>
          </div>
          <div className="student-info-item">
            <span className="item__header">SCHOOL</span>
            <span className="item__content">LWTech</span>
          </div>
        </div>
        <div className="profile-info__right">
          <button
            className="button button-primary"
            disabled={
              form.currentPassword.length === 0 &&
              form.newPassword.length === 0 &&
              form.confirmPassword.length === 0
            }
            onClick={() => {
              if (form.currentPassword.length === 0) {
                return toast.error("Current password field can't be empty");
              }
              if (form.newPassword.length === 0) {
                return toast.error("New password field can't be empty");
              }
              if (form.confirmPassword.length === 0) {
                return toast.error("Confirm password field can't be empty");
              }
              if (form.newPassword !== form.confirmPassword) {
                return toast.error("Passwords do not match");
              }
              const data = {
                CurrentPassword: form.currentPassword,
                NewPassword: form.newPassword,
                InfoType: "Password",
              };
              updateProfile(data)
                .then((res) => {
                  if (res.Result === "OK") {
                    setForm({
                      newPassword: "",
                      confirmPassword: "",
                      currentPassword: "",
                    });
                    return toast.success(
                      "Your password was updated successfully"
                    );
                  } else {
                    return toast.error("Incorrect Password");
                  }
                })
                .catch((err) => {
                  return toast.error("An unknown error occured");
                });
            }}
          >
            UPDATE PROFILE
          </button>
        </div>
      </div>
      <div className="profile-details">
        <h2> My Details </h2>
        <span className="lead-text">Update your profile details here</span>
      </div>
      <div className="cm-form-control">
        <div className="cm-control-label">
          <div className="cm-control-label__header">Name</div>
          <div className="cm-control-label__content">
            This will be displayed on your profile
          </div>
        </div>
        <div className="cm-control">
          <input className="cm-input" value={Profile.FullName} readOnly></input>
        </div>
      </div>
      <div className="cm-form-control">
        <div className="cm-control-label">
          <div className="cm-control-label__header">Email</div>
          <div className="cm-control-label__content">Use an active email</div>
        </div>
        <div className="cm-control">
          <input className="cm-input" value={Profile.Email} readOnly></input>
        </div>
      </div>
      <div className="profile-password">
        <h2> Password </h2>
      </div>
      <div className="cm-form-control">
        <div className="cm-control-label">
          <div className="cm-control-label__header">Current Password</div>
        </div>
        <div className="cm-control">
          <input
            className="cm-input"
            type="password"
            value={form.currentPassword}
            name="currentPassword"
            onChange={onChange}
          ></input>
        </div>
      </div>
      <div className="cm-form-control">
        <div className="cm-control-label">
          <div className="cm-control-label__header">New Password</div>
        </div>
        <div className="cm-control">
          <input
            className="cm-input"
            placeholder="Enter new password"
            type="password"
            value={form.newPassword}
            name="newPassword"
            onChange={onChange}
          ></input>
        </div>
      </div>
      <div className="cm-form-control">
        <div className="cm-control-label">
          <div className="cm-control-label__header">Confirm New Password</div>
        </div>
        <div className="cm-control">
          <input
            className="cm-input"
            placeholder="Confirm new password"
            type="password"
            value={form.confirmPassword}
            name="confirmPassword"
            onChange={onChange}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default PageProfile;
