import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import apiRequest from "../services/api.js";

import "../styles/pages/CartPage.css";

function CartPage() {

  const [cart, setCart] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [updatingItemId, setUpdatingItemId] =
    useState(null);

  const [clearing, setClearing] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    loadCart();

  }, []);

  async function loadCart() {

    setLoading(true);
    setError("");

    try {

      const response =
        await apiRequest(
          "/api/cart",
          {
            method: "GET",
          }
        );

      setCart(response);

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  }

  async function updateQuantity(
    cartItemId,
    quantity
  ) {

    if (quantity < 1) {
      return;
    }

    setUpdatingItemId(
      cartItemId
    );

    setError("");

    try {

      const response =
        await apiRequest(
          `/api/cart/items/${cartItemId}`,
          {
            method: "PATCH",

            body: JSON.stringify({
              quantity,
            }),
          }
        );

      setCart(response);

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setUpdatingItemId(null);
    }
  }

  async function removeItem(
    cartItemId
  ) {

    setUpdatingItemId(
      cartItemId
    );

    setError("");

    try {

      const response =
        await apiRequest(
          `/api/cart/items/${cartItemId}`,
          {
            method: "DELETE",
          }
        );

      setCart(response);

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setUpdatingItemId(null);
    }
  }

  async function clearCart() {

    setClearing(true);
    setError("");

    try {

      await apiRequest(
        "/api/cart",
        {
          method: "DELETE",
        }
      );

      await loadCart();

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setClearing(false);
    }
  }

  if (loading) {

    return (
      <section className="cart-page">

        <p className="cart-message">
          Loading cart...
        </p>

      </section>
    );
  }

  return (
    <section className="cart-page">

      <div className="cart-header">

        <div>

          <h1 className="page-title">
            Cart
          </h1>

          <p className="page-description">
            Review the products in your cart.
          </p>

        </div>

        {cart?.items?.length > 0 && (

          <button
            className="clear-cart-button"
            onClick={clearCart}
            disabled={clearing}
          >
            {clearing
              ? "Clearing..."
              : "Clear Cart"
            }
          </button>

        )}

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!cart ||
      !cart.items ||
      cart.items.length === 0 ? (

        <div className="empty-cart">

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some products before continuing.
          </p>

          <Link
            className="continue-shopping-button"
            to="/products"
          >
            Browse Products
          </Link>

        </div>

      ) : (

        <>

          <div className="cart-items">

            {cart.items.map(
              (item) => (

                <article
                  className="cart-item"
                  key={item.id}
                >

                  <div className="cart-item-image-container">

                    {item.primaryImageUrl ? (

                      <img
                        className="cart-item-image"
                        src={item.primaryImageUrl}
                        alt={item.productName}
                      />

                    ) : (

                      <div className="cart-item-image-placeholder">
                        No Image
                      </div>

                    )}

                  </div>

                  <div className="cart-item-details">

                    <Link
                      className="cart-item-name"
                      to={`/products/${item.productId}`}
                    >
                      {item.productName}
                    </Link>

                    <p className="cart-item-price">
                      BHD{" "}
                      {Number(
                        item.price
                      ).toFixed(2)}
                    </p>

                  </div>

                  <div className="cart-item-quantity">

                    <button
                      className="quantity-button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      disabled={
                        item.quantity <= 1 ||
                        updatingItemId === item.id
                      }
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      className="quantity-button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      disabled={
                        updatingItemId === item.id
                      }
                    >
                      +
                    </button>

                  </div>

                  <div className="cart-item-subtotal">

                    <span>
                      BHD{" "}
                      {Number(
                        item.subtotal
                      ).toFixed(2)}
                    </span>

                  </div>

                  <button
                    className="remove-item-button"
                    onClick={() =>
                      removeItem(
                        item.id
                      )
                    }
                    disabled={
                      updatingItemId === item.id
                    }
                  >
                    Remove
                  </button>

                </article>

              )
            )}

          </div>

          <div className="cart-summary">

            <div className="cart-total">

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

            <Link
              className="checkout-button"
              to="/checkout"
            >
              Proceed to Checkout
            </Link>

          </div>

        </>
      )}

    </section>
  );
}

export default CartPage;