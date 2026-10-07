import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import apiRequest from "../services/api.js";

function RegisterPage() {

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
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
    setLoading(true);

    try {

      await apiRequest(
        "/api/auth/register",
        {
          method: "POST",
          auth: false,

          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
          }),
        }
      );

      navigate(
        "/login",
        {
          state: {
            message:
              "Account created. Check your email to verify your account before logging in.",
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

  return (
    <section className="form-container">

      <h1>Create Account</h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
      >

        <div className="form-group">

          <label htmlFor="firstName">
            First Name
          </label>

          <input
            id="firstName"
            type="text"
            value={firstName}
            placeholder="Enter your first name"
            onChange={(event) =>
              setFirstName(
                event.target.value
              )
            }
            required
          />

        </div>

        <div className="form-group">

          <label htmlFor="lastName">
            Last Name
          </label>

          <input
            id="lastName"
            type="text"
            value={lastName}
            placeholder="Enter your last name"
            onChange={(event) =>
              setLastName(
                event.target.value
              )
            }
            required
          />

        </div>

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

        <div className="form-group">

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            placeholder="Create a password"
            minLength="8"
            onChange={(event) =>
              setPassword(
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
            ? "Creating account..."
            : "Register"
          }
        </button>

      </form>

      <p className="form-footer">

        Already have an account?{" "}

        <Link to="/login">
          Login
        </Link>

      </p>

    </section>
  );
}

export default RegisterPage;