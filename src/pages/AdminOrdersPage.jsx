import {
  useEffect,
  useState,
} from "react";

import apiRequest from "../services/api.js";

import "../styles/pages/AdminOrdersPage.css";

function AdminOrdersPage() {

  const [orders, setOrders] =
    useState([]);

  const [payments, setPayments] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  const [statusAction, setStatusAction] =
    useState(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    loadOrders();

  }, []);

  async function loadOrders() {

    setLoading(true);
    setError("");

    try {

      const [
        orderResponse,
        paymentResponse,
      ] = await Promise.all([
        apiRequest(
          "/api/orders/admin",
          {
            method: "GET",
          }
        ),

        apiRequest(
          "/api/payments/admin",
          {
            method: "GET",
          }
        ),
      ]);

      const sortedOrders =
        [...orderResponse].sort(
          (firstOrder, secondOrder) =>
            new Date(
              secondOrder.createdAt
            ) -
            new Date(
              firstOrder.createdAt
            )
        );

      const paymentMap = {};

      paymentResponse.forEach(
        (payment) => {

          paymentMap[
            payment.orderId
          ] = payment;
        }
      );

      setOrders(
        sortedOrders
      );

      setPayments(
        paymentMap
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  }

  async function refreshPayments() {

    const response =
      await apiRequest(
        "/api/payments/admin",
        {
          method: "GET",
        }
      );

    const paymentMap = {};

    response.forEach(
      (payment) => {

        paymentMap[
          payment.orderId
        ] = payment;
      }
    );

    setPayments(
      paymentMap
    );
  }

  function openStatusAction(
    order,
    status
  ) {

    setStatusAction({
      order,
      status,
    });

    setError("");
    setMessage("");
  }

  function closeStatusAction() {

    if (updatingOrderId) {
      return;
    }

    setStatusAction(
      null
    );
  }

  async function handleStatusUpdate() {

    if (!statusAction) {
      return;
    }

    const {
      order,
      status,
    } = statusAction;

    setUpdatingOrderId(
      order.id
    );

    setError("");
    setMessage("");

    try {

      const response =
        await apiRequest(
          `/api/orders/admin/${order.id}/status`,
          {
            method: "PATCH",

            body: JSON.stringify({
              status,
            }),
          }
        );

      setOrders(
        orders.map(
          (currentOrder) =>
            currentOrder.id ===
            response.id
              ? response
              : currentOrder
        )
      );

      await refreshPayments();

      setStatusAction(
        null
      );

      setMessage(
        `Order #${order.id} updated to ${formatStatus(status)}.`
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setUpdatingOrderId(
        null
      );
    }
  }

  function getOrderActions(
    order
  ) {

    switch (order.status) {

      case "PENDING":

        return [
          {
            status: "CONFIRMED",
            label: "Confirm Order",
          },
          {
            status: "CANCELLED",
            label: "Cancel Order",
            danger: true,
          },
        ];

      case "CONFIRMED":

        return [
          {
            status: "PROCESSING",
            label: "Start Processing",
          },
          {
            status: "CANCELLED",
            label: "Cancel Order",
            danger: true,
          },
        ];

      case "PROCESSING":

        return [
          {
            status: "SHIPPED",
            label: "Mark Shipped",
          },
        ];

      case "SHIPPED":

        return [
          {
            status: "DELIVERED",
            label: "Mark Delivered",
          },
        ];

      default:

        return [];
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

  if (loading) {

    return (
      <section className="admin-orders-page">

        <p className="admin-orders-message">
          Loading orders...
        </p>

      </section>
    );
  }

  return (
    <section className="admin-orders-page">

      <div className="admin-orders-header">

        <div>

          <h1 className="page-title">
            Order Management
          </h1>

          <p className="page-description">
            View customer orders and manage their status.
          </p>

        </div>

        <span className="admin-order-count">
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"
          }
        </span>

      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {orders.length === 0 ? (

        <div className="admin-orders-empty">

          <p>
            No orders found.
          </p>

        </div>

      ) : (

        <div className="admin-orders-list">

          {orders.map(
            (order) => {

              const payment =
                payments[order.id];

              const actions =
                getOrderActions(
                  order
                );

              return (
                <article
                  className="admin-order-card"
                  key={order.id}
                >

                  <div className="admin-order-card-header">

                    <div>

                      <h2>
                        Order #{order.id}
                      </h2>

                      <p>
                        {formatDate(
                          order.createdAt
                        )}
                      </p>

                    </div>

                    <span
                      className={
                        `admin-order-status ${order.status.toLowerCase()}`
                      }
                    >
                      {formatStatus(
                        order.status
                      )}
                    </span>

                  </div>

                  <div className="admin-order-items">

                    <h3>
                      Items
                    </h3>

                    {order.items.map(
                      (item) => (

                        <div
                          className="admin-order-item"
                          key={item.id}
                        >

                          <div>

                            <strong>
                              {item.productName}
                            </strong>

                            <p>
                              BHD{" "}
                              {Number(
                                item.price
                              ).toFixed(2)}
                              {" × "}
                              {item.quantity}
                            </p>

                          </div>

                          <strong>
                            BHD{" "}
                            {Number(
                              item.subtotal
                            ).toFixed(2)}
                          </strong>

                        </div>

                      )
                    )}

                  </div>

                  <div className="admin-order-details">

                    <div className="admin-order-detail-section">

                      <h3>
                        Delivery
                      </h3>

                      <p>
                        House {order.house}
                      </p>

                      <p>
                        Road {order.road}
                      </p>

                      <p>
                        Block {order.block}
                      </p>

                      {order.area && (
                        <p>
                          {order.area}
                        </p>
                      )}

                      <p>
                        {order.phoneNumber}
                      </p>

                    </div>

                    <div className="admin-order-detail-section">

                      <h3>
                        Payment
                      </h3>

                      {payment ? (
                        <>

                          <p>
                            {formatPaymentMethod(
                              payment.paymentMethod
                            )}
                          </p>

                          <p>
                            Status:{" "}

                            <strong
                              className={
                                `admin-payment-status ${payment.status.toLowerCase()}`
                              }
                            >
                              {formatStatus(
                                payment.status
                              )}
                            </strong>
                          </p>

                        </>
                      ) : (

                        <p className="admin-no-payment">
                          No payment found.
                        </p>

                      )}

                    </div>

                    <div className="admin-order-detail-section">

                      <h3>
                        Total
                      </h3>

                      <p className="admin-order-total">
                        BHD{" "}
                        {Number(
                          order.totalAmount
                        ).toFixed(2)}
                      </p>

                    </div>

                  </div>

                  <div className="admin-order-card-footer">

                    {actions.length > 0 ? (

                      <div className="admin-order-actions">

                        {actions.map(
                          (action) => (

                            <button
                              key={
                                action.status
                              }
                              className={
                                action.danger
                                  ? "admin-order-action-button danger"
                                  : "admin-order-action-button"
                              }
                              onClick={() =>
                                openStatusAction(
                                  order,
                                  action.status
                                )
                              }
                            >
                              {action.label}
                            </button>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="admin-order-complete-message">

                        {order.status ===
                        "DELIVERED"
                          ? "Order completed."
                          : "Order cancelled."
                        }

                      </p>

                    )}

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

      {statusAction && (

        <div className="admin-order-modal-overlay">

          <div className="admin-order-modal">

            <h2>
              Update Order
            </h2>

            <p>
              Change order{" "}
              <strong>
                #{statusAction.order.id}
              </strong>
              {" "}from{" "}

              <strong>
                {formatStatus(
                  statusAction.order.status
                )}
              </strong>

              {" "}to{" "}

              <strong>
                {formatStatus(
                  statusAction.status
                )}
              </strong>
              ?
            </p>

            {statusAction.status ===
              "CANCELLED" && (

              <p className="admin-order-modal-warning">
                Cancelling this order will return the ordered products to stock and cancel its pending payment.
              </p>

            )}

            {statusAction.status ===
              "DELIVERED" && (

              <p className="admin-order-modal-description">
                The Cash on Delivery payment will be marked as paid.
              </p>

            )}

            {statusAction.status ===
              "CONFIRMED" && (

              <p className="admin-order-modal-description">
                A pending payment must exist before this order can be confirmed.
              </p>

            )}

            <div className="admin-order-modal-actions">

              <button
                className="admin-order-modal-back"
                onClick={
                  closeStatusAction
                }
                disabled={
                  updatingOrderId ===
                  statusAction.order.id
                }
              >
                Go Back
              </button>

              <button
                className={
                  statusAction.status ===
                  "CANCELLED"
                    ? "admin-order-modal-confirm danger"
                    : "admin-order-modal-confirm"
                }
                onClick={
                  handleStatusUpdate
                }
                disabled={
                  updatingOrderId ===
                  statusAction.order.id
                }
              >
                {updatingOrderId ===
                statusAction.order.id
                  ? "Updating..."
                  : "Confirm"
                }
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default AdminOrdersPage;