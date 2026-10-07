import {
  useEffect,
  useState,
} from "react";

import apiRequest from "../services/api.js";
import useAuth from "../hooks/useAuth.js";

import "../styles/pages/AdminUsersPage.css";

function AdminUsersPage() {

  const {
    user: currentUser,
  } = useAuth();

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [statusAction, setStatusAction] =
    useState(null);

  const [updatingUserId, setUpdatingUserId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    loadUsers();

  }, []);

  async function loadUsers() {

    setLoading(true);
    setError("");

    try {

      const response =
        await apiRequest(
          "/api/users/admin",
          {
            method: "GET",
          }
        );

      setUsers(
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

  function openStatusModal(
    user
  ) {

    if (
      user.id === currentUser?.id
    ) {
      return;
    }

    setStatusAction(
      user
    );

    setError("");
    setMessage("");
  }

  function closeStatusModal() {

    if (updatingUserId) {
      return;
    }

    setStatusAction(
      null
    );
  }

  async function handleStatusChange() {

    if (!statusAction) {
      return;
    }

    const newStatus =
      statusAction.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    setUpdatingUserId(
      statusAction.id
    );

    setError("");
    setMessage("");

    try {

      const response =
        await apiRequest(
          `/api/users/admin/${statusAction.id}/status`,
          {
            method: "PATCH",

            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

      setUsers(
        users.map(
          (user) =>
            user.id === response.id
              ? response
              : user
        )
      );

      setStatusAction(
        null
      );

      setMessage(
        newStatus === "ACTIVE"
          ? `${response.firstName}'s account was activated.`
          : `${response.firstName}'s account was deactivated.`
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setUpdatingUserId(
        null
      );
    }
  }

  const filteredUsers =
    users.filter(
      (user) => {

        const searchValue =
          search
            .trim()
            .toLowerCase();

        if (!searchValue) {
          return true;
        }

        const fullName =
          `${user.firstName} ${user.lastName}`
            .toLowerCase();

        return (
          fullName.includes(
            searchValue
          ) ||
          user.email
            .toLowerCase()
            .includes(
              searchValue
            )
        );
      }
    );

  if (loading) {

    return (
      <section className="admin-users-page">

        <p className="admin-users-message">
          Loading users...
        </p>

      </section>
    );
  }

  return (
    <section className="admin-users-page">

      <div className="admin-users-header">

        <div>

          <h1 className="page-title">
            User Management
          </h1>

          <p className="page-description">
            View registered users and manage account access.
          </p>

        </div>

        <span className="admin-users-count">
          {users.length}{" "}
          {users.length === 1
            ? "user"
            : "users"
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

      <section className="admin-users-section">

        <div className="admin-users-toolbar">

          <div className="admin-users-search">

            <label htmlFor="userSearch">
              Search Users
            </label>

            <input
              id="userSearch"
              type="text"
              value={search}
              placeholder="Search by name or email..."
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <span>
            Showing{" "}
            {filteredUsers.length}
          </span>

        </div>

        {filteredUsers.length === 0 ? (

          <div className="admin-users-empty">

            <p>
              No users found.
            </p>

          </div>

        ) : (

          <div className="admin-users-table-container">

            <table className="admin-users-table">

              <thead>

                <tr>

                  <th>
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Verified
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

                {filteredUsers.map(
                  (user) => {

                    const isCurrentUser =
                      user.id ===
                      currentUser?.id;

                    return (
                      <tr key={user.id}>

                        <td>

                          <div className="admin-user-profile">

                            {user.profilePictureUrl ? (

                              <img
                                src={
                                  user.profilePictureUrl
                                }
                                alt={`${user.firstName} ${user.lastName}`}
                              />

                            ) : (

                              <div className="admin-user-placeholder">

                                {user.firstName
                                  ?.charAt(0)
                                  .toUpperCase()}

                              </div>

                            )}

                            <div>

                              <strong>
                                {user.firstName}{" "}
                                {user.lastName}
                              </strong>

                              {isCurrentUser && (

                                <span className="admin-current-user-label">
                                  You
                                </span>

                              )}

                            </div>

                          </div>

                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>

                          <span
                            className={
                              user.role === "ADMIN"
                                ? "admin-user-role admin"
                                : "admin-user-role customer"
                            }
                          >
                            {user.role}
                          </span>

                        </td>

                        <td>

                          <span
                            className={
                              user.verified
                                ? "admin-verification verified"
                                : "admin-verification unverified"
                            }
                          >
                            {user.verified
                              ? "Verified"
                              : "Not Verified"
                            }
                          </span>

                        </td>

                        <td>

                          <span
                            className={
                              user.status === "ACTIVE"
                                ? "admin-user-status active"
                                : "admin-user-status inactive"
                            }
                          >
                            {user.status === "ACTIVE"
                              ? "Active"
                              : "Inactive"
                            }
                          </span>

                        </td>

                        <td>

                          {isCurrentUser ? (

                            <span className="admin-self-action">
                              Current Account
                            </span>

                          ) : (

                            <button
                              className={
                                user.status === "ACTIVE"
                                  ? "admin-user-status-button deactivate"
                                  : "admin-user-status-button activate"
                              }
                              onClick={() =>
                                openStatusModal(
                                  user
                                )
                              }
                            >
                              {user.status === "ACTIVE"
                                ? "Deactivate"
                                : "Activate"
                              }
                            </button>

                          )}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {statusAction && (

        <div className="admin-user-modal-overlay">

          <div className="admin-user-modal">

            <h2>
              {statusAction.status ===
              "ACTIVE"
                ? "Deactivate Account"
                : "Activate Account"
              }
            </h2>

            <p>
              Are you sure you want to{" "}

              <strong>
                {statusAction.status ===
                "ACTIVE"
                  ? "deactivate"
                  : "activate"
                }
              </strong>

              {" "}the account for{" "}

              <strong>
                {statusAction.firstName}{" "}
                {statusAction.lastName}
              </strong>
              ?
            </p>

            {statusAction.status ===
              "ACTIVE" && (

              <p className="admin-user-modal-warning">
                This user will no longer be able to access authenticated parts of the store while their account is inactive.
              </p>

            )}

            {statusAction.status ===
              "INACTIVE" && (

              <p className="admin-user-modal-description">
                The user will be able to log in again once their account is active and their email is verified.
              </p>

            )}

            <div className="admin-user-modal-actions">

              <button
                className="admin-user-modal-back"
                onClick={
                  closeStatusModal
                }
                disabled={
                  updatingUserId ===
                  statusAction.id
                }
              >
                Go Back
              </button>

              <button
                className={
                  statusAction.status ===
                  "ACTIVE"
                    ? "admin-user-modal-confirm danger"
                    : "admin-user-modal-confirm"
                }
                onClick={
                  handleStatusChange
                }
                disabled={
                  updatingUserId ===
                  statusAction.id
                }
              >
                {updatingUserId ===
                statusAction.id
                  ? "Updating..."
                  : statusAction.status ===
                    "ACTIVE"
                    ? "Deactivate"
                    : "Activate"
                }
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default AdminUsersPage;