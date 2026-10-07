import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import useAuth from "../hooks/useAuth.js";

function LoginPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const {
    login,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  async function handleSubmit(
    event
  ) {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      await login(
        email,
        password
      );

      navigate("/");

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

      <h1>Login</h1>

      {location.state?.message && (
        <div className="success-message">
          {location.state.message}
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

        <div className="form-group">

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
          />

        </div>

        <div className="form-options">

          <Link to="/forgot-password">
            Forgot password?
          </Link>

        </div>

        <button
          className="form-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"
          }
        </button>

      </form>

      <p className="form-footer">

        Don't have an account?{" "}

        <Link to="/register">
          Register
        </Link>

      </p>

      <p className="form-footer">

        Didn't receive your verification email?{" "}

        <Link to="/resend-verification">
          Resend
        </Link>

      </p>

    </section>
  );
}

export default LoginPage;