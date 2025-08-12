<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-4">
        <v-row justify="center">
          <v-col cols="12" lg="10">
            <v-card class="pa-4 pa-md-6" elevation="4">
              <v-card-title class="text-h4 mb-6 text-center primary--text">
                <v-icon class="mr-3" size="large">mdi-clipboard-plus</v-icon>
                Create Health Record
              </v-card-title>

              <v-form ref="healthRecordForm" @submit.prevent="submitForm">
                <!-- Personal Information Section -->
                <v-card class="mb-6" elevation="3" color="grey-lighten-5">
                  <v-card-title class="text-h5 primary--text bg-primary-lighten-4 pa-4">
                    <v-icon class="mr-2">mdi-account</v-icon>
                    Personal Information
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.first_name"
                            label="First Name"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                            prepend-inner-icon="mdi-account"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.middle_name"
                            label="Middle Name"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                            prepend-inner-icon="mdi-account"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.last_name"
                            label="Last Name"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                            prepend-inner-icon="mdi-account"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.birthdate"
                            label="Birthdate"
                            type="date"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                            prepend-inner-icon="mdi-calendar"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.civil_status"
                            label="Civil Status"
                            :items="civilStatusOptions"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                            prepend-inner-icon="mdi-heart"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.student_no"
                            label="Student Number"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-select
                            v-model="formData.gender"
                            label="Gender"
                            :items="genderOptions"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.contact_no"
                            label="Contact Number"
                            variant="outlined"
                            :rules="phoneRules"
                            required
                            prepend-inner-icon="mdi-phone"
                            color="primary"
                            class="mb-2"
                            placeholder="09XXXXXXXXX"
                            hint="Enter your 11-digit Philippine mobile number"
                            persistent-hint
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>

                <!-- Health Information Section -->
                <v-card class="mb-6" elevation="3" color="grey-lighten-5">
                  <v-card-title class="text-h5 primary--text bg-primary-lighten-4 pa-4">
                    <v-icon class="mr-2">mdi-heart-pulse</v-icon>
                    Health Information
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.has_allergies"
                            label="Do you have any allergies to medication, food, and other substances?"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-alert-circle"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.has_allergies === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.allergies_details"
                            label="Please specify your allergies"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., Penicillin, Shellfish, Peanuts"
                            hint="List all known allergies"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.has_medical_condition"
                            label="Do you have an ongoing medical condition (i.e. diabetes, heart disease, asthma)?"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-medical-bag"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.has_medical_condition === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.medical_condition_details"
                            label="Please specify your medical condition(s)"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., Type 2 Diabetes, Hypertension"
                            hint="List all medical conditions"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.is_taking_medication"
                            label="Are you currently taking any medication aside from multivitamins?"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-pill"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.is_taking_medication === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.medication_details"
                            label="Please specify medications and dosage"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., Metformin 500mg twice daily"
                            hint="Include medication name and frequency"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.family_conditions"
                            label="Does anyone in your family have health conditions? (Hypertension, Tuberculosis, Cancer, Diabetes, Depression, Stroke, others)"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-account-group"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.family_conditions === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.family_conditions_details"
                            label="Please specify family health conditions"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., Mother - Diabetes, Father - Hypertension"
                            hint="List conditions and family member relationship"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.was_operated"
                            label="Have you had any medical illness or operation in the past 12 months?"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-hospital-box"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.was_operated === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.operation_details"
                            label="Please specify the illness or operation"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., Appendectomy in March 2024"
                            hint="Include type and approximate date"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.is_smoking"
                            label="Do you smoke cigarettes/E-cigarettes?"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-smoking"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.is_smoking === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.smoking_details"
                            label="How frequently do you smoke?"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., 1 pack per day, Occasionally"
                            hint="Specify frequency and amount"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.is_drinking_alcohol"
                            label="Do you drink alcoholic beverages?"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-glass-wine"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.is_drinking_alcohol === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.alcohol_details"
                            label="How frequently do you drink?"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., Occasionally on weekends, Daily"
                            hint="Specify frequency and amount if possible"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.has_eye_problems"
                            label="Do you have eyesight problems / Wear eyeglasses or contact lenses?"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-eye"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.has_eye_problems === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.eye_problems_details"
                            label="Please specify your eye condition"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., Myopia -2.5, Astigmatism"
                            hint="Include prescription if wearing glasses/contacts"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.has_hearing_problems"
                            label="Do you have hearing problems / Ear infections?"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-ear-hearing"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.has_hearing_problems === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.hearing_problems_details"
                            label="Please specify your hearing condition"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., Partial hearing loss, Chronic ear infection"
                            hint="Describe the hearing problem"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.is_exposed"
                            label="Have you been exposed to any communicable disease (chickenpox, TB, etc.)?"
                            :items="yesNoOptions"
                            variant="outlined"
                            prepend-inner-icon="mdi-biohazard"
                            color="primary"
                            class="mb-2"
                          />
                        </v-col>
                        <v-col v-if="formData.is_exposed === 'yes'" cols="12" md="6">
                          <v-text-field
                            v-model="formData.exposure_details"
                            label="Please specify the disease and exposure details"
                            variant="outlined"
                            color="primary"
                            class="mb-2"
                            placeholder="e.g., COVID-19 in January 2024"
                            hint="Include disease name and approximate date"
                            persistent-hint
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>

                <!-- Menstrual History Section (Female only) -->
                <v-card v-if="formData.gender === 'female'" class="mb-6" elevation="3" color="pink-lighten-5">
                  <v-card-title class="text-h5 primary--text bg-pink-lighten-4 pa-4">
                    <v-icon class="mr-2">mdi-calendar-heart</v-icon>
                    Menstrual History
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model.number="formData.age_of_onset"
                            label="Age of onset"
                            type="number"
                            variant="outlined"
                            :rules="positiveNumberRules"
                            min="1"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.pain"
                            label="Pain (before, during, none)"
                            :items="painOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.intensity_of_pain"
                            label="Intensity of pain (mild, moderate, severe, none)"
                            :items="intensityOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.is_taking_medicine"
                            label="Are you taking any medication for menstrual pain?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>

                <!-- Emergency Contact Section -->
                <v-card class="mb-6" elevation="3" color="red-lighten-5">
                  <v-card-title class="text-h5 primary--text bg-red-lighten-4 pa-4">
                    <v-icon class="mr-2">mdi-phone-alert</v-icon>
                    Person to Notify in Case of Emergency
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.name"
                            label="Full Name"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.relationship"
                            label="Relationship to Student"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="formData.address"
                            label="Complete Address"
                            variant="outlined"
                            :rules="requiredRules"
                            rows="3"
                            required
                            prepend-inner-icon="mdi-home"
                            color="primary"
                            class="mb-2"
                            placeholder="House/Unit No., Street, Barangay, City, Province"
                            hint="Please provide complete address for emergency contact"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="formData.contact"
                            label="Contact Number"
                            variant="outlined"
                            :rules="phoneRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-select
                            v-model="formData.first_aid"
                            label="Can we administer first aid if necessary?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-select
                            v-model="formData.oral_meds"
                            label="Can we give oral medications if needed?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-select
                            v-model="formData.referal"
                            label="Should we refer you to a clinic/hospital if required?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>

                <!-- Submit Button -->
                <v-card class="pa-4" elevation="2">
                  <div class="d-flex justify-end flex-wrap gap-3">
                    <v-btn
                      color="grey"
                      size="large"
                      variant="outlined"
                      prepend-icon="mdi-arrow-left"
                      @click="$router.push('/student/health-records')"
                    >
                      Cancel
                    </v-btn>
                    <v-btn 
                      type="submit" 
                      color="primary" 
                      size="large" 
                      :loading="loading"
                      prepend-icon="mdi-content-save"
                      class="px-8"
                    >
                      Create Health Record
                    </v-btn>
                  </div>
                </v-card>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Success Alert -->
    <v-snackbar v-model="showSuccess" color="success" timeout="4000" location="top">
      Health record created successfully!
      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccess = false">Close</v-btn>
      </template>
    </v-snackbar>

    <!-- Error Alert -->
    <v-snackbar v-model="showError" color="error" timeout="6000" location="top">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { client } from "@/utils/useDirectus";
import { createItem } from "@directus/sdk";
import { useAuth } from "@/utils/useAuth";

const router = useRouter();
const { userData } = useAuth();
const healthRecordForm = ref();
const loading = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

const formData = ref({
  first_name: "",
  middle_name: "",
  last_name: "",
  birthdate: "",
  civil_status: "",
  student_no: "",
  gender: "",
  contact_no: "",
  has_allergies: "",
  allergies_details: "",
  has_medical_condition: "",
  medical_condition_details: "",
  is_taking_medication: "",
  medication_details: "",
  family_conditions: "",
  family_conditions_details: "",
  was_operated: "",
  operation_details: "",
  is_smoking: "",
  smoking_details: "",
  is_drinking_alcohol: "",
  alcohol_details: "",
  has_eye_problems: "",
  eye_problems_details: "",
  has_hearing_problems: "",
  hearing_problems_details: "",
  is_exposed: "",
  exposure_details: "",
  age_of_onset: null,
  pain: "",
  intensity_of_pain: "",
  is_taking_medicine: "",
  name: "",
  address: "",
  relationship: "",
  contact: "",
  first_aid: "",
  oral_meds: "",
  referal: "",
});

const civilStatusOptions = [
  { title: "Single", value: "single" },
  { title: "Married", value: "married" },
  { title: "Widowed", value: "widowed" },
  { title: "Other", value: "other" },
];

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Prefer not to say", value: "prefer_not_to_say" },
];

const yesNoOptions = [
  { title: "Yes", value: "yes" },
  { title: "No", value: "no" },
];

const painOptions = [
  { title: "Before menstruation", value: "before" },
  { title: "During menstruation", value: "during" },
  { title: "After menstruation", value: "after" },
];

const intensityOptions = [
  { title: "Mild", value: "mild" },
  { title: "Moderate", value: "moderate" },
  { title: "Severe", value: "severe" },
];

const requiredRules = [(v: string) => !!v || "This field is required"];

const phoneRules = [
  (v: string) => !!v || "Phone number is required",
  (v: string) =>
    /^09\d{9}$/.test(v) || "Please enter a valid Philippine phone number (09XXXXXXXXX)",
];

const positiveNumberRules = [
  (v: number | null) => v === null || v > 0 || "Must be a positive number",
];

const submitForm = async () => {
  const form = healthRecordForm.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    const recordData = {
      ...formData.value,
      student_id: userData.value?.id,
    };

    await client.request(createItem("student_health_record", recordData));

    showSuccess.value = true;

    setTimeout(() => {
      router.push("/student/health-records");
    }, 2000);
  } catch (error: any) {
    console.error("Error creating health record:", error);
    errorMessage.value = error?.message || "Failed to create health record. Please try again.";
    showError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-card-title {
  color: #175833;
}

.primary--text {
  color: #175833 !important;
}

:deep(.v-field--focused .v-field__outline) {
  border-color: #175833 !important;
  border-width: 2px !important;
}

:deep(.v-btn--color-primary) {
  background-color: #175833 !important;
}

:deep(.v-btn--color-secondary) {
  background-color: #eff316 !important;
  color: #175833 !important;
}

:deep(.v-input--density-compact) {
  --v-input-control-height: 40px;
}

:deep(.v-card-title) {
  font-weight: 600;
}

:deep(.v-field) {
  border-radius: 8px;
}

:deep(.v-btn) {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

.bg-primary-lighten-4 {
  background-color: rgba(23, 88, 51, 0.1) !important;
}

.bg-pink-lighten-4 {
  background-color: rgba(233, 30, 99, 0.1) !important;
}

.bg-red-lighten-4 {
  background-color: rgba(244, 67, 54, 0.1) !important;
}

.gap-3 {
  gap: 12px;
}
</style>
