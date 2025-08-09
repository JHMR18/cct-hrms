import {
  authentication,
  createDirectus,
  logout,
  readMe,
  refresh,
  rest,
} from "@directus/sdk";

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";

export const client = createDirectus(baseUrl)
  .with(rest({ credentials: "include" }))
  .with(authentication("json", { credentials: "include" }));

export const getCurrentUser = async () => {
  return await client.request(
    readMe({
      fields: ["id", "first_name", "last_name", "email", "role", "status"],
    })
  );
};

export const refreshToken = async () => {
  const response = await client.request(
    refresh("json", sessionStorage.getItem("refresh_token") ?? "")
  );

  sessionStorage.setItem("access_token", response.access_token?.toString() ?? "");
  sessionStorage.setItem("refresh_token", response.refresh_token?.toString() ?? "");
};

export const processLogout = async () => {
  try {
    const refresh_token = sessionStorage.getItem("refresh_token");

    await client.request(logout(refresh_token, "json"));

    sessionStorage.clear();
  } catch (e) {
    console.log(e);
  }
};

// Helper function to get access token from cookie
const getAccessToken = (): string | null => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'accessToken') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

export const validateUserRole = async (
  roleId: string | null
): Promise<{ isValid: boolean; roleName: string | null }> => {
  try {
    if (!roleId) {
      return {
        isValid: false,
        roleName: null,
      };
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Use direct REST API call for core collections
    const response = await fetch(`${baseUrl}/roles/${roleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const roleName = data.data?.name;

    if (roleName) {
      return {
        isValid: roleName.toLowerCase() === "student",
        roleName: roleName,
      };
    }

    return {
      isValid: false,
      roleName: null,
    };
  } catch (error) {
    console.error("Error validating role:", error);
    return {
      isValid: false,
      roleName: null,
    };
  }
};
