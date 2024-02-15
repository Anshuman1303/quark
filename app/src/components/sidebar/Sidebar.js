import "./Sidebar.css";
import React from "react";
import Sidemenu from "./Sidemenu";
import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchInput";

const Sidebar = ({ children, menuSelected, setSearchFriends }) => {
  return (
    <aside className="sidebar">
      <Sidemenu menuSelected={menuSelected} />
      <SidebarHeader menuSelected={menuSelected}>
        {menuSelected === "chat" && <SearchBar setSearchFriends={setSearchFriends} />}
      </SidebarHeader>
      <main className="sidebar__main">{children}</main>
    </aside>
  );
};

export default Sidebar;
