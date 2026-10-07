import {
  NavLink,
  useNavigate,
} from "react-router";

import useAuth from "../hooks/useAuth.js";

import "./Navbar.css";

function Navbar() {

  const {
    user,
    logout,
    isAuthenticated,
  } = useAuth();

  const navigate =
    useNavigate();

  function handleLogout() {

    logout();

    navigate("/");
  }

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <NavLink
          className="navbar-brand"
          to="/"
        >
          Sedar
        </NavLink>

        <div className="navbar-links">

          <NavLink
            to="/"
            className="navbar-link"
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className="navbar-link"
          >
            Products
          </NavLink>

          {isAuthenticated ? (
            <>

              <NavLink
                to="/cart"
                className="navbar-link"
              >
                Cart
              </NavLink>

              <NavLink
                to="/orders"
                className="navbar-link"
              >
                Orders
              </NavLink>

              {user?.role === "ADMIN" && (

                <NavLink
                  to="/admin"
                  className="navbar-link"
                >
                  Admin
                </NavLink>

              )}

              <NavLink
                to="/profile"
                className="navbar-link"
              >
                {user?.firstName || "Profile"}
              </NavLink>

              <button
                className="navbar-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>
          ) : (
            <>

              <NavLink
                to="/login"
                className="navbar-link"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="navbar-link"
              >
                Register
              </NavLink>

            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;