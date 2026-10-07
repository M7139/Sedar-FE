import {
  useEffect,
  useState,
} from "react";

import apiRequest from "../services/api.js";

import "../styles/pages/AdminCategoriesPage.css";

function AdminCategoriesPage() {

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [categoryToDelete, setCategoryToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [error, setError] =
    useState("");

  const [deleteError, setDeleteError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    loadCategories();

  }, []);

  async function loadCategories() {

    setLoading(true);
    setError("");

    try {

      const response =
        await apiRequest(
          "/api/categories",
          {
            method: "GET",
            auth: false,
          }
        );

      setCategories(
        response
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

    setEditingCategory(
      null
    );

    setName("");
    setDescription("");
  }

  function startEditing(
    category
  ) {

    setEditingCategory(
      category
    );

    setName(
      category.name
    );

    setDescription(
      category.description || ""
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
      };

      if (editingCategory) {

        const response =
          await apiRequest(
            `/api/categories/${editingCategory.id}`,
            {
              method: "PUT",

              body: JSON.stringify(
                requestBody
              ),
            }
          );

        setCategories(
          categories.map(
            (category) =>
              category.id === response.id
                ? response
                : category
          )
        );

        setMessage(
          "Category updated successfully."
        );

      } else {

        const response =
          await apiRequest(
            "/api/categories",
            {
              method: "POST",

              body: JSON.stringify(
                requestBody
              ),
            }
          );

        setCategories(
          [
            ...categories,
            response,
          ]
        );

        setMessage(
          "Category created successfully."
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

  function openDeleteModal(
    category
  ) {

    setCategoryToDelete(
      category
    );

    setDeleteError("");
  }

  function closeDeleteModal() {

    if (deleting) {
      return;
    }

    setCategoryToDelete(
      null
    );

    setDeleteError("");
  }

  async function handleDeleteCategory() {

    if (!categoryToDelete) {
      return;
    }

    setDeleting(true);
    setDeleteError("");
    setMessage("");

    try {

      await apiRequest(
        `/api/categories/${categoryToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      setCategories(
        categories.filter(
          (category) =>
            category.id !==
            categoryToDelete.id
        )
      );

      if (
        editingCategory?.id ===
        categoryToDelete.id
      ) {

        resetForm();
      }

      setCategoryToDelete(
        null
      );

      setMessage(
        "Category deleted successfully."
      );

    } catch (error) {

      setDeleteError(
        error.message
      );

    } finally {

      setDeleting(false);
    }
  }

  if (loading) {

    return (
      <section className="admin-categories-page">

        <p className="admin-categories-message">
          Loading categories...
        </p>

      </section>
    );
  }

  return (
    <section className="admin-categories-page">

      <div className="admin-categories-header">

        <h1 className="page-title">
          Category Management
        </h1>

        <p className="page-description">
          Create and manage product categories.
        </p>

      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <section className="admin-category-form-section">

        <h2>
          {editingCategory
            ? "Edit Category"
            : "Add Category"
          }
        </h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="categoryName">
              Category Name
            </label>

            <input
              id="categoryName"
              type="text"
              value={name}
              maxLength="100"
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="categoryDescription">
              Description
            </label>

            <textarea
              id="categoryDescription"
              className="admin-category-description"
              value={description}
              maxLength="500"
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
            />

            <span className="admin-category-character-count">
              {description.length}/500
            </span>

          </div>

          <div className="admin-category-form-actions">

            <button
              className="admin-category-save-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Create Category"
              }
            </button>

            {editingCategory && (

              <button
                className="admin-category-cancel-button"
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>

            )}

          </div>

        </form>

      </section>

      <section className="admin-category-list-section">

        <div className="admin-category-list-header">

          <h2>
            Categories
          </h2>

          <span>
            {categories.length}{" "}
            {categories.length === 1
              ? "category"
              : "categories"
            }
          </span>

        </div>

        {categories.length === 0 ? (

          <p className="admin-categories-empty">
            No categories found.
          </p>

        ) : (

          <div className="admin-category-table-container">

            <table className="admin-category-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Description
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

                {categories.map(
                  (category) => (

                    <tr key={category.id}>

                      <td>
                        #{category.id}
                      </td>

                      <td>
                        <strong>
                          {category.name}
                        </strong>
                      </td>

                      <td className="admin-category-table-description">
                        {category.description || "—"}
                      </td>

                      <td>

                        <span
                          className={
                            category.active
                              ? "admin-category-status active"
                              : "admin-category-status inactive"
                          }
                        >
                          {category.active
                            ? "Active"
                            : "Inactive"
                          }
                        </span>

                      </td>

                      <td>

                        <div className="admin-category-actions">

                          <button
                            onClick={() =>
                              startEditing(
                                category
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="admin-category-delete-button"
                            onClick={() =>
                              openDeleteModal(
                                category
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

      {categoryToDelete && (

        <div className="admin-category-modal-overlay">

          <div className="admin-category-modal">

            <h2>
              Delete Category
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {categoryToDelete.name}
              </strong>
              ?
            </p>

            <p className="admin-category-modal-description">
              Categories containing products cannot be deleted.
            </p>

            {deleteError && (
              <div className="error-message">
                {deleteError}
              </div>
            )}

            <div className="admin-category-modal-actions">

              <button
                className="admin-category-modal-back"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Keep Category
              </button>

              <button
                className="admin-category-modal-confirm"
                onClick={
                  handleDeleteCategory
                }
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Category"
                }
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default AdminCategoriesPage;