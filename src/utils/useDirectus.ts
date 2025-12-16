import {
  authentication,
  createDirectus,
  logout,
  readMe,
  refresh,
  rest,
  createItem,
  readItems,
  uploadFiles,
  updateItem,
  deleteItem,
} from "@directus/sdk";

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";

export const client = createDirectus(baseUrl)
  .with(rest({ credentials: "include" }))
  .with(authentication("json", { credentials: "include" }));

// Helper function to get access token from cookie
const getAccessToken = (): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "accessToken") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Set token in client if exists
const initializeAuth = () => {
  const token = getAccessToken();
  if (token) {
    client.setToken(token);
  }
};

// Initialize auth on module load
initializeAuth();

export const getCurrentUser = async () => {
  // Ensure token is set before making request
  initializeAuth();

  return await client.request(
    readMe({
      fields: ["id", "first_name", "last_name", "middle_name", "email", "role", "status"],
    }),
  );
};

export const refreshToken = async () => {
  const refreshTokenValue = sessionStorage.getItem("refresh_token");

  if (!refreshTokenValue) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await client.request(refresh("json", refreshTokenValue));

    if (response.access_token) {
      // Update cookie
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // 7 days
      document.cookie = `accessToken=${encodeURIComponent(response.access_token)};path=/;expires=${expires.toUTCString()}`;

      // Update session storage
      sessionStorage.setItem("access_token", response.access_token.toString());

      if (response.refresh_token) {
        sessionStorage.setItem("refresh_token", response.refresh_token.toString());
      }

      // Update client token
      client.setToken(response.access_token);

      return response;
    }

    throw new Error("Failed to refresh token");
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

export const processLogout = async () => {
  try {
    const refresh_token = sessionStorage.getItem("refresh_token");

    if (refresh_token) {
      await client.request(logout(refresh_token, "json"));
    }

    sessionStorage.clear();

    // Clear the cookie
    document.cookie = "accessToken=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } catch (e) {
    console.log(e);
  }
};

// Helper function removed from here as it's defined at the top

export const validateUserRole = async (
  roleId: string | null,
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
      throw new Error("No access token available");
    }

    // Use direct REST API call for core collections
    const response = await fetch(`${baseUrl}/roles/${roleId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
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

// Create a daily visit record
export const createDailyVisit = async (visitData: any) => {
  try {
    initializeAuth(); // Ensure token is set
    const response = await client.request(createItem("patient_daily_visit", visitData));
    return response;
  } catch (error) {
    console.error("Error creating daily visit:", error);
    throw error;
  }
};

// Create an annual assessment record
export const createAnnualAssessment = async (assessmentData: any) => {
  try {
    initializeAuth(); // Ensure token is set
    const response = await client.request(createItem("anual_assessment", assessmentData));
    return response;
  } catch (error) {
    console.error("Error creating annual assessment:", error);
    throw error;
  }
};

// Create a student health record
export const createHealthRecord = async (healthData: any) => {
  try {
    initializeAuth(); // Ensure token is set
    const response = await client.request(createItem("student_health_record", healthData));
    return response;
  } catch (error) {
    console.error("Error creating health record:", error);
    throw error;
  }
};

// Get all daily visits
export const getDailyVisits = async () => {
  try {
    initializeAuth(); // Ensure token is set
    const response = await client.request(readItems("patient_daily_visit"));
    return response;
  } catch (error) {
    console.error("Error fetching daily visits:", error);
    throw error;
  }
};

// Get all health records
export const getHealthRecords = async () => {
  try {
    initializeAuth(); // Ensure token is set
    const response = await client.request(readItems("student_health_record"));
    return response;
  } catch (error) {
    console.error("Error fetching health records:", error);
    throw error;
  }
};

// Update student health record
export const updateHealthRecord = async (id: string, healthData: any) => {
  try {
    initializeAuth(); // Ensure token is set
    const response = await client.request(updateItem("student_health_record", id, healthData));
    return response;
  } catch (error) {
    console.error("Error updating health record:", error);
    throw error;
  }
};

// Delete student health record
export const deleteHealthRecord = async (id: string) => {
  try {
    initializeAuth(); // Ensure token is set
    const response = await client.request(deleteItem("student_health_record", id));
    return response;
  } catch (error) {
    console.error("Error deleting health record:", error);
    throw error;
  }
};

// Get all annual assessments
export const getAnnualAssessments = async () => {
  try {
    initializeAuth(); // Ensure token is set
    const response = await client.request(readItems("anual_assessment"));
    return response;
  } catch (error) {
    console.error("Error fetching annual assessments:", error);
    throw error;
  }
};

// Get students with student role
export const getStudents = async () => {
  try {
    // First get the student role ID
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("No access token available");
    }

    // Get roles to find student role ID
    const rolesResponse = await fetch(`${baseUrl}/roles?filter[name][_eq]=student`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!rolesResponse.ok) {
      throw new Error(`HTTP error! status: ${rolesResponse.status}`);
    }

    const rolesData = await rolesResponse.json();
    const studentRoleId = rolesData.data?.[0]?.id;

    if (!studentRoleId) {
      throw new Error("Student role not found");
    }

    // Get users with student role
    const usersResponse = await fetch(
      `${baseUrl}/users?filter[role][_eq]=${studentRoleId}&fields=id,first_name,last_name,middle_name,email,student_id`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!usersResponse.ok) {
      throw new Error(`HTTP error! status: ${usersResponse.status}`);
    }

    const usersData = await usersResponse.json();
    return usersData.data || [];
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// Get all announcements
export const getAnnouncements = async () => {
  try {
    initializeAuth();
    const response = await client.request(readItems("announcements"));
    return response;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

// Create announcement
export const createAnnouncement = async (announcementData: any) => {
  try {
    initializeAuth();
    const response = await client.request(createItem("announcements", announcementData));
    return response;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};

// Update announcement
export const updateAnnouncement = async (id: string, announcementData: any) => {
  try {
    initializeAuth();
    const response = await client.request(updateItem("announcements", id, announcementData));
    return response;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};

// Delete announcement
export const deleteAnnouncement = async (id: string) => {
  try {
    initializeAuth();
    const response = await client.request(deleteItem("announcements", id));
    return response;
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
};


// Upload file to Directus
export const uploadFile = async (file: File) => {
  try {
    console.log("uploadFile called with:", file);
    initializeAuth();
    const formData = new FormData();
    formData.append("file", file);

    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("No access token available");
    }

    console.log("Uploading to:", `${baseUrl}/files`);

    const response = await fetch(`${baseUrl}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      credentials: "include",
    });

    console.log("Upload response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log("Upload successful, data:", data);
    return data.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
