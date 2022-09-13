import React from "react";
import "./TextInput.scss";

const TextInput = (props) => {
  return (
    <div className="input">
      <div className="input__content">
        <input
          autoFocus={props.autoFocus ?? false}
          autoComplete="new-password"
          type={props.type ?? "text"}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
          value={props.value}
        />
      </div>
    </div>
  );
};

export default TextInput;
