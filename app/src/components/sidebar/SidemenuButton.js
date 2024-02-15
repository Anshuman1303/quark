import React from "react";
import "./SidemenuButton.css";
import { Link } from "react-router-dom";

const SidemenuButton = ({ Icon, menuName, menuSelected, setMenuSelected }) => {
  return (
    <Link to={`/${menuName}`}>
      <button className={"sidemenu__button" + (menuName === menuSelected ? " sidemenu__button--active" : "")} type="button">
        <Icon weight={menuSelected === menuName ? "fill" : "regular"} />
      </button>
    </Link>
  );
};

export default SidemenuButton;
