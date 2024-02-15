import "./Sidemenu.css";
import React from "react";
import { ChatCircleText, Star, GearSix, UserCircle } from "@phosphor-icons/react";
import SidemenuButton from "./SidemenuButton";

const Sidemenu = ({ menuSelected }) => {
  return (
    <aside className="sidebar__sidemenu">
      <SidemenuButton menuSelected={menuSelected} menuName="chat" Icon={ChatCircleText} />
      {/* <SidemenuButton menuSelected={menuSelected} menuName="star" Icon={Star} /> */}
      <span style={{ flexGrow: 1 }}></span>
      <SidemenuButton menuSelected={menuSelected} menuName="settings" Icon={GearSix} />
      <SidemenuButton menuSelected={menuSelected} menuName="profile" Icon={UserCircle} />
    </aside>
  );
};

export default Sidemenu;
