import {
  useEffect,
  useState,
} from "react";

import apiRequest from "../services/api.js";

import "../styles/pages/AdminPaymentsPage.css";

function AdminPaymentsPage() {

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [error, setError] =
    useState("");

  useEffect(() => {

    loadPayments();

  }, []);

  async function loadPayments() {

    setLoading(true);
    setError("");

    try {

      const response =
        await apiRequest(
          "/api/payments/admin",
          {
            method: "GET",
          }
        );

      const sortedPayments =
        [...response].sort(
          (firstPayment, secondPayment) =>
            new Date(
              secondPayment.createdAt
            ) -
            new Date(
              firstPayment.createdAt
            )
        );

      setPayments(
        sortedPayments
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  }

  function formatStatus(
    status
  ) {

    return status
      .replaceAll(
        "_",
        " "
      )
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  }

  function formatPaymentMethod(
    paymentMethod
  ) {

    if (
      paymentMethod ===
      "CASH_ON_DELIVERY"
    ) {

      return "Cash on Delivery";
    }

    return formatStatus(
      paymentMethod
    );
  }

  function formatDate(
    date
  ) {

    return new Date(
      date
    ).toLocaleString();
  }

  const filteredPayments =
    payments.filter(
      (payment) => {

        const searchValue =
          search
            .trim()
            .toLowerCase();

        const matchesSearch =
          !searchValue ||
          String(
            payment.id
          ).includes(
            searchValue
          ) ||
          String(
            payment.orderId
          ).includes(
            searchValue
          );

        const matchesStatus =
          statusFilter === "ALL" ||
          payment.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  const pendingCount =
    payments.filter(
      (payment) =>
        payment.status === "PENDING"
    ).length;

  const paidCount =
    payments.filter(
      (payment) =>
        payment.status === "PAID"
    ).length;

  const cancelledCount =
    payments.filter(
      (payment) =>
        payment.status === "CANCELLED"
    ).length;

  if (loading) {

    return (
      <section className="admin-payments-page">

        <p className="admin-payments-message">
          Loading payments...
        </p>

      </section>
    );
  }

  return (
    <section className="admin-payments-page">

      <div className="admin-payments-header">

        <div>

          <h1 className="page-title">
            Payment Management
          </h1>

          <p className="page-description">
            View customer payment records and payment status.
          </p>

        </div>

        <span className="admin-payment-count">
          {payments.length}{" "}
          {payments.length === 1
            ? "payment"
            : "payments"
          }
        </span>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="admin-payment-summary">

        <div className="admin-payment-summary-card">

          <span>
            Pending
          </span>

          <strong>
            {pendingCount}
          </strong>

        </div>

        <div className="admin-payment-summary-card">

          <span>
            Paid
          </span>

          <strong>
            {paidCount}
          </strong>

        </div>

        <div className="admin-payment-summary-card">

          <span>
            Cancelled
          </span>

          <strong>
            {cancelledCount}
          </strong>

        </div>

      </div>

      <section className="admin-payments-section">

        <div className="admin-payments-toolbar">

          <div className="admin-payment-search">

            <label htmlFor="paymentSearch">
              Search Payments
            </label>

            <input
              id="paymentSearch"
              type="text"
              value={search}
              placeholder="Payment ID or order ID..."
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <div className="admin-payment-filter">

            <label htmlFor="paymentStatus">
              Status
            </label>

            <select
              id="paymentStatus"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="ALL">
                All
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="PAID">
                Paid
              </option>

              <option value="FAILED">
                Failed
              </option>

              <option value="REFUNDED">
                Refunded
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>

            </select>

          </div>

          <span className="admin-payments-showing">
            Showing{" "}
            {filteredPayments.length}
          </span>

        </div>

        {filteredPayments.length === 0 ? (

          <div className="admin-payments-empty">

            <p>
              No payments found.
            </p>

          </div>

        ) : (

          <div className="admin-payments-table-container">

            <table className="admin-payments-table">

              <thead>

                <tr>

                  <th>
                    Payment
                  </th>

                  <th>
                    Order
                  </th>

                  <th>
                    Method
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Created
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPayments.map(
                  (payment) => (

                    <tr key={payment.id}>

                      <td>
                        <strong>
                          #{payment.id}
                        </strong>
                      </td>

                      <td>
                        #{payment.orderId}
                      </td>

                      <td>
                        {formatPaymentMethod(
                          payment.paymentMethod
                        )}
                      </td>

                      <td>
                        BHD{" "}
                        {Number(
                          payment.amount
                        ).toFixed(2)}
                      </td>

                      <td>

                        <span
                          className={
                            `admin-payment-table-status ${payment.status.toLowerCase()}`
                          }
                        >
                          {formatStatus(
                            payment.status
                          )}
                        </span>

                      </td>

                      <td>
                        {formatDate(
                          payment.createdAt
                        )}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </section>
  );
}

export default AdminPaymentsPage;