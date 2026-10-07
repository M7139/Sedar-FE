import {
  Link,
} from "react-router";

import "./ProductCard.css";

function ProductCard({
  product,
}) {

  return (
    <article className="product-card">

      <Link
        to={`/products/${product.id}`}
        className="product-card-link"
      >

        <div className="product-image-container">

          {product.primaryImageUrl ? (

            <img
              className="product-image"
              src={product.primaryImageUrl}
              alt={product.name}
            />

          ) : (

            <div className="product-image-placeholder">
              No Image
            </div>

          )}

        </div>

        <div className="product-card-content">

          <p className="product-category">
            {product.categoryName}
          </p>

          <h2 className="product-name">
            {product.name}
          </h2>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-card-bottom">

            <span className="product-price">
              BHD{" "}
              {Number(
                product.price
              ).toFixed(2)}
            </span>

            {product.stockQuantity > 0 ? (

              <span className="product-stock">
                In Stock
              </span>

            ) : (

              <span className="product-stock out-of-stock">
                Out of Stock
              </span>

            )}

          </div>

        </div>

      </Link>

    </article>
  );
}

export default ProductCard;