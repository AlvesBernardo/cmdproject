import React from "react";
// import "./../css/components/_questionnaireButton.scss";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";

const Button = ({
  text,
  onClick,
  type = "primary",
  disabled = false,
  link,
  iconPosition,
  icon,
  style,
  className,
}) => {
  const Icon = icon; // Dynamically render the passed icon component

  return link ? (
    <a
      href={link}
      onClick={onClick}
      className={`button ${type === "primary" ? "button-primary" : "button-secondary"} ${
        disabled ? "button-disabled" : ""
      } ${className || ""}`}
      style={style}
    >
      {iconPosition === "left" && Icon && <Icon style={{ marginRight: "8px" }} />} {/* Left icon */}
      {text}
      {iconPosition === "right" && Icon && <Icon style={{ marginLeft: "8px" }} />} {/* Right icon */}
    </a>
  ) : (
    <button
      onClick={onClick}
      className={`button ${type === "primary" ? "button-primary" : "button-secondary"} ${
        disabled ? "button-disabled" : ""
      } ${className || ""}`}
      disabled={disabled}
      style={style}
    >
      {iconPosition === "left" && Icon && <Icon style={{ marginRight: "8px" }} />} {/* Left icon */}
      {text}
      {iconPosition === "right" && Icon && <Icon style={{ marginLeft: "8px" }} />} {/* Right icon */}
    </button>
  );
};

export default Button;