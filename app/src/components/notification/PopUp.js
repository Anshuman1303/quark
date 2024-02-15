import { CheckCircle, WarningCircle, X } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import "./MsgBox.css";
import "./PopUp.css";
import { useLocation } from "react-router-dom";

const PopUp = () => {
  const [animation, setAnimation] = useState("appear");
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const hide = async () => {
    setAnimation("disappear");
    await new Promise((r) => setTimeout(r, 300));
    setVisible(false);
  };
  useEffect(() => {
    setTimeout(hide, 6000);
  }, []);
  return (
    visible &&
    location?.state?.msg && (
      <p className={`${location.state?.status}-box pop-up msg-box ${animation}`}>
        {location.state?.status === "err" && <WarningCircle />}
        {location.state?.status === "pass" && <CheckCircle />}
        {location.state.msg}
        <X onClick={hide} className="x" />
      </p>
    )
  );
};

export default PopUp;
