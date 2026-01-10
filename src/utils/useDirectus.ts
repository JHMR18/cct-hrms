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
  readUsers,
} from "@directus/sdk";
import {
  getAccessToken,
  setAccessToken,
  performTokenRefresh,
  performLogout,
  withTokenRefresh,
  authenticatedFetch,
  clearAuthData,
} from "./authTokenManager";

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";

export const client = createDirectus(baseUrl)
  .with(rest({ credentials: "include" }))
  .with(authentication("json", { credentials: "include" }));

// Initialize auth on module load
const initializeAuth = () => {
  const token = getAccessToken();
  if (token) {
    client.setToken(token);
  }
};

initializeAuth();

// Re-export for backwards compatibility
export { getAccessToken, setAccessToken, performTokenRefresh as refreshToken, performLogout as processLogout };

export const getCurrentUser = async () => {
  return withTokenRefresh(async () => {
    return await client.request(
      readMe({
        fields: ["id", "first_name", "last_name", "middle_name", "email", "role", "status"],
      })
    );
  });
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

    const data = await authenticatedFetch<{ name: string }>(`/roles/${roleId}`);
    const roleName = data?.name;

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
  return withTokenRefresh(async () => {
    return await client.request(createItem("patient_daily_visit", visitData));
  });
};

// Create an annual assessment record
export const createAnnualAssessment = async (assessmentData: any) => {
  return withTokenRefresh(async () => {
    return await client.request(createItem("anual_assessment", assessmentData));
  });
};

// Create a student health record
export const createHealthRecord = async (healthData: any) => {
  return withTokenRefresh(async () => {
    return await client.request(createItem("student_health_record", healthData));
  });
};

// Get users with optional parameters
export const getUsers = async (params: any = {}) => {
  return withTokenRefresh(async () => {
    return await client.request(readUsers(params));
  });
};

// Get all daily visits
export const getDailyVisits = async () => {
  return withTokenRefresh(async () => {
    return await client.request(readItems("patient_daily_visit"));
  });
};

// Get all health records
export const getHealthRecords = async () => {
  return withTokenRefresh(async () => {
    return await client.request(
      readItems("student_health_record", {
        fields: ["*", "student_id.*"],
      })
    );
  });
};

// Update student health record
export const updateHealthRecord = async (id: string, healthData: any) => {
  return withTokenRefresh(async () => {
    return await client.request(updateItem("student_health_record", id, healthData));
  });
};

// Delete student health record
export const deleteHealthRecord = async (id: string) => {
  return withTokenRefresh(async () => {
    return await client.request(deleteItem("student_health_record", id));
  });
};

// Get all annual assessments
export const getAnnualAssessments = async () => {
  return withTokenRefresh(async () => {
    return await client.request(readItems("anual_assessment"));
  });
};

// Get students with student role
export const getStudents = async () => {
  try {
    // Get roles to find student role ID
    const rolesData = await authenticatedFetch<Array<{ id: string; name: string }>>(
      `/roles?filter[name][_eq]=student`
    );
    const studentRoleId = rolesData?.[0]?.id;

    if (!studentRoleId) {
      throw new Error("Student role not found");
    }

    // Get users with student role
    const usersData = await authenticatedFetch<
      Array<{
        id: string;
        first_name: string;
        last_name: string;
        middle_name: string;
        email: string;
        student_id: string;
        sex: string;
        department: string;
      }>
    >(`/users?filter[role][_eq]=${studentRoleId}&fields=id,first_name,last_name,middle_name,email,student_id,sex,department`);

    return usersData || [];
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// Get all announcements
export const getAnnouncements = async () => {
  return withTokenRefresh(async () => {
    return await client.request(readItems("announcements"));
  });
};

// Create announcement
export const createAnnouncement = async (announcementData: any) => {
  return withTokenRefresh(async () => {
    return await client.request(createItem("announcements", announcementData));
  });
};

// Update announcement
export const updateAnnouncement = async (id: string, announcementData: any) => {
  return withTokenRefresh(async () => {
    return await client.request(updateItem("announcements", id, announcementData));
  });
};

// Delete announcement
export const deleteAnnouncement = async (id: string) => {
  return withTokenRefresh(async () => {
    return await client.request(deleteItem("announcements", id));
  });
};

// Upload file to Directus
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return authenticatedFetch<{ id: string; filename_download: string }>("/files", {
    method: "POST",
    body: formData,
  });
};
