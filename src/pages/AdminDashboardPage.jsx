import {
  Link,
} from "react-router";

import "../styles/pages/AdminDashboardPage.css";

function AdminDashboardPage() {

  return (
    <section className="admin-dashboard-page">

      <div className="admin-dashboard-header">

        <h1 className="page-title">
          Admin Dashboard
        </h1>

        <p className="page-description">
          Manage the Sedar online store.
        </p>

      </div>

      <div className="admin-dashboard-grid">

        <Link
          className="admin-dashboard-card"
          to="/admin/products"
        >
          <h2>
            Products
          </h2>

          <p>
            Add, edit, activate and manage store products.
          </p>
        </Link>

        <Link
          className="admin-dashboard-card"
          to="/admin/categories"
        >
          <h2>
            Categories
          </h2>

          <p>
            Create and manage product categories.
          </p>
        </Link>

        <Link
          className="admin-dashboard-card"
          to="/admin/orders"
        >
          <h2>
            Orders
          </h2>

          <p>
            View customer orders and update order status.
          </p>
        </Link>

        <Link
          className="admin-dashboard-card"
          to="/admin/users"
        >
          <h2>
            Users
          </h2>

          <p>
            View customers and manage account status.
          </p>
        </Link>

        <Link
          className="admin-dashboard-card"
          to="/admin/payments"
        >
          <h2>
            Payments
          </h2>

          <p>
            View customer payment records.
          </p>
        </Link>

        <Link
          className="admin-dashboard-card"
          to="/admin/audit-logs"
        >
          <h2>
            Audit Logs
          </h2>

          <p>
            Review important system and administrator actions.
          </p>
        </Link>

      </div>

    </section>
  );
}

export default AdminDashboardPage;