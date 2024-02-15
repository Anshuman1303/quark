import React from "react";
import "./Form.css";
import "../notification/MsgBox.css";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";

const Form = (props) => {
  return (
    <form {...props} className="form">
      {props["data-msg"]?.status && (
        <p className={`${props["data-msg"].status}-box msg-box`}>
          {props["data-msg"].status === "err" && <WarningCircle />}
          {props["data-msg"].status === "pass" && <CheckCircle />}
          {props["data-msg"].msg}
        </p>
      )}
      {props.children}
    </form>
  );
};

export default Form;
