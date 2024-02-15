import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./layouts/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error404 from "./components/error/Error404";
import Chat from "./layouts/Chat";
import Star from "./layouts/Star";
import Settings from "./layouts/Settings";
import Profile from "./layouts/Profile";
import Login from "./layouts/Login";
import Register from "./layouts/Register";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import ChatMain from "./components/main/ChatMain";

if (process.env.NODE_ENV === "production") {
  disableReactDevTools();
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      {
        path: "chat?",
        element: <Chat />,
        children: [
          {
            path: ":username",
            element: <ChatMain />,
          },
        ],
      },
      {
        path: "star",
        element: <Star />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
