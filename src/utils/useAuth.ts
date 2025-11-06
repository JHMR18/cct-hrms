import { computed, readonly } from "vue";
import { useCookie } from "./useCookie";
import { client, getCurrentUser, processLogout } from "./useDirectus";

export function useAuth() {
  const accessToken = useCookie<string | null>("accessToken", { default: () => null });
  const userData = computed(() => {
    const stored = sessionStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = computed(() => {
    return !!accessToken.value;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await client.login(email, password);

      if (response.access_token) {
        accessToken.value = response.access_token;
        
        // Set token in client
        client.setToken(response.access_token);

        if (response.refresh_token) {
          sessionStorage.setItem("refresh_token", response.refresh_token);
        }

        const user = await getCurrentUser();
        sessionStorage.setItem("userData", JSON.stringify(user));

        return { success: true, user };
      }

      throw new Error("Login failed");
    } catch (error: any) {
      throw new Error(error?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await processLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      accessToken.value = null;
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("refresh_token");
    }
  };

  const checkAuth = async () => {
    if (!accessToken.value) {
      return false;
    }

    try {
      const user = await getCurrentUser();
      
      // Update session storage if user data is different
      const currentUserData = sessionStorage.getItem("userData");
      const newUserData = JSON.stringify(user);
      if (currentUserData !== newUserData) {
        sessionStorage.setItem("userData", newUserData);
      }
      
      return true;
    } catch (error: any) {
      console.error("Auth check failed:", error);
      
      // Try to refresh token if we have a refresh token
      const refreshToken = sessionStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { refreshToken: refreshTokenFn } = await import("./useDirectus");
          await refreshTokenFn();
          
          // Try to get user again after refresh
          const user = await getCurrentUser();
          sessionStorage.setItem("userData", JSON.stringify(user));
          return true;
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }
      
      // If all fails, logout
      await logout();
      return false;
    }
  };

  return {
    accessToken: readonly(accessToken),
    userData: readonly(userData),
    isAuthenticated: readonly(isAuthenticated),
    login,
    logout,
    checkAuth,
  };
}
