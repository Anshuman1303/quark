import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { useOutletContext } from "react-router-dom";

const Settings = () => {
  const logout = useOutletContext();
  return (
    <>
      <Sidebar menuSelected={"settings"}>
        <button className="settings-button" onClick={logout}>
          Logout
        </button>
      </Sidebar>
    </>
  );
};

export default Settings;
