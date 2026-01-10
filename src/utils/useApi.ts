import { createFetch } from "@vueuse/core";
import { destr } from "destr";
import { useCookie } from "./useCookie";
import { performTokenRefresh, redirectToLogin, isAuthError } from "./authTokenManager";

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";

export function useApi() {
  return createFetch({
    baseUrl,
    fetchOptions: {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    },
    options: {
      refetch: true,
      async beforeFetch({ options }) {
        const accessToken = useCookie("accessToken").value;

        if (accessToken) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          };
        }

        return { options };
      },
      async afterFetch(ctx) {
        const { data, response } = ctx;

        let parsedData = null;
        try {
          parsedData = destr(data);
        } catch (error) {
          console.error("Error parsing response:", error);
        }

        return { data: parsedData, response };
      },
      async onFetchError(ctx) {
        const { response, error } = ctx;

        // Handle auth errors with automatic token refresh
        if (response && isAuthError(response.status)) {
          try {
            await performTokenRefresh();
            // Note: VueUse's createFetch doesn't support automatic retry
            // The caller should handle refetching after token refresh
            console.log("Token refreshed. Please retry the request.");
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            redirectToLogin();
          }
        }

        return ctx;
      },
    },
  });
}
