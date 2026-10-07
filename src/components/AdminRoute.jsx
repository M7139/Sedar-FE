import {
  Navigate,
} from "react-router";

import useAuth from "../hooks/useAuth.js";

import AdminNav from "./AdminNav.jsx";

function AdminRoute({
  children,
}) {

  const {
    user,
    isAuthenticated,
  } = useAuth();

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user?.role !== "ADMIN") {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return (
    <>

      <AdminNav />

      {children}

    </>
  );
}

export default AdminRoute;