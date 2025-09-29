<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center mb-6">
      <v-btn icon variant="text" @click="$router.back()" class="mr-3">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div>
        <h1 class="text-h4 font-weight-medium">Daily Visit Record</h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-0">Record a new patient daily visit</p>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-clipboard-plus</v-icon>
            Patient Information
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-6">
            <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
              <v-row>
                <!-- Date and Time -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.date_of_visit"
                    label="Date of Visit"
                    type="date"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.time_of_visit"
                    label="Time of Visit"
                    type="time"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>

                <!-- Patient Details -->
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="formData.name"
                    label="Patient Name"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.sex"
                    label="Sex"
                    :items="['Male', 'Female']"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>

                <!-- Department -->
                <v-col cols="12">
                  <v-select
                    v-model="formData.department"
                    label="Department/Course"
                    :items="departments"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>

                <!-- Chief Complaint -->
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.chief_complaint"
                    label="Chief Complaint"
                    variant="outlined"
                    rows="3"
                    :rules="[rules.required]"
                    hint="Describe the main reason for the visit"
                    required
                  />
                </v-col>

                <!-- Treatment -->
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.treatment"
                    label="Treatment Provided"
                    variant="outlined"
                    rows="3"
                    :rules="[rules.required]"
                    hint="Describe the treatment or care provided"
                    required
                  />
                </v-col>

                <!-- Remarks -->
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.remarks"
                    label="Remarks"
                    variant="outlined"
                    rows="2"
                    hint="Additional notes or observations (optional)"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div class="d-flex justify-end gap-3">
                <v-btn variant="outlined" @click="resetForm" :disabled="submitting"> Reset </v-btn>
                <v-btn color="primary" type="submit" :loading="submitting" :disabled="!valid">
                  Save Visit Record
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- Quick Stats -->
        <v-card elevation="2" class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Today's Stats
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex align-center justify-between mb-3">
              <span>Total Visits Today</span>
              <v-chip color="primary">{{ todayStats.totalVisits }}</v-chip>
            </div>
            <div class="d-flex align-center justify-between mb-3">
              <span>Most Common Complaint</span>
              <v-chip color="info" size="small">{{ todayStats.commonComplaint }}</v-chip>
            </div>
            <div class="d-flex align-center justify-between">
              <span>Peak Hour</span>
              <v-chip color="success" size="small">{{ todayStats.peakHour }}</v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Quick Actions -->
        <v-card elevation="2">
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Quick Actions
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex flex-column gap-2">
              <v-btn
                variant="outlined"
                color="info"
                block
                prepend-icon="mdi-clipboard-list"
                @click="$router.push('/annual-assessment')"
              >
                Annual Assessment
              </v-btn>
              <v-btn
                variant="outlined"
                color="success"
                block
                prepend-icon="mdi-account-plus"
                @click="$router.push('/create-health-record')"
              >
                New Health Record
              </v-btn>
              <v-btn
                variant="outlined"
                color="primary"
                block
                prepend-icon="mdi-view-dashboard"
                @click="$router.push('/home')"
              >
                Back to Dashboard
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400">
      <v-card>
        <v-card-title class="text-center">
          <v-icon color="success" size="48" class="mb-2">mdi-check-circle</v-icon>
          <br />
          Visit Recorded Successfully
        </v-card-title>
        <v-card-text class="text-center">
          The daily visit record has been saved successfully.
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="successDialog = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { createDailyVisit } from "@/utils/useDirectus";

const router = useRouter();
const form = ref();
const valid = ref(false);
const submitting = ref(false);
const successDialog = ref(false);

const departments = [
  "BSCS - Bachelor of Science in Computer Science",
  "BSIT - Bachelor of Science in Information Technology",
  "BSE - Bachelor of Science in Education",
  "BSBA - Bachelor of Science in Business Administration",
  "BSN - Bachelor of Science in Nursing",
  "BSCE - Bachelor of Science in Civil Engineering",
  "BSEE - Bachelor of Science in Electrical Engineering",
  "BSA - Bachelor of Science in Accountancy",
  "AB Psychology",
  "AB Communication",
  "Other",
];

const formData = reactive({
  date_of_visit: new Date().toISOString().split("T")[0],
  time_of_visit: new Date().toTimeString().split(" ")[0].substring(0, 5),
  name: "",
  sex: "",
  department: "",
  chief_complaint: "",
  treatment: "",
  remarks: "",
});

const todayStats = ref({
  totalVisits: 12,
  commonComplaint: "Headache",
  peakHour: "10:00 AM",
});

const rules = {
  required: (value: string) => !!value || "This field is required",
};

const resetForm = () => {
  Object.assign(formData, {
    date_of_visit: new Date().toISOString().split("T")[0],
    time_of_visit: new Date().toTimeString().split(" ")[0].substring(0, 5),
    name: "",
    sex: "",
    department: "",
    chief_complaint: "",
    treatment: "",
    remarks: "",
  });
  form.value?.resetValidation();
};

const submitForm = async () => {
  if (!valid.value) return;

  submitting.value = true;

  try {
    // Save to Directus database
    await createDailyVisit(formData);

    successDialog.value = true;
    resetForm();
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error saving daily visit record. Please try again.");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-1px);
}
</style>
