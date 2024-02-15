import React, { useEffect, useState } from "react";
import "./ChatMain.css";
import ChatInput from "./ChatInput";
import axios from "../../api/axios";
import { useOutletContext, useParams } from "react-router-dom";
import { format, subDays } from "date-fns";
import useInterval from "../../hooks/useInterval";
const ChatMain = () => {
  const [friends, setFriends] = useOutletContext();
  const [msgs, setMsgs] = useState([]);
  const [localMsgs, setLocalMsgs] = useState([]);
  const [latestMsgTime, setLatestMsgTime] = useState("");
  const username = useParams()?.username;

  useEffect(() => {
    setMsgs([]);
    const getMsgs = async () => {
      try {
        const response = await axios.post("/api/getmsgs", {
          username: username,
        });
        setMsgs(response?.data?.msgs);
        setLatestMsgTime(response?.data?.msgs.reverse()[0].time);
      } catch (err) {
        console.log(err);
      }
    };
    getMsgs();
  }, [username]);

  useInterval(async () => {
    try {
      const response = await axios.post("/api/getmsgs", {
        username: username,
        timeA: latestMsgTime,
      });
      if (response?.data?.msgs.length) setLatestMsgTime(response?.data?.msgs.reverse()[0].time);
      setMsgs([...response?.data?.msgs.reverse(), ...msgs]);
    } catch (err) {
      console.log(err);
    }
  }, 1500);

  useEffect(() => {
    setLocalMsgs(msgs);
  }, [msgs]);

  return (
    <main className="chat-main">
      <div className="chats">
        {localMsgs.map((msg, index, msgs) => (
          <React.Fragment key={index}>
            <div key={index} className={`msg ${msg.sent ? "sent" : "received"}`}>
              {msg.msg}
              <p key={index} className="time">
                {format(new Date(msg.time), "hh:mm aa")}
              </p>
            </div>
            {(index === msgs.length - 1 ||
              (index !== msgs.length - 1 && msgs[index + 1].time.split("T")[0] !== msg.time.split("T")[0])) && (
              <p key={`${index}date`} className="date">
                {format(new Date(msg.time), "PPP")}
              </p>
            )}
          </React.Fragment>
        ))}
      </div>
      <ChatInput setMsgs={setLocalMsgs} msgs={localMsgs} friends={friends} setFriends={setFriends} />
    </main>
  );
};

export default ChatMain;
