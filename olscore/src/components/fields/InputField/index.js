import React, { useState } from "react";

// assets
import WarningIcon from "../../../assets/icons/warning.svg";
import EyeIcon from "../../../assets/icons/auth/eye.svg";
import EyeSlashIcon from "../../../assets/icons/auth/eye-slash.svg";

// styles
import "./InputField.scss";

const InputField = ({
  className,
  label,
  LeftIcon,
  hasRightIcon,
  showPassIcon,
  name,
  error,
  onChange,
  placeholder,
  value,
  type = "",
  inputRef,
  ...props
}) => {
  const [showPass, setShowPass] = useState(false);
  const [inputType, setInputType] = useState(type);
  const isError = error !== "";
  let inputStyle = !isError ? "cm-input" : "cm-input error";
  let inputContainerStyle = "input-container";
  if (LeftIcon) {
    inputContainerStyle += " has-left-icon";
  }
  if (hasRightIcon) {
    inputContainerStyle += " has-right-icon";
  }
  let inputLeftIconStyle = "left-icon";

  const onEyeIconClick = () => {
    if (showPass) setInputType("password");
    else setInputType("text");
    setShowPass((prev) => !prev);
  };

  return (
    <div className={className}>
      {label ? <div className="inpfLabel">{label}</div> : ""}
      <div className={inputContainerStyle}>
        {LeftIcon ? <LeftIcon className={inputLeftIconStyle} /> : null}
        <input
          type={inputType}
          className={inputStyle}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          ref={inputRef}
          {...props}
        />
        {/* {hasRightIcon && rightIcon ? <img src={rightIcon} alt="input icon" className={inputIconStyle} /> : null} */}
        {hasRightIcon && showPassIcon ? (
          <img
            src={showPass ? EyeSlashIcon : EyeIcon}
            alt="eye-slash icon"
            className={"right-icon"}
            onClick={onEyeIconClick}
          />
        ) : null}
      </div>
      {isError && (
        <div className="inpfErrorLabel">
          <img src={WarningIcon} alt="warn icon" />
          {error}
        </div>
      )}
    </div>
  );
};

export default InputField;
