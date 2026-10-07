import {
  useState,
} from "react";

import AuthContext from "./AuthContext.js";
import apiRequest from "../services/api.js";

function AuthProvider({
  children,
}) {

  const [token, setToken] =
    useState(() =>
      localStorage.getItem(
        "token"
      )
    );

  const [user, setUser] =
    useState(() => {

      const savedUser =
        localStorage.getItem(
          "user"
        );

      if (!savedUser) {
        return null;
      }

      try {

        return JSON.parse(
          savedUser
        );

      } catch {

        localStorage.removeItem(
          "user"
        );

        return null;
      }
    });

  async function login(
    email,
    password
  ) {

    const response =
      await apiRequest(
        "/api/auth/login",
        {
          method: "POST",
          auth: false,

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

    localStorage.setItem(
      "token",
      response.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        response.user
      )
    );

    setToken(
      response.token
    );

    setUser(
      response.user
    );

    return response;
  }

  function updateUser(
    updatedUser
  ) {

    localStorage.setItem(
      "user",
      JSON.stringify(
        updatedUser
      )
    );

    setUser(
      updatedUser
    );
  }

  function logout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken(null);
    setUser(null);
  }

  const isAuthenticated =
    Boolean(
      token &&
      user
    );

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        updateUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;