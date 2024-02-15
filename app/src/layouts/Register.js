import React from "react";
import "./Account.css";
import Form from "../components/form/Form";
import Input from "../components/form/Input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import validator from "validator";
import axios from "../api/axios";

const Register = () => {
  const [username, setUsername] = useState({ value: "", valid: true, err: "" });
  const [password, setPassword] = useState({ value: "", valid: true, err: "" });
  const [confirmPassword, setConfirmPassword] = useState({ value: "", valid: true, err: "" });
  const [loading, setLoading] = useState(false);
  const [inputted, setInputted] = useState(false);
  const [formMsg, setFormMsg] = useState({ status: null, msg: "" });
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    if (username.value.length === 0) {
      setUsername({ ...username, valid: false, err: "Required" });
    } else if (!validator.isLength(username.value, { min: 4 })) {
      setUsername({ ...username, valid: false, err: "Username must contain at least 4 characters" });
    } else if (!validator.isLength(username.value, { max: 50 })) {
      setUsername({ ...username, valid: false, err: "Username cannot be more than 50 characters" });
    } else if (!validator.isAlphanumeric(username.value, "en-US", { ignore: "_" })) {
      setUsername({ ...username, valid: false, err: "Username cannot contain symbols except underscores" });
    } else if (usernames.includes(username.value)) {
      setUsername({ ...username, valid: false, err: "Username taken" });
    } else {
      setUsername({ ...username, valid: true, err: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username.value, usernames]);

  useEffect(() => {
    if (
      !(
        validator.isStrongPassword(password.value, { minSymbols: 0 }) &&
        !validator.contains(password.value, " ") &&
        validator.isLength(password.value, { min: 8, max: 20 })
      )
    ) {
      if (password.value.length === 0) {
        setPassword({ ...password, valid: false, err: "Required" });
      } else if (!validator.isLength(password.value, { min: 8 })) {
        setPassword({ ...password, valid: false, err: "Password must contain at least 8 characters" });
      } else if (
        !validator.isStrongPassword(password.value, { minLength: 0, minLowercase: 1, minUppercase: 0, minNumbers: 0, minSymbols: 0 })
      ) {
        setPassword({ ...password, valid: false, err: "Password must contain at least 1 small letter" });
      } else if (
        !validator.isStrongPassword(password.value, { minLength: 0, minLowercase: 0, minUppercase: 1, minNumbers: 0, minSymbols: 0 })
      ) {
        setPassword({ ...password, valid: false, err: "Password must contain at least 1 capital letter" });
      } else if (
        !validator.isStrongPassword(password.value, { minLength: 0, minLowercase: 0, minUppercase: 0, minNumbers: 1, minSymbols: 0 })
      ) {
        setPassword({ ...password, valid: false, err: "Password must contain at least 1 digit" });
      } else if (!validator.isLength(password.value, { max: 20 })) {
        setPassword({ ...password, valid: false, err: "Password cannot contain more than 20 characters" });
      } else if (validator.contains(password.value, " ")) {
        setPassword({ ...password, valid: false, err: "Password cannot contain spaces" });
      } else {
        setPassword({ ...password, valid: false, err: "Invalid password" });
      }
    } else {
      setPassword({ ...password, valid: true, err: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password.value]);

  useEffect(() => {
    if (confirmPassword.value.length === 0) {
      setConfirmPassword({ ...confirmPassword, valid: false, err: "Required" });
    } else if (!validator.equals(password.value, confirmPassword.value)) {
      setConfirmPassword({ ...confirmPassword, valid: false, err: "Passwords do not match" });
    } else {
      setConfirmPassword({ ...confirmPassword, valid: true, err: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPassword.value, password.value]);

  async function handleSubmit(e) {
    e.preventDefault();
    setInputted(true);
    if (loading) return;
    if (!username.valid || !password.valid || !confirmPassword.valid) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "/register",
        JSON.stringify({
          username: username.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
        })
      );
      if (response?.status === 201) setFormMsg({ status: "pass", msg: "User registered" });
    } catch (err) {
      if (!err?.response) {
        setFormMsg({ status: "err", msg: "No server response" });
      } else if (err.response?.status === 409) {
        setUsernames([...usernames, username.value]);
      } else if (err.response?.data?.msg) {
        setFormMsg({ status: "err", msg: err.response.data.msg });
      } else {
        setFormMsg({ status: "err", msg: "Registration failed" });
      }
    }
    setLoading(false);
  }

  return (
    <main className="form-wrap">
      <Form onSubmit={handleSubmit} data-msg={formMsg.status && formMsg}>
        <h2>Register</h2>
        <Input
          type="text"
          data-label="Username"
          name="username"
          id="registerUsername"
          onChange={(e) => setUsername({ ...username, value: e.target.value })}
          autoComplete="off"
          data-err={inputted && username.err}
          autoFocus
        />
        <Input
          type="password"
          data-label="Password"
          name="password"
          id="registerPassword"
          onChange={(e) => setPassword({ ...password, value: e.target.value })}
          autoComplete="off"
          data-err={inputted && password.err}
        />
        <Input
          type="password"
          data-label="Confirm Password"
          name="confirmPassword"
          id="registerConfirmPassword"
          onChange={(e) => setConfirmPassword({ ...confirmPassword, value: e.target.value })}
          autoComplete="off"
          data-err={inputted && confirmPassword.err}
        />
        <Input type="submit" id="registerSubmit" loading={[loading]}>
          Register
        </Input>
        <span>
          <Link to="/login" className="link--hover">
            login?
          </Link>
        </span>
      </Form>
    </main>
  );
};

export default Register;
