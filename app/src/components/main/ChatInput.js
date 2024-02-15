import React, { useState } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import "./ChatInput.css";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import { trim } from "validator";
const ChatInput = ({ msgs, setMsgs, friends, setFriends }) => {
  const [label, setLabel] = useState(true);
  const [msg, setMsg] = useState("");
  const params = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trim(msg)) return;
    setMsg("");
    try {
      await axios.post("/api/msg", {
        username: params.username,
        msg: msg,
      });
      setMsgs([
        {
          msg: msg,
          time: new Date().toISOString(),
          sent: true,
        },
        ...msgs,
      ]);
      setFriends([
        params.username,
        ...friends.filter((friend) => {
          return friend !== params.username;
        }),
      ]);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <textarea
        rows="1"
        className="chat-input-input"
        type="text"
        name="msg"
        id="msg"
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.target.form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          }
        }}
        onBlur={() => setLabel(true)}
        onFocus={() => setLabel(false)}
        onChange={(e) => setMsg(e.target.value)}
        value={msg}
        autoFocus
      />
      {label && !msg && (
        <label htmlFor="msg" className="chat-input-label">
          Type a message
        </label>
      )}
      <button type="submit" className="chat-input-but">
        <PaperPlaneRight className="icon" weight="duotone" />
      </button>
    </form>
  );
};

export default ChatInput;
