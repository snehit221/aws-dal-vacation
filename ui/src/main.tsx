import React from "react";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Index } from "./pages";
import { Layout } from "./layout";
import { RoomView } from "./pages/room-view";
import { RoomForm } from "./pages/room-form";
import { queryClient } from "./lib/client";
import Signup from "./pages/Authentication/signup";
import Signin from "./pages/Authentication/signin";

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
      {
        path: "/auth/signup",
        Component: Signup,
      },
      {
        path: "/auth/signin",
        Component: Signin,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
