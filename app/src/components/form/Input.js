import React from "react";
import "./Input.css";
import { useState } from "react";
import { EyeSlash, Eye, Spinner } from "@phosphor-icons/react";

const Input = (props) => {
  const [press, setPress] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <>
      {props.type === "submit" ? (
        <button
          {...props}
          className={"submit-button " + (props.className && props.className)}
          type={props.loading[0] ? "disabled" : "submit"}>
          {props.loading[0] ? <Spinner className="rotate" /> : props.children}
        </button>
      ) : (
        <div className={`input ${props["data-err"] && "invalid"}`}>
          <input
            {...props}
            className="input-child"
            placeholder=""
            type={props.type === "password" ? (press || hover ? "text" : "password") : props.type}
            aria-invalid={props["data-err"] ? "true" : "false"}
            aria-describedby={`${props.id}err`}
          />
          {props["data-label"] && (
            <label htmlFor={props.id} className="label active">
              {props["data-label"]}
            </label>
          )}
          {props.type === "password" && (
            <button
              type="button"
              className="visibility"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => (press ? setPress(false) : setPress(true))}
              aria-label={`toggle ${props["data-label"]} visibility`}>
              {press ? <Eye size={32} weight={hover ? "fill" : "light"} /> : <EyeSlash size={32} weight={hover ? "fill" : "light"} />}
            </button>
          )}
        </div>
      )}
      <p className="err" id={`${props.id}err`}>
        {props["data-err"]}
      </p>
    </>
  );
};

export default Input;
