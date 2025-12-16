<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center mb-6">
      <v-btn icon variant="text" @click="$router.back()" class="mr-3">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div>
        <h1 class="text-h4 font-weight-medium">Annual Health Assessment</h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-0">
          Comprehensive yearly health evaluation
        </p>
      </div>
    </div>

    <v-row>
      <v-col cols="12" lg="8">
        <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
          <!-- Basic Information -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-account</v-icon>
              Basic Information
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.student_id"
                    label="Select Student"
                    :items="studentOptions"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    :rules="[rules.required]"
                    :loading="loadingStudents"
                    required
                    hint="Select the student for this assessment"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.school_year"
                    label="School Year"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                    placeholder="e.g., 2024-2025"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.date_of_examination"
                    label="Date of Examination"
                    type="date"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.name_of_examiner"
                    label="Name of Examiner"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Physical Measurements -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-human-male-height</v-icon>
              Physical Measurements
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="formData.height"
                    label="Height (cm)"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.positiveNumber]"
                    required
                    @input="calculateBMI"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="formData.weight"
                    label="Weight (kg)"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.positiveNumber]"
                    required
                    @input="calculateBMI"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="formData.bmi"
                    label="BMI"
                    variant="outlined"
                    readonly
                    :color="getBMIColor(formData.bmi)"
                    :hint="getBMICategory(formData.bmi)"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Vital Signs -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-heart-pulse</v-icon>
              Vital Signs
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="formData.temperature"
                    label="Temperature (°C)"
                    type="number"
                    step="0.1"
                    variant="outlined"
                    :rules="[rules.required, rules.temperature]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.heart_rate"
                    label="Heart Rate (bpm)"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.heartRate]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.respitory_rate"
                    label="Respiratory Rate (per min)"
                    type="number"
                    variant="outlined"
                    :rules="[rules.required, rules.respiratoryRate]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.blood_pressure"
                    label="Blood Pressure (mmHg)"
                    variant="outlined"
                    :rules="[rules.required, rules.bloodPressure]"
                    required
                    placeholder="e.g., 120/80"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Health Assessment -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-clipboard-check</v-icon>
              Health Assessment
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.general_apperance"
                    label="General Appearance"
                    variant="outlined"
                    rows="3"
                    :rules="[rules.required]"
                    required
                    hint="Describe the overall physical appearance and demeanor"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.has_abnormalities"
                    label="Abnormalities Found"
                    variant="outlined"
                    rows="3"
                    hint="Describe any physical abnormalities or concerns noted"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.is_fit_for_class"
                    label="Fit for Class Activities?"
                    :items="[
                      { title: 'Yes - Fully fit', value: 'yes' },
                      { title: 'Yes - With restrictions', value: 'yes_with_restrictions' },
                      { title: 'No - Medical clearance needed', value: 'no' },
                    ]"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Additional Notes -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-note-text</v-icon>
              Additional Notes
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-textarea
                v-model="formData.remarks"
                label="Remarks"
                variant="outlined"
                rows="4"
                hint="Any additional observations, recommendations, or follow-up notes"
              />
            </v-card-text>
          </v-card>

          <!-- Action Buttons -->
          <v-card elevation="2">
            <v-card-text class="pa-6">
              <div class="d-flex justify-end gap-3">
                <v-btn variant="outlined" @click="resetForm" :disabled="submitting"> Reset </v-btn>
                <v-btn color="primary" type="submit" :loading="submitting" :disabled="!valid">
                  Save Assessment
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-form>
      </v-col>

      <v-col cols="12" lg="4">
        <!-- BMI Reference -->
        <v-card elevation="2" class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-information</v-icon>
            BMI Reference
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex align-center justify-between mb-2">
              <span>Underweight</span>
              <v-chip color="blue" size="small">&lt; 18.5</v-chip>
            </div>
            <div class="d-flex align-center justify-between mb-2">
              <span>Normal weight</span>
              <v-chip color="green" size="small">18.5 - 24.9</v-chip>
            </div>
            <div class="d-flex align-center justify-between mb-2">
              <span>Overweight</span>
              <v-chip color="orange" size="small">25.0 - 29.9</v-chip>
            </div>
            <div class="d-flex align-center justify-between">
              <span>Obese</span>
              <v-chip color="red" size="small">&gt;= 30.0</v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- Vital Signs Reference -->
        <v-card elevation="2" class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-heart-pulse</v-icon>
            Normal Ranges
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="mb-3">
              <strong>Temperature:</strong><br />
              36.1°C - 37.2°C
            </div>
            <div class="mb-3">
              <strong>Heart Rate:</strong><br />
              60-100 bpm (adults)
            </div>
            <div class="mb-3">
              <strong>Respiratory Rate:</strong><br />
              12-20 per minute
            </div>
            <div>
              <strong>Blood Pressure:</strong><br />
              &lt; 120/80 mmHg (normal)
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
                prepend-icon="mdi-clipboard-plus"
                @click="$router.push('/daily-visit')"
              >
                Daily Visit
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
          Assessment Saved Successfully
        </v-card-title>
        <v-card-text class="text-center">
          The annual health assessment has been recorded successfully.
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="successDialog = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { createAnnualAssessment, getStudents } from "@/utils/useDirectus";

const router = useRouter();
const form = ref();
const valid = ref(false);
const submitting = ref(false);
const successDialog = ref(false);
const loadingStudents = ref(false);
const studentOptions = ref<Array<{ title: string; value: string }>>([]);

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const formData = reactive({
  student_id: "",
  school_year: "",
  date_of_examination: new Date().toISOString().split("T")[0],
  height: null as number | null,
  weight: null as number | null,
  bmi: null as number | null,
  temperature: null as number | null,
  heart_rate: "",
  respitory_rate: "",
  blood_pressure: "",
  general_apperance: "",
  has_abnormalities: "",
  is_fit_for_class: "",
  name_of_examiner: "",
  remarks: "",
});

const rules = {
  required: (value: any) => !!value || "This field is required",
  positiveNumber: (value: number) => value > 0 || "Must be a positive number",
  temperature: (value: number) => {
    if (!value) return "Temperature is required";
    if (value < 30 || value > 45) return "Temperature must be between 30-45°C";
    return true;
  },
  heartRate: (value: string) => {
    const num = parseInt(value);
    if (!num || num < 30 || num > 200) return "Heart rate must be between 30-200 bpm";
    return true;
  },
  respiratoryRate: (value: string) => {
    const num = parseInt(value);
    if (!num || num < 5 || num > 50) return "Respiratory rate must be between 5-50 per minute";
    return true;
  },
  bloodPressure: (value: string) => {
    const pattern = /^\d{2,3}\/\d{2,3}$/;
    if (!pattern.test(value)) return "Format: systolic/diastolic (e.g., 120/80)";
    return true;
  },
};

const calculateBMI = () => {
  if (formData.height && formData.weight) {
    const heightInMeters = formData.height / 100;
    formData.bmi = Math.round((formData.weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }
};

const getBMIColor = (bmi: number | null) => {
  if (!bmi) return "grey";
  if (bmi < 18.5) return "blue";
  if (bmi < 25) return "green";
  if (bmi < 30) return "orange";
  return "red";
};

const getBMICategory = (bmi: number | null) => {
  if (!bmi) return "";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

const resetForm = () => {
  Object.assign(formData, {
    student_id: "",
    school_year: "",
    date_of_examination: new Date().toISOString().split("T")[0],
    height: null,
    weight: null,
    bmi: null,
    temperature: null,
    heart_rate: "",
    respitory_rate: "",
    blood_pressure: "",
    general_apperance: "",
    has_abnormalities: "",
    is_fit_for_class: "",
    name_of_examiner: "",
    remarks: "",
  });
  form.value?.resetValidation();
};

const fetchStudents = async () => {
  loadingStudents.value = true;
  try {
    const students: Student[] = await getStudents();
    studentOptions.value = students.map((student) => ({
      title: `${student.first_name} ${student.last_name} (${student.email})`,
      value: student.id,
    }));
  } catch (error) {
    console.error("Error fetching students:", error);
    alert("Error loading students. Please refresh the page.");
  } finally {
    loadingStudents.value = false;
  }
};

const submitForm = async () => {
  if (!valid.value) return;

  submitting.value = true;

  try {
    // Save to Directus database
    await createAnnualAssessment(formData);

    successDialog.value = true;
    resetForm();
    
    // Redirect to list page after success
    setTimeout(() => {
      router.push('/annual-assessments');
    }, 1500);
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error saving annual assessment. Please try again.");
  } finally {
    submitting.value = false;
  }
};

// Fetch students when component mounts
onMounted(() => {
  fetchStudents();
});
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-1px);
}
</style>
