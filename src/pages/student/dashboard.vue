<template>
  <v-app>
    <!-- App Bar Header -->
    <v-app-bar color="primary" dark elevation="4">
      <v-app-bar-title class="d-flex align-center">
        <v-icon class="mr-3">mdi-account-circle</v-icon>
        <div>
          <div class="text-h6">{{ studentName }}</div>
          <div class="text-caption opacity-80">Student No: {{ studentNumber }}</div>
        </div>
      </v-app-bar-title>
      <v-spacer />
      <v-btn icon @click="handleLogout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <!-- Tabs Navigation -->
        <v-tabs v-model="activeTab" color="primary" align-tabs="center" class="mb-6">
          <v-tab value="create-record">
            <v-icon class="mr-2">mdi-plus-circle</v-icon>
            Create Health Record
          </v-tab>
          <v-tab value="view-record">
            <v-icon class="mr-2">mdi-file-document</v-icon>
            View My Health Record
          </v-tab>
          <v-tab value="annual-assessment">
            <v-icon class="mr-2">mdi-clipboard-check</v-icon>
            View Annual Assessment
          </v-tab>
        </v-tabs>

        <!-- Tab Content -->
        <v-tabs-window v-model="activeTab">
          <!-- Tab 1: Create Health Record -->
          <v-tabs-window-item value="create-record">
            <div v-if="hasExistingRecord" class="text-center pa-8">
              <v-card class="mx-auto" max-width="600" elevation="2">
                <v-card-text class="pa-8">
                  <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
                  <h2 class="text-h5 mb-4">Health Record Already Submitted</h2>
                  <p class="text-body-1 mb-6">
                    You have already submitted your health record. You can view it in the 'View My
                    Health Record' tab.
                  </p>
                  <v-btn color="primary" size="large" @click="activeTab = 'view-record'">
                    View My Record
                  </v-btn>
                </v-card-text>
              </v-card>
            </div>
            <CreateHealthRecord v-else @record-created="onRecordCreated" />
          </v-tabs-window-item>

          <!-- Tab 2: View My Health Record -->
          <v-tabs-window-item value="view-record">
            <div v-if="loadingHealthRecord" class="text-center pa-8">
              <v-progress-circular indeterminate color="primary" size="64" />
              <p class="mt-4">Loading your health record...</p>
            </div>

            <div v-else-if="!healthRecord" class="text-center pa-8">
              <v-card class="mx-auto" max-width="600" elevation="2">
                <v-card-text class="pa-8">
                  <v-icon size="64" color="warning" class="mb-4">mdi-alert-circle</v-icon>
                  <h2 class="text-h5 mb-4">No Health Record Found</h2>
                  <p class="text-body-1 mb-6">
                    No health record found. Please create one in the 'Create Health Record' tab.
                  </p>
                  <v-btn color="primary" size="large" @click="activeTab = 'create-record'">
                    Create Health Record
                  </v-btn>
                </v-card-text>
              </v-card>
            </div>

            <div v-else>
              <!-- Personal Information -->
              <v-card class="mb-6" elevation="2">
                <v-card-title class="text-h5 primary--text">
                  <v-icon class="mr-2">mdi-account</v-icon>
                  Personal Information
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <strong>First Name:</strong>
                        <p>{{ healthRecord.first_name }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Middle Name:</strong>
                        <p>{{ healthRecord.middle_name }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Last Name:</strong>
                        <p>{{ healthRecord.last_name }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Birthdate:</strong>
                        <p>{{ formatDate(healthRecord.birthdate) }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Civil Status:</strong>
                        <p>{{ healthRecord.civil_status }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Student Number:</strong>
                        <p>{{ healthRecord.student_no }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Gender:</strong>
                        <p>{{ healthRecord.gender }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Contact Number:</strong>
                        <p>{{ healthRecord.contact_no }}</p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>

              <!-- Health Information -->
              <v-card class="mb-6" elevation="2">
                <v-card-title class="text-h5 primary--text">
                  <v-icon class="mr-2">mdi-heart</v-icon>
                  Health Information
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <strong>Do you have any allergies?</strong>
                        <p>{{ healthRecord.has_allergies === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you have any diagnosed medical conditions?</strong>
                        <p>{{ healthRecord.has_medical_condition === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Are you currently taking any prescribed medication?</strong>
                        <p>{{ healthRecord.is_taking_medication === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong
                          >Do you have any family health conditions we should know about?</strong
                        >
                        <p>{{ healthRecord.family_conditions === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Have you undergone any surgery or medical operation?</strong>
                        <p>{{ healthRecord.was_operated === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you smoke?</strong>
                        <p>{{ healthRecord.is_smoking === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you consume alcoholic beverages?</strong>
                        <p>{{ healthRecord.is_drinking_alcohol === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you have any eye problems?</strong>
                        <p>{{ healthRecord.has_eye_problems === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you have any hearing problems?</strong>
                        <p>{{ healthRecord.has_hearing_problems === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong
                          >Are you exposed to hazardous substances at home, school, or work?</strong
                        >
                        <p>{{ healthRecord.is_exposed === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>

              <!-- Menstrual History (if applicable) -->
              <v-card v-if="healthRecord.gender === 'female'" class="mb-6" elevation="2">
                <v-card-title class="text-h5 primary--text">
                  <v-icon class="mr-2">mdi-calendar-heart</v-icon>
                  Menstrual History
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <strong>At what age did you start menstruating?</strong>
                        <p>{{ healthRecord.age_of_onset || "Not specified" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>When do you usually feel menstrual pain?</strong>
                        <p>{{ formatPainTiming(healthRecord.pain) }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong
                          >How would you describe the intensity of your menstrual pain?</strong
                        >
                        <p>{{ formatIntensity(healthRecord.intensity_of_pain) }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Are you taking any medication for menstrual pain?</strong>
                        <p>{{ healthRecord.is_taking_medicine === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>

              <!-- Emergency Contact -->
              <v-card class="mb-6" elevation="2">
                <v-card-title class="text-h5 primary--text">
                  <v-icon class="mr-2">mdi-phone-alert</v-icon>
                  Person to Notify in Case of Emergency
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <strong>Full Name:</strong>
                        <p>{{ healthRecord.name }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Relationship to Student:</strong>
                        <p>{{ healthRecord.relationship }}</p>
                      </v-col>
                      <v-col cols="12">
                        <strong>Address:</strong>
                        <p>{{ healthRecord.address }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Contact Number:</strong>
                        <p>{{ healthRecord.contact }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Can we administer first aid if necessary?</strong>
                        <p>{{ healthRecord.first_aid === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Can we give oral medications if needed?</strong>
                        <p>{{ healthRecord.oral_meds === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Should we refer you to a clinic/hospital if required?</strong>
                        <p>{{ healthRecord.referal === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </div>
          </v-tabs-window-item>

          <!-- Tab 3: View Annual Assessment -->
          <v-tabs-window-item value="annual-assessment">
            <div v-if="loadingAssessments" class="text-center pa-8">
              <v-progress-circular indeterminate color="primary" size="64" />
              <p class="mt-4">Loading annual assessments...</p>
            </div>

            <div
              v-else-if="!annualAssessments || annualAssessments.length === 0"
              class="text-center pa-8"
            >
              <v-card class="mx-auto" max-width="600" elevation="2">
                <v-card-text class="pa-8">
                  <v-icon size="64" color="info" class="mb-4">mdi-clipboard-alert</v-icon>
                  <h2 class="text-h5 mb-4">No Annual Assessment Records</h2>
                  <p class="text-body-1">No annual assessment records available at this time.</p>
                </v-card-text>
              </v-card>
            </div>

            <div v-else>
              <v-card
                v-for="(assessment, index) in annualAssessments"
                :key="assessment.id"
                class="mb-6"
                elevation="2"
              >
                <v-card-title class="text-h5 primary--text">
                  <v-icon class="mr-2">mdi-clipboard-check</v-icon>
                  Annual Assessment #{{ index + 1 }}
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <strong>Date of Assessment:</strong>
                        <p>{{ formatDate(assessment.assessment_date) }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Assessed by:</strong>
                        <p>{{ assessment.assessed_by || "Not specified" }}</p>
                      </v-col>
                      <v-col cols="12">
                        <strong>Nurse's Notes:</strong>
                        <p>{{ assessment.nurses_notes || "No notes available" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Height:</strong>
                        <p>{{ assessment.height || "Not recorded" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Weight:</strong>
                        <p>{{ assessment.weight || "Not recorded" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Blood Pressure:</strong>
                        <p>{{ assessment.blood_pressure || "Not recorded" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Temperature:</strong>
                        <p>{{ assessment.temperature || "Not recorded" }}</p>
                      </v-col>
                      <v-col cols="12">
                        <strong>Recommendations:</strong>
                        <p>{{ assessment.recommendations || "No recommendations" }}</p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-container>
    </v-main>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" color="error" timeout="6000" location="top">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/utils/useAuth";
import { client } from "@/utils/useDirectus";
import { readItems } from "@directus/sdk";
import CreateHealthRecord from "../CreateHealthRecord.vue";

const router = useRouter();
const { userData, logout } = useAuth();

// Reactive data
const activeTab = ref("create-record");
const healthRecord = ref(null);
const annualAssessments = ref([]);
const loadingHealthRecord = ref(false);
const loadingAssessments = ref(false);
const hasExistingRecord = ref(false);
const showError = ref(false);
const errorMessage = ref("");

// Computed properties
const studentName = computed(() => {
  if (userData.value) {
    return (
      `${userData.value.first_name || ""} ${userData.value.last_name || ""}`.trim() || "Student"
    );
  }
  return "Student";
});

const studentNumber = computed(() => {
  return userData.value?.student_number || userData.value?.id || "N/A";
});

const studentId = computed(() => {
  return userData.value?.id;
});

// Methods
const handleLogout = async () => {
  try {
    await logout();
    router.push("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

const fetchHealthRecord = async () => {
  if (!studentId.value) return;

  loadingHealthRecord.value = true;
  try {
    const response = await client.request(
      readItems("student_health_record", {
        filter: {
          student_id: {
            _eq: studentId.value,
          },
        },
      })
    );

    if (response && response.length > 0) {
      healthRecord.value = response[0];
      hasExistingRecord.value = true;
    } else {
      healthRecord.value = null;
      hasExistingRecord.value = false;
    }
  } catch (error: any) {
    console.error("Error fetching health record:", error);
    errorMessage.value = "Failed to load health record";
    showError.value = true;
    healthRecord.value = null;
    hasExistingRecord.value = false;
  } finally {
    loadingHealthRecord.value = false;
  }
};

const fetchAnnualAssessments = async () => {
  if (!studentId.value) return;

  loadingAssessments.value = true;
  try {
    const response = await client.request(
      readItems("annual_assessment", {
        filter: {
          student_id: {
            _eq: studentId.value,
          },
        },
        sort: ["-assessment_date"],
      })
    );

    annualAssessments.value = response || [];
  } catch (error: any) {
    console.error("Error fetching annual assessments:", error);
    errorMessage.value = "Failed to load annual assessments";
    showError.value = true;
    annualAssessments.value = [];
  } finally {
    loadingAssessments.value = false;
  }
};

const onRecordCreated = () => {
  hasExistingRecord.value = true;
  fetchHealthRecord();
};

const formatDate = (dateString: string) => {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString();
};

const formatPainTiming = (pain: string) => {
  const timingMap = {
    before: "Before menstruation",
    during: "During menstruation",
    after: "After menstruation",
  };
  return timingMap[pain] || pain || "Not specified";
};

const formatIntensity = (intensity: string) => {
  const intensityMap = {
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
  };
  return intensityMap[intensity] || intensity || "Not specified";
};

// Lifecycle
onMounted(async () => {
  await fetchHealthRecord();
  await fetchAnnualAssessments();
});
</script>

<style scoped>
:deep(.v-tab) {
  text-transform: none;
}

:deep(.v-tabs-bar) {
  background-color: #f5f5f5;
}

.primary--text {
  color: #175833 !important;
}

:deep(.v-app-bar) {
  background-color: #175833 !important;
}

:deep(.v-tab--selected) {
  background-color: rgba(23, 88, 51, 0.1);
}

:deep(.v-card-title) {
  color: #175833;
}

strong {
  color: #175833;
}

p {
  margin-top: 4px;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  :deep(.v-tab) {
    min-width: auto;
    padding: 0 12px;
  }

  :deep(.v-tab .v-icon) {
    margin-right: 4px;
  }
}
</style>
