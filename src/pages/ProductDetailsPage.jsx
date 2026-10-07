import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import apiRequest from "../services/api.js";
import useAuth from "../hooks/useAuth.js";

import "../styles/pages/ProductDetailsPage.css";

function ProductDetailsPage() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [product, setProduct] =
    useState(null);

  const [quantity, setQuantity] =
    useState(1);

  const [reviews, setReviews] =
    useState([]);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [adding, setAdding] =
    useState(false);

  const [savingReview, setSavingReview] =
    useState(false);

  const [reviewToDelete, setReviewToDelete] =
    useState(null);

  const [deletingReview, setDeletingReview] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [reviewError, setReviewError] =
    useState("");

  const [reviewMessage, setReviewMessage] =
    useState("");

  const ownReview =
    reviews.find(
      (review) =>
        review.userId === user?.id
    );

  useEffect(() => {

    async function loadProduct() {

      setLoading(true);
      setError("");

      try {

        const [
          productResponse,
          reviewsResponse,
        ] =
          await Promise.all([
            apiRequest(
              `/api/products/${id}`,
              {
                method: "GET",
                auth: false,
              }
            ),

            apiRequest(
              `/api/reviews/product/${id}`,
              {
                method: "GET",
                auth: false,
              }
            ),
          ]);

        setProduct(
          productResponse
        );

        setReviews(
          reviewsResponse
        );

      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);
      }
    }

    loadProduct();

  }, [id]);

  useEffect(() => {

    const review =
      reviews.find(
        (review) =>
          review.userId === user?.id
      );

    if (review) {

      setRating(
        review.rating
      );

      setComment(
        review.comment || ""
      );

    } else {

      setRating(5);
      setComment("");
    }

  }, [
    reviews,
    user?.id,
  ]);

  function handleQuantityChange(
    event
  ) {

    setQuantity(
      Number(
        event.target.value
      )
    );
  }

  async function handleAddToCart() {

    setError("");
    setMessage("");

    if (!isAuthenticated) {

      navigate(
        "/login",
        {
          state: {
            message:
              "Please login before adding products to your cart.",
          },
        }
      );

      return;
    }

    setAdding(true);

    try {

      await apiRequest(
        "/api/cart/items",
        {
          method: "POST",

          body: JSON.stringify({
            productId:
              product.id,

            quantity,
          }),
        }
      );

      setMessage(
        "Product added to cart."
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setAdding(false);
    }
  }

  async function handleReviewSubmit(
    event
  ) {

    event.preventDefault();

    setReviewError("");
    setReviewMessage("");

    if (!isAuthenticated) {

      navigate(
        "/login",
        {
          state: {
            message:
              "Please login before writing a review.",
          },
        }
      );

      return;
    }

    setSavingReview(true);

    try {

      const requestBody = {
        rating,
        comment,
      };

      if (ownReview) {

        const response =
          await apiRequest(
            `/api/reviews/${ownReview.id}`,
            {
              method: "PUT",

              body: JSON.stringify(
                requestBody
              ),
            }
          );

        setReviews(
          reviews.map(
            (review) =>
              review.id === response.id
                ? response
                : review
          )
        );

        setReviewMessage(
          "Review updated successfully."
        );

      } else {

        const response =
          await apiRequest(
            `/api/reviews/product/${product.id}`,
            {
              method: "POST",

              body: JSON.stringify(
                requestBody
              ),
            }
          );

        setReviews(
          [
            response,
            ...reviews,
          ]
        );

        setReviewMessage(
          "Review submitted successfully."
        );
      }

    } catch (error) {

      setReviewError(
        error.message
      );

    } finally {

      setSavingReview(false);
    }
  }

  async function handleDeleteReview() {

    if (!reviewToDelete) {
      return;
    }

    setDeletingReview(true);
    setReviewError("");
    setReviewMessage("");

    try {

      await apiRequest(
        `/api/reviews/${reviewToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      setReviews(
        reviews.filter(
          (review) =>
            review.id !==
            reviewToDelete.id
        )
      );

      setRating(5);
      setComment("");

      setReviewToDelete(
        null
      );

      setReviewMessage(
        "Review deleted successfully."
      );

    } catch (error) {

      setReviewError(
        error.message
      );

    } finally {

      setDeletingReview(false);
    }
  }

  function getAverageRating() {

    if (reviews.length === 0) {
      return 0;
    }

    const total =
      reviews.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      );

    return (
      total / reviews.length
    ).toFixed(1);
  }

  function formatDate(
    date
  ) {

    return new Date(
      date
    ).toLocaleDateString();
  }

  if (loading) {

    return (
      <section className="product-details-page">

        <p className="product-details-message">
          Loading product...
        </p>

      </section>
    );
  }

  if (error && !product) {

    return (
      <section className="product-details-page">

        <div className="error-message">
          {error}
        </div>

        <Link
          className="back-link"
          to="/products"
        >
          Back to Products
        </Link>

      </section>
    );
  }

  return (
    <section className="product-details-page">

      <Link
        className="back-link"
        to="/products"
      >
        ← Back to Products
      </Link>

      <div className="product-details-container">

        <div className="product-details-image-container">

          {product.primaryImageUrl ? (

            <img
              className="product-details-image"
              src={product.primaryImageUrl}
              alt={product.name}
            />

          ) : (

            <div className="product-details-placeholder">
              No Image
            </div>

          )}

        </div>

        <div className="product-details-content">

          <p className="product-details-category">
            {product.categoryName}
          </p>

          <h1>
            {product.name}
          </h1>

          {reviews.length > 0 && (

            <p className="product-rating-summary">
              ★ {getAverageRating()}
              {" "}
              ({reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"
              })
            </p>

          )}

          <p className="product-details-description">
            {product.description}
          </p>

          <p className="product-details-price">
            BHD{" "}
            {Number(
              product.price
            ).toFixed(2)}
          </p>

          {product.stockQuantity > 0 ? (

            <p className="product-details-stock">
              In Stock:{" "}
              {product.stockQuantity}
            </p>

          ) : (

            <p className="product-details-stock out-of-stock">
              Out of Stock
            </p>

          )}

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

          {product.stockQuantity > 0 && (

            <div className="add-to-cart-section">

              <div className="quantity-group">

                <label htmlFor="quantity">
                  Quantity
                </label>

                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={
                    product.stockQuantity
                  }
                  value={quantity}
                  onChange={
                    handleQuantityChange
                  }
                />

              </div>

              <button
                className="add-to-cart-button"
                onClick={
                  handleAddToCart
                }
                disabled={adding}
              >
                {adding
                  ? "Adding..."
                  : "Add to Cart"
                }
              </button>

            </div>
          )}

        </div>

      </div>

      <section className="reviews-section">

        <div className="reviews-heading">

          <div>

            <h2>
              Customer Reviews
            </h2>

            {reviews.length > 0 && (

              <p>
                ★ {getAverageRating()} out of 5
              </p>

            )}

          </div>

          <span>
            {reviews.length}{" "}
            {reviews.length === 1
              ? "review"
              : "reviews"
            }
          </span>

        </div>

        {isAuthenticated ? (

          <div className="review-form-container">

            <h3>
              {ownReview
                ? "Your Review"
                : "Write a Review"
              }
            </h3>

            <p className="review-help">
              You can review products after they have been delivered to you.
            </p>

            {reviewMessage && (
              <div className="success-message">
                {reviewMessage}
              </div>
            )}

            {reviewError && (
              <div className="error-message">
                {reviewError}
              </div>
            )}

            <form
              onSubmit={
                handleReviewSubmit
              }
            >

              <div className="review-rating-field">

                <label>
                  Rating
                </label>

                <div className="review-stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                      <button
                        key={star}
                        type="button"
                        className={
                          star <= rating
                            ? "review-star selected"
                            : "review-star"
                        }
                        onClick={() =>
                          setRating(star)
                        }
                        aria-label={
                          `${star} star rating`
                        }
                      >
                        ★
                      </button>

                    )
                  )}

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="reviewComment">
                  Comment
                </label>

                <textarea
                  id="reviewComment"
                  className="review-comment"
                  value={comment}
                  maxLength="1000"
                  placeholder="Tell us what you thought about the product..."
                  onChange={(event) =>
                    setComment(
                      event.target.value
                    )
                  }
                />

                <span className="review-character-count">
                  {comment.length}/1000
                </span>

              </div>

              <div className="review-form-actions">

                <button
                  className="review-submit-button"
                  type="submit"
                  disabled={savingReview}
                >
                  {savingReview
                    ? "Saving..."
                    : ownReview
                      ? "Update Review"
                      : "Submit Review"
                  }
                </button>

                {ownReview && (

                  <button
                    className="review-delete-button"
                    type="button"
                    onClick={() =>
                      setReviewToDelete(
                        ownReview
                      )
                    }
                  >
                    Delete Review
                  </button>

                )}

              </div>

            </form>

          </div>

        ) : (

          <div className="review-login-message">

            <p>
              Login to write a review.
            </p>

            <Link
              to="/login"
              className="review-login-link"
            >
              Login
            </Link>

          </div>

        )}

        {reviews.length === 0 ? (

          <div className="reviews-empty">

            <p>
              No reviews yet.
            </p>

            <span>
              Be the first customer to review this product.
            </span>

          </div>

        ) : (

          <div className="reviews-list">

            {reviews.map(
              (review) => (

                <article
                  className="review-card"
                  key={review.id}
                >

                  <div className="review-card-header">

                    <div>

                      <strong>
                        {review.userName}
                      </strong>

                      <div className="review-display-stars">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (

                            <span
                              key={star}
                              className={
                                star <= review.rating
                                  ? "display-star selected"
                                  : "display-star"
                              }
                            >
                              ★
                            </span>

                          )
                        )}

                      </div>

                    </div>

                    <span className="review-date">
                      {formatDate(
                        review.createdAt
                      )}
                    </span>

                  </div>

                  {review.comment && (

                    <p className="review-card-comment">
                      {review.comment}
                    </p>

                  )}

                  {review.userId === user?.id && (

                    <span className="your-review-label">
                      Your review
                    </span>

                  )}

                </article>

              )
            )}

          </div>

        )}

      </section>

      {reviewToDelete && (

        <div className="review-modal-overlay">

          <div className="review-modal">

            <h2>
              Delete Review
            </h2>

            <p>
              Are you sure you want to delete your review?
            </p>

            <p className="review-modal-description">
              You can submit another review later if you are still eligible.
            </p>

            <div className="review-modal-actions">

              <button
                className="review-modal-back"
                onClick={() =>
                  setReviewToDelete(
                    null
                  )
                }
                disabled={
                  deletingReview
                }
              >
                Keep Review
              </button>

              <button
                className="review-modal-confirm"
                onClick={
                  handleDeleteReview
                }
                disabled={
                  deletingReview
                }
              >
                {deletingReview
                  ? "Deleting..."
                  : "Delete Review"
                }
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default ProductDetailsPage;