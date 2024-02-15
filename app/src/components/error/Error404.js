import React from "react";
import { Link } from "react-router-dom";
import "./Error404.css";

const Error404 = () => {
  return (
    <main className="Error404 fade-in">
      <h1>Error: 404</h1>
      <p>
        Lost? Go back{" "}
        <span className="link">
          <Link to={`/`}>home</Link>
        </span>
      </p>
    </main>
  );
};

export default Error404;
