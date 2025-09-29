import {
  authentication,
  createDirectus,
  logout,
  readMe,
  refresh,
  rest,
  createItem,
  readItems,
} from "@directus/sdk";

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";

export const client = createDirectus(baseUrl)
  .with(rest({ credentials: "include" }))
  .with(authentication("json", { credentials: "include" }));

export const getCurrentUser = async () => {
  return await client.request(
    readMe({
      fields: ["id", "first_name", "last_name", "email", "role", "status"],
    }),
  );
};

export const refreshToken = async () => {
  const response = await client.request(
    refresh("json", sessionStorage.getItem("refresh_token") ?? ""),
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
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "accessToken") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

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
    const response = await client.request(readItems("student_health_record"));
    return response;
  } catch (error) {
    console.error("Error fetching health records:", error);
    throw error;
  }
};

// Get all annual assessments
export const getAnnualAssessments = async () => {
  try {
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
      `${baseUrl}/users?filter[role][_eq]=${studentRoleId}&fields=id,first_name,last_name,email`,
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
