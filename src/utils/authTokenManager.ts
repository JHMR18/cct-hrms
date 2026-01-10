import { refresh, logout as directusLogout } from "@directus/sdk";
import { client } from "./useDirectus";

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let failedSubscribers: Array<(error: Error) => void> = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (
  onSuccess: (token: string) => void,
  onFailure: (error: Error) => void
) => {
  refreshSubscribers.push(onSuccess);
  failedSubscribers.push(onFailure);
};

// Notify all subscribers with new token
const onRefreshSuccess = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
  failedSubscribers = [];
};

// Notify all subscribers of failure
const onRefreshFailure = (error: Error) => {
  failedSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
  failedSubscribers = [];
};

// Get access token from cookie
export const getAccessToken = (): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "accessToken") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Set access token in cookie
export const setAccessToken = (token: string) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7 days
  document.cookie = `accessToken=${encodeURIComponent(token)};path=/;expires=${expires.toUTCString()}`;
  sessionStorage.setItem("access_token", token);
  client.setToken(token);
};

// Clear all auth data
export const clearAuthData = () => {
  document.cookie = "accessToken=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("userData");
  client.setToken(null);
};

// Perform token refresh with queueing
export const performTokenRefresh = async (): Promise<string> => {
  const refreshTokenValue = sessionStorage.getItem("refresh_token");

  if (!refreshTokenValue) {
    throw new Error("No refresh token available");
  }

  // If already refreshing, wait for the result
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(resolve, reject);
    });
  }

  isRefreshing = true;

  try {
    const response = await client.request(refresh("json", refreshTokenValue));

    if (response.access_token) {
      setAccessToken(response.access_token);

      if (response.refresh_token) {
        sessionStorage.setItem("refresh_token", response.refresh_token.toString());
      }

      onRefreshSuccess(response.access_token);
      return response.access_token;
    }

    throw new Error("Failed to refresh token - no access token in response");
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Token refresh failed");
    onRefreshFailure(err);
    throw err;
  } finally {
    isRefreshing = false;
  }
};

// Handle logout with Directus
export const performLogout = async () => {
  try {
    const refreshToken = sessionStorage.getItem("refresh_token");
    if (refreshToken) {
      await client.request(directusLogout(refreshToken, "json"));
    }
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    clearAuthData();
  }
};

// Redirect to login page
export const redirectToLogin = () => {
  clearAuthData();
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
};

// Check if error is an auth error (401/403)
export const isAuthError = (status: number): boolean => {
  return status === 401 || status === 403;
};

// Authenticated fetch wrapper with automatic token refresh
export const authenticatedFetch = async <T>(
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> => {
  const accessToken = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
  }

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete (headers as Record<string, string>)["Content-Type"];
  }

  const response = await fetch(url.startsWith("http") ? url : `${baseUrl}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // Handle auth errors with automatic refresh
  if (isAuthError(response.status) && retryCount === 0) {
    try {
      await performTokenRefresh();
      // Retry the request with new token
      return authenticatedFetch<T>(url, options, retryCount + 1);
    } catch (refreshError) {
      console.error("Token refresh failed, redirecting to login:", refreshError);
      redirectToLogin();
      throw new Error("Session expired. Please login again.");
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  const data = await response.json();
  return data.data !== undefined ? data.data : data;
};

// Wrapper for Directus SDK requests with automatic token refresh
export const withTokenRefresh = async <T>(
  requestFn: () => Promise<T>,
  retryCount = 0
): Promise<T> => {
  // Ensure token is set before request
  const token = getAccessToken();
  if (token) {
    client.setToken(token);
  }

  try {
    return await requestFn();
  } catch (error: any) {
    // Check if it's an auth error
    const isAuthErr =
      error?.response?.status === 401 ||
      error?.response?.status === 403 ||
      error?.errors?.[0]?.extensions?.code === "FORBIDDEN" ||
      error?.errors?.[0]?.extensions?.code === "TOKEN_EXPIRED" ||
      error?.message?.includes("TOKEN_EXPIRED") ||
      error?.message?.includes("FORBIDDEN");

    if (isAuthErr && retryCount === 0) {
      try {
        await performTokenRefresh();
        // Retry the request with new token
        return withTokenRefresh(requestFn, retryCount + 1);
      } catch (refreshError) {
        console.error("Token refresh failed, redirecting to login:", refreshError);
        redirectToLogin();
        throw new Error("Session expired. Please login again.");
      }
    }

    throw error;
  }
};
