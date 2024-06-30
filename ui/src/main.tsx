import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Index } from "./pages";
import { Layout } from "./layout";
import { RoomView } from "./pages/room-view";
import { RoomForm } from "./pages/room-form";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "/",
        Component: Index,
      },
      {
        path: "/room/:roomId",
        Component: RoomView,
      },
      {
        path: "/room/add",
        Component: RoomForm,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
