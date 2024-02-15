import React, { useState } from "react";
import { Plus, PaperPlaneRight } from "@phosphor-icons/react";
import "./NewChat.css";
import { useNavigate } from "react-router-dom";
const NewChat = () => {
  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowInput(false);
    setUsername("");
    if (username) navigate(`/chat/${username}`);
  };
  return (
    <form className="new-chat-form" onSubmit={handleSubmit}>
      {showInput && <input className="new-chat-input" placeholder="Username" autoFocus onChange={(e) => setUsername(e.target.value)} />}
      <button
        type={showInput ? "button" : "submit"}
        className={`new-chat-button${showInput ? " submit" : ""}`}
        onClick={() => setShowInput(!showInput)}>
        {showInput ? <PaperPlaneRight /> : <Plus />}
      </button>
    </form>
  );
};

export default NewChat;
