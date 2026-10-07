import {
  useState,
} from "react";

import {
  Link,
} from "react-router";

import apiRequest from "../services/api.js";

function ResendVerificationPage() {

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event
  ) {

    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {

      const response =
        await apiRequest(
          "/api/auth/resend-verification",
          {
            method: "POST",
            auth: false,

            body: JSON.stringify({
              email,
            }),
          }
        );

      setMessage(response);

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <section className="form-container">

      <h1>Resend Verification</h1>

      <p className="form-description">
        Enter your email to request another verification link.
      </p>

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

      <form
        onSubmit={handleSubmit}
      >

        <div className="form-group">

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(event) =>
              setEmail(
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
            ? "Sending..."
            : "Resend Verification Email"
          }
        </button>

      </form>

      <p className="form-footer">

        <Link to="/login">
          Back to Login
        </Link>

      </p>

    </section>
  );
}

export default ResendVerificationPage;