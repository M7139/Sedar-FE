import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import apiRequest from "../services/api.js";

import "../styles/pages/AdminProductImagesPage.css";

function AdminProductImagesPage() {

  const { id } =
    useParams();

  const [product, setProduct] =
    useState(null);

  const [images, setImages] =
    useState([]);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [primaryImage, setPrimaryImage] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [updatingImageId, setUpdatingImageId] =
    useState(null);

  const [imageToDelete, setImageToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    loadPage();

  }, [id]);

  async function loadPage() {

    setLoading(true);
    setError("");

    try {

      const [
        productResponse,
        imageResponse,
      ] = await Promise.all([
        apiRequest(
          `/api/products/admin/${id}`,
          {
            method: "GET",
          }
        ),

        apiRequest(
          `/api/product-images/admin/product/${id}`,
          {
            method: "GET",
          }
        ),
      ]);

      setProduct(
        productResponse
      );

      setImages(
        imageResponse
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  }

  async function loadImages() {

    const response =
      await apiRequest(
        `/api/product-images/admin/product/${id}`,
        {
          method: "GET",
        }
      );

    setImages(
      response
    );
  }

  function handleFileChange(
    event
  ) {

    const file =
      event.target.files[0];

    setSelectedFile(
      file || null
    );
  }

  async function handleUpload(
    event
  ) {

    event.preventDefault();

    if (!selectedFile) {

      setError(
        "Select an image first."
      );

      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      formData.append(
        "productId",
        id
      );

      formData.append(
        "primaryImage",
        primaryImage
      );

      await apiRequest(
        "/api/product-images/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      await loadImages();

      setSelectedFile(null);
      setPrimaryImage(false);

      const fileInput =
        document.getElementById(
          "productImage"
        );

      if (fileInput) {

        fileInput.value = "";
      }

      setMessage(
        "Product image uploaded successfully."
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setUploading(false);
    }
  }

  async function handleSetPrimary(
    imageId
  ) {

    setUpdatingImageId(
      imageId
    );

    setError("");
    setMessage("");

    try {

      await apiRequest(
        `/api/product-images/${imageId}/primary`,
        {
          method: "PATCH",
        }
      );

      await loadImages();

      setMessage(
        "Primary image updated successfully."
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setUpdatingImageId(
        null
      );
    }
  }

  async function handleDeleteImage() {

    if (!imageToDelete) {
      return;
    }

    setDeleting(true);
    setError("");
    setMessage("");

    try {

      await apiRequest(
        `/api/product-images/${imageToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      await loadImages();

      setImageToDelete(
        null
      );

      setMessage(
        "Product image deleted successfully."
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
      <section className="admin-product-images-page">

        <p className="admin-product-images-message">
          Loading product images...
        </p>

      </section>
    );
  }

  if (!product) {

    return (
      <section className="admin-product-images-page">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <Link
          to="/admin/products"
          className="admin-images-back-link"
        >
          ← Back to Products
        </Link>

      </section>
    );
  }

  return (
    <section className="admin-product-images-page">

      <Link
        to="/admin/products"
        className="admin-images-back-link"
      >
        ← Back to Products
      </Link>

      <div className="admin-product-images-header">

        <div>

          <h1 className="page-title">
            Product Images
          </h1>

          <p className="page-description">
            Manage images for {product.name}.
          </p>

        </div>

        <span
          className={
            product.active
              ? "admin-image-product-status active"
              : "admin-image-product-status inactive"
          }
        >
          {product.active
            ? "Active"
            : "Inactive"
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

      <section className="admin-image-upload-section">

        <h2>
          Upload Image
        </h2>

        <form
          onSubmit={handleUpload}
        >

          <div className="admin-image-upload-form">

            <div className="form-group">

              <label htmlFor="productImage">
                Image
              </label>

              <input
                id="productImage"
                type="file"
                accept="image/png,image/jpeg"
                onChange={
                  handleFileChange
                }
                required
              />

            </div>

            <label className="admin-primary-checkbox">

              <input
                type="checkbox"
                checked={primaryImage}
                onChange={(event) =>
                  setPrimaryImage(
                    event.target.checked
                  )
                }
              />

              Make this the primary image

            </label>

            <button
              className="admin-image-upload-button"
              type="submit"
              disabled={
                uploading ||
                !selectedFile
              }
            >
              {uploading
                ? "Uploading..."
                : "Upload Image"
              }
            </button>

          </div>

        </form>

        <p className="admin-image-help">
          JPG and PNG images are supported. Maximum file size is 5 MB.
        </p>

      </section>

      <section className="admin-images-section">

        <div className="admin-images-section-header">

          <h2>
            Images
          </h2>

          <span>
            {images.length}{" "}
            {images.length === 1
              ? "image"
              : "images"
            }
          </span>

        </div>

        {images.length === 0 ? (

          <div className="admin-images-empty">

            <p>
              This product has no images yet.
            </p>

          </div>

        ) : (

          <div className="admin-images-grid">

            {images.map(
              (image) => (

                <article
                  className="admin-image-card"
                  key={image.id}
                >

                  <div className="admin-image-preview">

                    <img
                      src={image.imageUrl}
                      alt={product.name}
                    />

                    {image.primaryImage && (

                      <span className="admin-primary-badge">
                        Primary
                      </span>

                    )}

                  </div>

                  <div className="admin-image-card-actions">

                    {!image.primaryImage && (

                      <button
                        className="admin-set-primary-button"
                        onClick={() =>
                          handleSetPrimary(
                            image.id
                          )
                        }
                        disabled={
                          updatingImageId ===
                          image.id
                        }
                      >
                        {updatingImageId ===
                        image.id
                          ? "Updating..."
                          : "Set Primary"
                        }
                      </button>

                    )}

                    <button
                      className="admin-image-delete-button"
                      onClick={() =>
                        setImageToDelete(
                          image
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

      {imageToDelete && (

        <div className="admin-image-modal-overlay">

          <div className="admin-image-modal">

            <h2>
              Delete Image
            </h2>

            <p>
              Are you sure you want to delete this image?
            </p>

            {imageToDelete.primaryImage && (

              <p className="admin-image-modal-warning">
                This is currently the product's primary image.
                Another image will become primary if one is available.
              </p>

            )}

            <div className="admin-image-modal-actions">

              <button
                className="admin-image-modal-back"
                onClick={() =>
                  setImageToDelete(
                    null
                  )
                }
                disabled={deleting}
              >
                Keep Image
              </button>

              <button
                className="admin-image-modal-confirm"
                onClick={
                  handleDeleteImage
                }
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Image"
                }
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default AdminProductImagesPage;