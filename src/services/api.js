const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

async function apiRequest(
  endpoint,
  options = {}
) {

  const {
    auth = true,
    headers = {},
    body,
    ...fetchOptions
  } = options;

  const requestHeaders = {
    ...headers,
  };

  if (
    body &&
    !(body instanceof FormData)
  ) {

    requestHeaders[
      "Content-Type"
    ] = "application/json";
  }

  if (auth) {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      requestHeaders.Authorization =
        `Bearer ${token}`;
    }
  }

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...fetchOptions,
        headers: requestHeaders,
        body,
      }
    );

  const text =
    await response.text();

  let data = null;

  if (text) {

    try {

      data =
        JSON.parse(text);

    } catch {

      data = text;
    }
  }

  if (!response.ok) {

    const message =
      data?.message ||
      data ||
      "Something went wrong";

    const error =
      new Error(message);

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }

  return data;
}

export default apiRequest;