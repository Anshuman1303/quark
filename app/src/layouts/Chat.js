import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { UserCircle } from "@phosphor-icons/react";
import useInterval from "../hooks/useInterval";
import NewChat from "../components/sidebar/NewChat";

const Chat = () => {
  const [friends, setFriends] = useState([]);
  const [searchFriends, setSearchFriends] = useState("");
  const navigate = useNavigate();
  const username = useParams()?.username;
  useEffect(() => {
    async function getFriends() {
      try {
        const response = await axios.get("/api/getfrnds");
        setFriends(response?.data?.friends);
      } catch (err) {
        console.log(err);
      }
    }
    getFriends();
  }, []);
  useInterval(async () => {
    try {
      const response = await axios.get("/api/getfrnds");
      setFriends(response?.data?.friends);
    } catch (err) {
      console.log(err);
    }
  }, 2000);
  return (
    <>
      <Sidebar setSearchFriends={setSearchFriends} menuSelected={"chat"}>
        {friends.map((friend, index) =>
          friend?.toUpperCase().includes(searchFriends?.toUpperCase()) &&
          username?.toUpperCase() === friend?.toUpperCase() &&
          username !== friend ? (
            <Navigate to={`/chat/${friend}`} />
          ) : (
            <li
              key={index}
              className={`friend${username?.toUpperCase() === friend?.toUpperCase() && " active"}`}
              onClick={() => navigate(`/chat/${friend}`)}>
              <UserCircle className="icon" weight="thin" />
              <p>{friend}</p>
            </li>
          )
        )}
        <NewChat />
      </Sidebar>
      <Outlet context={[friends, setFriends]} />
    </>
  );
};

export default Chat;
