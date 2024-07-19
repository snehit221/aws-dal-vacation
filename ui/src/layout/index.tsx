import { useState } from "react";
import { FaTicketAlt } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { Reservations } from "./reservations";
import { useUserStore } from "../store/user";

export const Layout = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Reservations open={open} setOpen={setOpen} />
      {/* NAVIGATION */}
      <nav className="p-5 shadow-sm flex items-center">
        <h1
          className="text-xl font-mono font-semibold"
          onClick={() => navigate(`/`)}
        >
          DalVacation
        </h1>
        <input placeholder="Search" className="w-1/3 mx-auto" />
        {user?.role === "customer" && (
          <h4
            onClick={() => setOpen(true)}
            className="text-xs font-semibold uppercase mr-5 flex items-center gap-2 cursor-pointer hover:text-indigo-500"
          >
            <FaTicketAlt />
            reservations
          </h4>
        )}
        {user?.role === "admin" && (
          <h4
            className="text-xs font-semibold uppercase mr-5 flex items-center gap-2 cursor-pointer hover:text-indigo-500"
            onClick={() => navigate("/room/add")}
          >
            Add Property
          </h4>
        )}
        {!user?.email && (
          <>
            {" "}
            <button
              type="button"
              className="primary"
              onClick={() => navigate(`/auth/signin`)}
            >
              Login
            </button>
            <button
              type="button"
              className="primary ml-2"
              onClick={() => navigate(`/auth/signup`)}
            >
              Sign Up
            </button>
          </>
        )}
        {!!user?.email && <button onClick={logout}>Log out</button>}
      </nav>

      {/* BODY */}
      <div className="w-8/12 mx-auto py-10">
        <Outlet />
      </div>
    </div>
  );
};
