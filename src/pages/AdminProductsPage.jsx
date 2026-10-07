import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import apiRequest from "../services/api.js";

import "../styles/pages/AdminProductsPage.css";

function AdminProductsPage() {

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [deleteProduct, setDeleteProduct] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [
    stockQuantity,
    setStockQuantity,
  ] = useState("");

  const [categoryId, setCategoryId] =
    useState("");

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    setLoading(true);
    setError("");

    try {

      const [
        productResponse,
        categoryResponse,
      ] = await Promise.all([
        apiRequest(
          "/api/products/admin",
          {
            method: "GET",
          }
        ),

        apiRequest(
          "/api/categories",
          {
            method: "GET",
            auth: false,
          }
        ),
      ]);

      setProducts(
        productResponse
      );

      setCategories(
        categoryResponse
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  }

  function resetForm() {

    setEditingProduct(null);

    setName("");
    setDescription("");
    setPrice("");
    setStockQuantity("");
    setCategoryId("");
  }

  function startEditing(
    product
  ) {

    setEditingProduct(
      product
    );

    setName(
      product.name
    );

    setDescription(
      product.description || ""
    );

    setPrice(
      product.price
    );

    setStockQuantity(
      product.stockQuantity
    );

    setCategoryId(
      product.categoryId
    );

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event
  ) {

    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {

      const requestBody = {
        name,
        description,
        price: Number(price),
        stockQuantity:
          Number(stockQuantity),
        categoryId:
          Number(categoryId),
      };

      if (editingProduct) {

        const response =
          await apiRequest(
            `/api/products/${editingProduct.id}`,
            {
              method: "PUT",

              body: JSON.stringify(
                requestBody
              ),
            }
          );

        setProducts(
          products.map(
            (product) =>
              product.id === response.id
                ? response
                : product
          )
        );

        setMessage(
          "Product updated successfully."
        );

      } else {

        const response =
          await apiRequest(
            "/api/products",
            {
              method: "POST",

              body: JSON.stringify(
                requestBody
              ),
            }
          );

        setProducts(
          [
            ...products,
            response,
          ]
        );

        setMessage(
          "Product created successfully."
        );
      }

      resetForm();

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setSaving(false);
    }
  }

  async function handleStatusChange(
    product
  ) {

    setError("");
    setMessage("");

    try {

      const response =
        await apiRequest(
          `/api/products/${product.id}/status?active=${!product.active}`,
          {
            method: "PATCH",
          }
        );

      setProducts(
        products.map(
          (currentProduct) =>
            currentProduct.id ===
            response.id
              ? response
              : currentProduct
        )
      );

      setMessage(
        response.active
          ? "Product activated successfully."
          : "Product deactivated successfully."
      );

    } catch (error) {

      setError(
        error.message
      );
    }
  }

  async function handleDeleteProduct() {

    if (!deleteProduct) {
      return;
    }

    setDeleting(true);
    setError("");
    setMessage("");

    try {

      await apiRequest(
        `/api/products/${deleteProduct.id}`,
        {
          method: "DELETE",
        }
      );

      setProducts(
        products.filter(
          (product) =>
            product.id !==
            deleteProduct.id
        )
      );

      if (
        editingProduct?.id ===
        deleteProduct.id
      ) {

        resetForm();
      }

      setDeleteProduct(null);

      setMessage(
        "Product deleted successfully."
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setDeleting(false);
    }
  }

  if (loading) {

    return (
      <section className="admin-products-page">

        <p className="admin-products-message">
          Loading products...
        </p>

      </section>
    );
  }

  return (
    <section className="admin-products-page">

      <div className="admin-products-header">

        <h1 className="page-title">
          Product Management
        </h1>

        <p className="page-description">
          Create and manage store products.
        </p>

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

      <section className="admin-product-form-section">

        <h2>
          {editingProduct
            ? "Edit Product"
            : "Add Product"
          }
        </h2>

        <form
          onSubmit={handleSubmit}
        >

          <div className="admin-product-form-grid">

            <div className="form-group">

              <label htmlFor="productName">
                Product Name
              </label>

              <input
                id="productName"
                type="text"
                value={name}
                maxLength="150"
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(
                    event.target.value
                  )
                }
                required
              >

                <option value="">
                  Select category
                </option>

                {categories.map(
                  (category) => (

                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>

                  )
                )}

              </select>

            </div>

            <div className="form-group">

              <label htmlFor="price">
                Price
              </label>

              <input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(event) =>
                  setPrice(
                    event.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="stockQuantity">
                Stock Quantity
              </label>

              <input
                id="stockQuantity"
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(event) =>
                  setStockQuantity(
                    event.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group admin-product-description">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                value={description}
                maxLength="1000"
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="admin-product-form-actions">

            <button
              className="admin-product-save-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Create Product"
              }
            </button>

            {editingProduct && (

              <button
                className="admin-product-cancel-button"
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>

            )}

          </div>

        </form>

      </section>

      <section className="admin-product-list-section">

        <h2>
          Products
        </h2>

        {products.length === 0 ? (

          <p>
            No products found.
          </p>

        ) : (

          <div className="admin-product-table-container">

            <table className="admin-product-table">

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.map(
                  (product) => (

                    <tr key={product.id}>

                      <td>

                        <div className="admin-product-name-cell">

                          {product.primaryImageUrl ? (

                            <img
                              src={
                                product.primaryImageUrl
                              }
                              alt={
                                product.name
                              }
                            />

                          ) : (

                            <div className="admin-product-image-placeholder">
                              No Image
                            </div>

                          )}

                          <span>
                            {product.name}
                          </span>

                        </div>

                      </td>

                      <td>
                        {product.categoryName}
                      </td>

                      <td>
                        BHD{" "}
                        {Number(
                          product.price
                        ).toFixed(2)}
                      </td>

                      <td>
                        {product.stockQuantity}
                      </td>

                      <td>

                        <span
                          className={
                            product.active
                              ? "admin-status active"
                              : "admin-status inactive"
                          }
                        >
                          {product.active
                            ? "Active"
                            : "Inactive"
                          }
                        </span>

                      </td>

                      <td>

                        <div className="admin-product-actions">

                          <button
                            onClick={() =>
                              startEditing(
                                product
                              )
                            }
                          >
                            Edit
                          </button>

                          <Link
                            className="admin-manage-images-button"
                            to={`/admin/products/${product.id}/images`}
                          >
                            Images
                          </Link>

                          <button
                            onClick={() =>
                              handleStatusChange(
                                product
                              )
                            }
                          >
                            {product.active
                              ? "Deactivate"
                              : "Activate"
                            }
                          </button>

                          <button
                            className="admin-delete-button"
                            onClick={() =>
                              setDeleteProduct(
                                product
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {deleteProduct && (

        <div className="admin-product-modal-overlay">

          <div className="admin-product-modal">

            <h2>
              Delete Product
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deleteProduct.name}
              </strong>
              ?
            </p>

            <p className="admin-product-modal-description">
              Products already used in carts, orders or reviews may need to be deactivated instead.
            </p>

            <div className="admin-product-modal-actions">

              <button
                onClick={() =>
                  setDeleteProduct(
                    null
                  )
                }
                disabled={deleting}
              >
                Keep Product
              </button>

              <button
                className="admin-delete-confirm-button"
                onClick={
                  handleDeleteProduct
                }
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Product"
                }
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default AdminProductsPage;