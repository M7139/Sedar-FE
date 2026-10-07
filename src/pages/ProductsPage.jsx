import {
  useEffect,
  useState,
} from "react";

import apiRequest from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";

import "../styles/pages/ProductsPage.css";

function ProductsPage() {

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function loadProducts() {

      setLoading(true);
      setError("");

      try {

        const params =
          new URLSearchParams();

        params.set(
          "page",
          page
        );

        params.set(
          "size",
          8
        );

        params.set(
          "sort",
          "name,asc"
        );

        if (search.trim()) {

          params.set(
            "search",
            search.trim()
          );
        }

        const response =
          await apiRequest(
            `/api/products?${params.toString()}`,
            {
              method: "GET",
              auth: false,
            }
          );

        setProducts(
          response.content
        );

        setTotalPages(
          response.totalPages
        );

      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);
      }
    }

    loadProducts();

  }, [page, search]);

  function handleSearchChange(
    event
  ) {

    setSearch(
      event.target.value
    );

    setPage(0);
  }

  function handlePreviousPage() {

    if (page > 0) {

      setPage(
        page - 1
      );
    }
  }

  function handleNextPage() {

    if (
      page < totalPages - 1
    ) {

      setPage(
        page + 1
      );
    }
  }

  return (
    <section className="products-page">

      <div className="products-header">

        <div>

          <h1 className="page-title">
            Products
          </h1>

          <p className="page-description">
            Browse our collection of products.
          </p>

        </div>

        <input
          className="product-search"
          type="search"
          value={search}
          placeholder="Search products..."
          onChange={handleSearchChange}
        />

      </div>

      {loading && (
        <p className="products-message">
          Loading products...
        </p>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        products.length === 0 && (
          <p className="products-message">
            No products found.
          </p>
        )}

      {!loading &&
        !error &&
        products.length > 0 && (
          <>

            <div className="products-grid">

              {products.map(
                (product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                )
              )}

            </div>

            <div className="pagination">

              <button
                className="pagination-button"
                onClick={handlePreviousPage}
                disabled={page === 0}
              >
                Previous
              </button>

              <span className="pagination-info">
                Page {page + 1} of {totalPages}
              </span>

              <button
                className="pagination-button"
                onClick={handleNextPage}
                disabled={
                  page >= totalPages - 1
                }
              >
                Next
              </button>

            </div>

          </>
        )}

    </section>
  );
}

export default ProductsPage;