import { Outlet, useNavigate } from "react-router-dom";

export const Layout = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* NAVIGATION */}
      <nav className="p-5 shadow-sm flex items-center">
        <h1
          className="text-xl font-mono font-semibold"
          onClick={() => navigate(`/`)}
        >
          DalVacation
        </h1>
        <input placeholder="Search" className="w-1/3 mx-auto" />
        <button type="button" className="primary" onClick={() => navigate(`/auth/signin`)}>
          Login
        </button>
        <button type="button" className="primary ml-2" onClick={() => navigate(`/auth/signup`)}>
          Sign Up
        </button>
      </nav>

      {/* BODY */}
      <div className="w-8/12 mx-auto py-10">
        <Outlet />
      </div>
    </div>
  );
};
