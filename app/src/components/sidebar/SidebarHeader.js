import React from "react";
import "./SidebarHeader.css";

const SidebarHeader = ({ children, menuSelected }) => {
  const headings = {
    chat: "Chats",
    star: "Starred",
    settings: "Settings",
    profile: "Your Profile",
  };
  return (
    <header className="sidebar__header">
      <h2>{headings[menuSelected]}</h2>
      {children}
    </header>
  );
};

export default SidebarHeader;
