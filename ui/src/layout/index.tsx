import { useState } from "react";
import { FaTicketAlt } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { Reservations } from "./reservations";

export const Layout = () => {
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
        <h4
          onClick={() => setOpen(true)}
          className="text-xs font-semibold uppercase mr-5 flex items-center gap-2 cursor-pointer hover:text-indigo-500"
        >
          <FaTicketAlt />
          reservations
        </h4>
        <h4
          className="text-xs font-semibold uppercase mr-5 flex items-center gap-2 cursor-pointer hover:text-indigo-500"
          onClick={() => navigate("/room/add")}
        >
          add
        </h4>
        <button type="submit" className="primary">
          Login
        </button>
      </nav>

      {/* BODY */}
      <div className="w-8/12 mx-auto py-10">
        <Outlet />
      </div>
    </div>
  );
};
