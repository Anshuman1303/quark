import React from "react";
import "./Account.css";
import Form from "../components/form/Form";
import Input from "../components/form/Input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";

const Login = () => {
  const [username, setUsername] = useState({ value: "", valid: true, err: "" });
  const [password, setPassword] = useState({ value: "", valid: true, err: "" });
  const [loading, setLoading] = useState(false);
  const [inputted, setInputted] = useState(false);
  const [formMsg, setFormMsg] = useState({ status: null, msg: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  useEffect(() => {
    if (username.value.length === 0) {
      setUsername({ ...username, valid: false, err: "Required" });
    } else {
      setUsername({ ...username, valid: true, err: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username.value]);

  useEffect(() => {
    if (password.value.length === 0) {
      setPassword({ ...password, valid: false, err: "Required" });
    } else {
      setPassword({ ...password, valid: true, err: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password.value]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInputted(true);
    if (loading) return;
    if (!username.valid || !password.valid) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "/login",
        JSON.stringify({
          username: username.value,
          password: password.value,
        })
      );
      if (response?.status === 200) {
        navigate(from, { replace: true, state: { status: "pass", msg: "Logged In" } });
      }
    } catch (err) {
      if (!err?.response) {
        setFormMsg({ status: "err", msg: "No server response" });
      } else if (err.response?.data?.msg) {
        setFormMsg({ status: "err", msg: err.response.data.msg });
      } else {
        setFormMsg({ status: "err", msg: "Login failed" });
      }
    }
    setLoading(false);
  };

  return (
    <main className="form-wrap">
      <Form onSubmit={handleSubmit} data-msg={formMsg.status && formMsg}>
        <h2>Login</h2>
        <Input
          type="text"
          data-label="Username"
          name="username"
          id="loginUsername"
          onChange={(e) => setUsername({ ...username, value: e.target.value })}
          autoComplete="off"
          data-err={inputted && username.err}
          value={username.value}
          autoFocus
        />
        <Input
          type="password"
          data-label="Password"
          name="password"
          id="loginPassword"
          onChange={(e) => setPassword({ ...password, value: e.target.value })}
          autoComplete="off"
          data-err={inputted && password.err}
          value={password.value}
        />
        <Input type="submit" id="loginSubmit" loading={[loading]}>
          Login
        </Input>
        <span>
          <Link to="/register" className="link--hover">
            Register?
          </Link>
        </span>
      </Form>
    </main>
  );
};
export default Login;
