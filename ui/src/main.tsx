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
import { EditRoom } from "./pages/edit-room";
import Dashboard from "./pages/dashboard/dashboard";
import Feedback from "./pages/feedback/feedback";
import Signup from "./pages/Authentication/signup/signup";
import Signin from "./pages/Authentication/login/signin";
import ThirdFactor from "./pages/Authentication/signup/thirdFactor";
import GetSecurityQuestion from "./pages/Authentication/login/getSecurityQuestion";
import LoginCipher from "./pages/Authentication/login/loginCipher";
import SecondFactor from "./pages/Authentication/signup/secondFactor";

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
      {
        path: "/auth/second-factor",
        Component: SecondFactor,
      },
      {
        path: "/auth/third-factor",
        Component: ThirdFactor,
      },
      {
        path: "/auth/security-answer",
        Component: GetSecurityQuestion,
      },
      {
        path: "/auth/decrypt-cipher",
        Component: LoginCipher,
      },
      {
        path: "/room/:roomId/edit",
        Component: EditRoom,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/feedback",
    element: <Feedback />,
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
