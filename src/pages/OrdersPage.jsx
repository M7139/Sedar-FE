import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import apiRequest from "../services/api.js";

import "../styles/pages/OrdersPage.css";

function OrdersPage() {

  const [orders, setOrders] =
    useState([]);

  const [payments, setPayments] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [
    cancellingOrderId,
    setCancellingOrderId,
  ] = useState(null);

  const [
    selectedOrderId,
    setSelectedOrderId,
  ] = useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {

    loadOrders();

  }, []);

  async function loadOrders() {

    setLoading(true);
    setError("");

    try {

      const response =
        await apiRequest(
          "/api/orders/me",
          {
            method: "GET",
          }
        );

      setOrders(response);

      const paymentResults = {};

      for (const order of response) {

        try {

          const payment =
            await apiRequest(
              `/api/payments/orders/${order.id}`,
              {
                method: "GET",
              }
            );

          paymentResults[order.id] =
            payment;

        } catch (error) {

          if (error.status !== 404) {

            throw error;
          }
        }
      }

      setPayments(
        paymentResults
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  }

  function openCancelModal(
    orderId
  ) {

    setSelectedOrderId(
      orderId
    );
  }

  function closeCancelModal() {

    if (cancellingOrderId) {
      return;
    }

    setSelectedOrderId(
      null
    );
  }

  async function handleCancelOrder() {

    if (!selectedOrderId) {
      return;
    }

    const orderId =
      selectedOrderId;

    setCancellingOrderId(
      orderId
    );

    setError("");

    try {

      const updatedOrder =
        await apiRequest(
          `/api/orders/me/${orderId}/cancel`,
          {
            method: "PATCH",
          }
        );

      setOrders(
        orders.map(
          (order) =>
            order.id === orderId
              ? updatedOrder
              : order
        )
      );

      try {

        const payment =
          await apiRequest(
            `/api/payments/orders/${orderId}`,
            {
              method: "GET",
            }
          );

        setPayments(
          (currentPayments) => ({
            ...currentPayments,

            [orderId]:
              payment,
          })
        );

      } catch {
        // Payment may not exist.
      }

      setSelectedOrderId(
        null
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setCancellingOrderId(
        null
      );
    }
  }

  function canCancelOrder(
    status
  ) {

    return (
      status === "PENDING" ||
      status === "CONFIRMED"
    );
  }

  function formatStatus(
    status
  ) {

    return status.replaceAll(
      "_",
      " "
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

    return paymentMethod
      ?.replaceAll(
        "_",
        " "
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
      <section className="orders-page">

        <p className="orders-message">
          Loading orders...
        </p>

      </section>
    );
  }

  return (
    <section className="orders-page">

      <div className="orders-header">

        <div>

          <h1 className="page-title">
            My Orders
          </h1>

          <p className="page-description">
            View your previous and current orders.
          </p>

        </div>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {orders.length === 0 ? (

        <div className="orders-empty">

          <h2>
            No orders yet
          </h2>

          <p>
            Your orders will appear here after checkout.
          </p>

          <Link
            className="orders-shop-button"
            to="/products"
          >
            Browse Products
          </Link>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map(
            (order) => {

              const payment =
                payments[order.id];

              return (
                <article
                  className="order-card"
                  key={order.id}
                >

                  <div className="order-card-header">

                    <div>

                      <h2>
                        Order #{order.id}
                      </h2>

                      <p className="order-date">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>

                    </div>

                    <span
                      className={
                        `order-status ${order.status.toLowerCase()}`
                      }
                    >
                      {formatStatus(
                        order.status
                      )}
                    </span>

                  </div>

                  <div className="order-items">

                    {order.items.map(
                      (item) => (

                        <div
                          className="order-item"
                          key={item.id}
                        >

                          <div>

                            <Link
                              className="order-item-name"
                              to={`/products/${item.productId}`}
                            >
                              {item.productName}
                            </Link>

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

                  <div className="order-information">

                    <div className="order-info-section">

                      <h3>
                        Delivery Address
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

                    <div className="order-info-section">

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
                            <strong>
                              {formatStatus(
                                payment.status
                              )}
                            </strong>
                          </p>

                        </>
                      ) : (

                        <p>
                          No payment information.
                        </p>

                      )}

                    </div>

                  </div>

                  <div className="order-card-footer">

                    <div className="order-total">

                      <span>
                        Total
                      </span>

                      <strong>
                        BHD{" "}
                        {Number(
                          order.totalAmount
                        ).toFixed(2)}
                      </strong>

                    </div>

                    {canCancelOrder(
                      order.status
                    ) && (

                      <button
                        className="cancel-order-button"
                        onClick={() =>
                          openCancelModal(
                            order.id
                          )
                        }
                      >
                        Cancel Order
                      </button>

                    )}

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

      {selectedOrderId && (

        <div className="cancel-modal-overlay">

          <div className="cancel-modal">

            <h2>
              Cancel Order
            </h2>

            <p>
              Are you sure you want to cancel order{" "}
              <strong>
                #{selectedOrderId}
              </strong>
              ?
            </p>

            <p className="cancel-modal-description">
              The order will be cancelled and its products will be returned to stock.
            </p>

            <div className="cancel-modal-actions">

              <button
                className="cancel-modal-back"
                onClick={closeCancelModal}
                disabled={
                  cancellingOrderId ===
                  selectedOrderId
                }
              >
                Keep Order
              </button>

              <button
                className="cancel-modal-confirm"
                onClick={handleCancelOrder}
                disabled={
                  cancellingOrderId ===
                  selectedOrderId
                }
              >
                {cancellingOrderId ===
                selectedOrderId
                  ? "Cancelling..."
                  : "Cancel Order"
                }
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default OrdersPage;