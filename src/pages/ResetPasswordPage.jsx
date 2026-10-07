import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";

import apiRequest from "../services/api.js";

function ResetPasswordPage() {

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  async function handleSubmit(
    event
  ) {

    event.preventDefault();

    setError("");

    if (!token) {

      setError(
        "Password reset token is missing"
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match"
      );

      return;
    }

    setLoading(true);

    try {

      await apiRequest(
        "/api/auth/reset-password",
        {
          method: "POST",
          auth: false,

          body: JSON.stringify({
            token,
            newPassword,
          }),
        }
      );

      navigate(
        "/login",
        {
          state: {
            message:
              "Password reset successfully. You can now login with your new password.",
          },
        }
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  }

  if (!token) {

    return (
      <section className="form-container">

        <h1>Reset Password</h1>

        <div className="error-message">
          Password reset token is missing or invalid.
        </div>

        <p className="form-footer">

          <Link to="/forgot-password">
            Request a new reset link
          </Link>

        </p>

      </section>
    );
  }

  return (
    <section className="form-container">

      <h1>Reset Password</h1>

      <p className="form-description">
        Enter your new password below.
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
      >

        <div className="form-group">

          <label htmlFor="newPassword">
            New Password
          </label>

          <input
            id="newPassword"
            type="password"
            value={newPassword}
            placeholder="Enter new password"
            minLength="8"
            onChange={(event) =>
              setNewPassword(
                event.target.value
              )
            }
            required
          />

        </div>

        <div className="form-group">

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            placeholder="Confirm new password"
            minLength="8"
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            required
          />

        </div>

        <button
          className="form-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Resetting..."
            : "Reset Password"
          }
        </button>

      </form>

    </section>
  );
}

export default ResetPasswordPage;