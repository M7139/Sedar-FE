import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import apiRequest from "../services/api.js";

import "../styles/pages/CheckoutPage.css";

function CheckoutPage() {

  const [cart, setCart] =
    useState(null);

  const [hasAddress, setHasAddress] =
    useState(false);

  const [house, setHouse] =
    useState("");

  const [road, setRoad] =
    useState("");

  const [block, setBlock] =
    useState("");

  const [area, setArea] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] =
    useState("");

  const [completedOrder, setCompletedOrder] =
    useState(null);

  const [completedPayment, setCompletedPayment] =
    useState(null);

  useEffect(() => {

    async function loadCheckout() {

      setLoading(true);
      setError("");

      try {

        const cartResponse =
          await apiRequest(
            "/api/cart",
            {
              method: "GET",
            }
          );

        setCart(
          cartResponse
        );

        try {

          const addressResponse =
            await apiRequest(
              "/api/addresses/me",
              {
                method: "GET",
              }
            );

          setHasAddress(true);

          setHouse(
            addressResponse.house
          );

          setRoad(
            addressResponse.road
          );

          setBlock(
            addressResponse.block
          );

          setArea(
            addressResponse.area || ""
          );

          setPhoneNumber(
            addressResponse.phoneNumber
          );

        } catch (error) {

          if (error.status === 404) {

            setHasAddress(false);

          } else {

            throw error;
          }
        }

      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);
      }
    }

    loadCheckout();

  }, []);

  async function saveAddress() {

    const addressRequest = {
      house,
      road,
      block,
      area,
      phoneNumber,
    };

    if (hasAddress) {

      await apiRequest(
        "/api/addresses/me",
        {
          method: "PUT",

          body: JSON.stringify(
            addressRequest
          ),
        }
      );

    } else {

      await apiRequest(
        "/api/addresses/me",
        {
          method: "POST",

          body: JSON.stringify(
            addressRequest
          ),
        }
      );

      setHasAddress(true);
    }
  }

  async function handleCheckout(
    event
  ) {

    event.preventDefault();

    setError("");

    if (
      !cart ||
      !cart.items ||
      cart.items.length === 0
    ) {

      setError(
        "Your cart is empty."
      );

      return;
    }

    setPlacingOrder(true);

    let order = null;

    try {

      await saveAddress();

      order =
        await apiRequest(
          "/api/orders/checkout",
          {
            method: "POST",
          }
        );

      const payment =
        await apiRequest(
          `/api/payments/orders/${order.id}`,
          {
            method: "POST",

            body: JSON.stringify({
              paymentMethod:
                "CASH_ON_DELIVERY",
            }),
          }
        );

      setCompletedOrder(
        order
      );

      setCompletedPayment(
        payment
      );

      setCart({
        ...cart,
        items: [],
        total: 0,
      });

    } catch (error) {

      if (order) {

        setError(
          `Order #${order.id} was created, but the payment could not be created. ${error.message}`
        );

      } else {

        setError(
          error.message
        );
      }

    } finally {

      setPlacingOrder(false);
    }
  }

  if (loading) {

    return (
      <section className="checkout-page">

        <p className="checkout-message">
          Loading checkout...
        </p>

      </section>
    );
  }

  if (completedOrder) {

    return (
      <section className="checkout-page">

        <div className="order-success">

          <h1>
            Order Placed
          </h1>

          <p>
            Your order has been created successfully.
          </p>

          <div className="order-success-details">

            <p>
              <strong>
                Order:
              </strong>{" "}
              #{completedOrder.id}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {completedOrder.status}
            </p>

            <p>
              <strong>
                Total:
              </strong>{" "}
              BHD{" "}
              {Number(
                completedOrder.totalAmount
              ).toFixed(2)}
            </p>

            <p>
              <strong>
                Payment:
              </strong>{" "}
              Cash on Delivery
            </p>

            {completedPayment && (
              <p>
                <strong>
                  Payment Status:
                </strong>{" "}
                {completedPayment.status}
              </p>
            )}

          </div>

          <Link
            className="checkout-continue-button"
            to="/products"
          >
            Continue Shopping
          </Link>

        </div>

      </section>
    );
  }

  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {

    return (
      <section className="checkout-page">

        <div className="checkout-empty">

          <h1>
            Your cart is empty
          </h1>

          <p>
            Add products before checking out.
          </p>

          <Link
            className="checkout-continue-button"
            to="/products"
          >
            Browse Products
          </Link>

        </div>

      </section>
    );
  }

  return (
    <section className="checkout-page">

      <h1 className="page-title">
        Checkout
      </h1>

      <p className="page-description">
        Review your order and delivery information.
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCheckout}
      >

        <div className="checkout-layout">

          <div className="checkout-main">

            <div className="checkout-section">

              <h2>
                Delivery Address
              </h2>

              <div className="checkout-form-grid">

                <div className="form-group">

                  <label htmlFor="house">
                    House
                  </label>

                  <input
                    id="house"
                    type="text"
                    value={house}
                    maxLength="20"
                    onChange={(event) =>
                      setHouse(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="road">
                    Road
                  </label>

                  <input
                    id="road"
                    type="text"
                    value={road}
                    maxLength="20"
                    onChange={(event) =>
                      setRoad(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="block">
                    Block
                  </label>

                  <input
                    id="block"
                    type="text"
                    value={block}
                    maxLength="20"
                    onChange={(event) =>
                      setBlock(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="area">
                    Area
                  </label>

                  <input
                    id="area"
                    type="text"
                    value={area}
                    maxLength="100"
                    onChange={(event) =>
                      setArea(
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="form-group checkout-phone">

                  <label htmlFor="phoneNumber">
                    Phone Number
                  </label>

                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    maxLength="20"
                    placeholder="+97333123456"
                    onChange={(event) =>
                      setPhoneNumber(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

            </div>

            <div className="checkout-section">

              <h2>
                Payment Method
              </h2>

              <div className="payment-option">

                <input
                  id="cashOnDelivery"
                  type="radio"
                  checked
                  readOnly
                />

                <label htmlFor="cashOnDelivery">
                  Cash on Delivery
                </label>

              </div>

            </div>

          </div>

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            <div className="checkout-items">

              {cart.items.map(
                (item) => (

                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    <div>

                      <p className="checkout-item-name">
                        {item.productName}
                      </p>

                      <span>
                        Quantity:{" "}
                        {item.quantity}
                      </span>

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

            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                BHD{" "}
                {Number(
                  cart.total
                ).toFixed(2)}
              </strong>

            </div>

            <button
              className="place-order-button"
              type="submit"
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"
              }
            </button>

            <p className="checkout-payment-note">
              Payment will be collected when your order is delivered.
            </p>

          </div>

        </div>

      </form>

    </section>
  );
}

export default CheckoutPage;