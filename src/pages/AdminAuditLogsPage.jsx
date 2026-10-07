import {
  useEffect,
  useState,
} from "react";

import apiRequest from "../services/api.js";

import "../styles/pages/AdminAuditLogsPage.css";

function AdminAuditLogsPage() {

  const [auditLogs, setAuditLogs] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [actionFilter, setActionFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    loadAuditLogs();

  }, []);

  async function loadAuditLogs() {

    setLoading(true);
    setError("");

    try {

      const [
        auditResponse,
        userResponse,
      ] = await Promise.all([
        apiRequest(
          "/api/audit-logs",
          {
            method: "GET",
          }
        ),

        apiRequest(
          "/api/users/admin",
          {
            method: "GET",
          }
        ),
      ]);

      setAuditLogs(
        auditResponse
      );

      setUsers(
        userResponse
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);
    }
  }

  function getUser(
    userId
  ) {

    return users.find(
      (user) =>
        user.id === userId
    );
  }

  function formatAction(
    action
  ) {

    return action
      .replaceAll(
        "_",
        " "
      )
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  }

  function formatDate(
    date
  ) {

    return new Date(
      date
    ).toLocaleString();
  }

  const actions =
    [
      ...new Set(
        auditLogs.map(
          (auditLog) =>
            auditLog.action
        )
      ),
    ];

  const filteredAuditLogs =
    auditLogs.filter(
      (auditLog) => {

        const searchValue =
          search
            .trim()
            .toLowerCase();

        const user =
          getUser(
            auditLog.userId
          );

        const userName =
          user
            ? `${user.firstName} ${user.lastName}`
                .toLowerCase()
            : "";

        const userEmail =
          user?.email
            ?.toLowerCase() || "";

        const matchesSearch =
          !searchValue ||
          String(
            auditLog.id
          ).includes(
            searchValue
          ) ||
          String(
            auditLog.userId
          ).includes(
            searchValue
          ) ||
          auditLog.action
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          auditLog.description
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          userName.includes(
            searchValue
          ) ||
          userEmail.includes(
            searchValue
          );

        const matchesAction =
          actionFilter === "ALL" ||
          auditLog.action ===
            actionFilter;

        return (
          matchesSearch &&
          matchesAction
        );
      }
    );

  if (loading) {

    return (
      <section className="admin-audit-page">

        <p className="admin-audit-message">
          Loading audit logs...
        </p>

      </section>
    );
  }

  return (
    <section className="admin-audit-page">

      <div className="admin-audit-header">

        <div>

          <h1 className="page-title">
            Audit Logs
          </h1>

          <p className="page-description">
            Review important system and administrator actions.
          </p>

        </div>

        <span className="admin-audit-count">
          {auditLogs.length}{" "}
          {auditLogs.length === 1
            ? "record"
            : "records"
          }
        </span>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <section className="admin-audit-section">

        <div className="admin-audit-toolbar">

          <div className="admin-audit-search">

            <label htmlFor="auditSearch">
              Search Logs
            </label>

            <input
              id="auditSearch"
              type="text"
              value={search}
              placeholder="Search user, action or description..."
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <div className="admin-audit-filter">

            <label htmlFor="auditAction">
              Action
            </label>

            <select
              id="auditAction"
              value={actionFilter}
              onChange={(event) =>
                setActionFilter(
                  event.target.value
                )
              }
            >

              <option value="ALL">
                All Actions
              </option>

              {actions.map(
                (action) => (

                  <option
                    key={action}
                    value={action}
                  >
                    {formatAction(
                      action
                    )}
                  </option>

                )
              )}

            </select>

          </div>

          <span className="admin-audit-showing">
            Showing{" "}
            {filteredAuditLogs.length}
          </span>

        </div>

        {filteredAuditLogs.length === 0 ? (

          <div className="admin-audit-empty">

            <p>
              No audit logs found.
            </p>

          </div>

        ) : (

          <div className="admin-audit-table-container">

            <table className="admin-audit-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    User
                  </th>

                  <th>
                    Action
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredAuditLogs.map(
                  (auditLog) => {

                    const user =
                      getUser(
                        auditLog.userId
                      );

                    return (
                      <tr key={auditLog.id}>

                        <td>
                          #{auditLog.id}
                        </td>

                        <td>

                          {user ? (
                            <div className="admin-audit-user">

                              <strong>
                                {user.firstName}{" "}
                                {user.lastName}
                              </strong>

                              <span>
                                {user.email}
                              </span>

                            </div>
                          ) : (
                            <span>
                              User #{auditLog.userId}
                            </span>
                          )}

                        </td>

                        <td>

                          <span className="admin-audit-action">
                            {formatAction(
                              auditLog.action
                            )}
                          </span>

                        </td>

                        <td className="admin-audit-description">
                          {auditLog.description}
                        </td>

                        <td className="admin-audit-date">
                          {formatDate(
                            auditLog.createdAt
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

    </section>
  );
}

export default AdminAuditLogsPage;