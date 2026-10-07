import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section className="not-found-page">

      <h1>404</h1>

      <p>
        Page not found.
      </p>

      <Link to="/">
        Return Home
      </Link>

    </section>
  );
}

export default NotFoundPage;