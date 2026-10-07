import {
  NavLink,
} from "react-router";

import "./AdminNav.css";

function AdminNav() {

  return (
    <nav className="admin-nav">

      <div className="admin-nav-container">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Categories
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/payments"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Payments
        </NavLink>

        <NavLink
          to="/admin/audit-logs"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Audit Logs
        </NavLink>

      </div>

    </nav>
  );
}

export default AdminNav;