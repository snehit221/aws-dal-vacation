import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div>
      {/* NAVIGATION */}
      <nav className="p-5 shadow-sm flex items-center">
        <h1 className="text-xl font-mono font-semibold">DalVacation</h1>
        <input placeholder="Search" className="w-1/3 mx-auto" />
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
