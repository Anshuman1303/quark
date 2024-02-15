import React, { useEffect, useState } from "react";
import "./App.css";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import PopUp from "../components/notification/PopUp";
const App = () => {
  const navigate = useNavigate();
  const logout = () => {
    axios.post("/logout");
    navigate("/login");
  };
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [response, setResponse] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/isauth");
        setResponse(res.status);
      } catch (err) {
        setResponse(err?.response?.status);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);
  return (
    <div className="app">
      {isLoading ? (
        <p>loading...</p>
      ) : response === 200 ? (
        <>
          <PopUp />
          <Outlet context={logout} />
        </>
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </div>
  );
};
export default App;
