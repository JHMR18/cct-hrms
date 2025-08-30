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
              <!-- Edit Button -->
              <div class="d-flex justify-end mb-4">
                <v-btn
                  v-if="!isEditing"
                  color="primary"
                  @click="startEditing"
                  prepend-icon="mdi-pencil"
                >
                  Edit Health Record
                </v-btn>
                <div v-else class="d-flex gap-2">
                  <v-btn
                    color="success"
                    @click="saveChanges"
                    :loading="saving"
                    prepend-icon="mdi-check"
                  >
                    Save Changes
                  </v-btn>
                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="cancelEditing"
                    prepend-icon="mdi-close"
                  >
                    Cancel
                  </v-btn>
                </div>
              </div>

              <!-- Personal Information -->
              <v-card class="mb-6" elevation="3" color="grey-lighten-5">
                <v-card-title class="text-h5 primary--text bg-primary-lighten-4 pa-4">
                  <v-icon class="mr-2">mdi-account</v-icon>
                  Personal Information
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <strong>First Name:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model="editData.first_name"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.first_name }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Middle Name:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model="editData.middle_name"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.middle_name }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Last Name:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model="editData.last_name"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.last_name }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Birthdate:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model="editData.birthdate"
                          type="date"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ formatDate(healthRecord.birthdate) }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Civil Status:</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.civil_status"
                          :items="civilStatusOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ formatCivilStatus(healthRecord.civil_status) }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Student Number:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model="editData.student_no"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          readonly
                        />
                        <p v-else>{{ healthRecord.student_no }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Gender:</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.gender"
                          :items="genderOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ formatGender(healthRecord.gender) }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Contact Number:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model="editData.contact_no"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.contact_no }}</p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>

              <!-- Health Information -->
              <v-card class="mb-6" elevation="3" color="grey-lighten-5">
                <v-card-title class="text-h5 primary--text bg-primary-lighten-4 pa-4">
                  <v-icon class="mr-2">mdi-heart-pulse</v-icon>
                  Health Information
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <strong>Do you have any allergies to medication, food, and other substances?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.has_allergies"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.has_allergies === "yes" ? "Yes" : "No" }}</p>
                        <div v-if="healthRecord.has_allergies === 'yes' || (isEditing && editData.has_allergies === 'yes')" class="mt-2">
                          <strong class="text-body-2">Details:</strong>
                          <v-text-field
                            v-if="isEditing"
                            v-model="editData.allergies_details"
                            label="Specify allergies"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            class="mt-1"
                          />
                          <p v-else class="text-body-2 ml-2">{{ healthRecord.allergies_details || 'Not specified' }}</p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you have an ongoing medical condition (i.e. diabetes, heart disease, asthma)?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.has_medical_condition"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.has_medical_condition === "yes" ? "Yes" : "No" }}</p>
                        <div v-if="healthRecord.has_medical_condition === 'yes' || (isEditing && editData.has_medical_condition === 'yes')" class="mt-2">
                          <strong class="text-body-2">Details:</strong>
                          <v-text-field
                            v-if="isEditing"
                            v-model="editData.medical_condition_details"
                            label="Specify medical conditions"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            class="mt-1"
                          />
                          <p v-else class="text-body-2 ml-2">{{ healthRecord.medical_condition_details || 'Not specified' }}</p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Are you currently taking any medication aside from multivitamins?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.is_taking_medication"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.is_taking_medication === "yes" ? "Yes" : "No" }}</p>
                        <div v-if="healthRecord.is_taking_medication === 'yes' || (isEditing && editData.is_taking_medication === 'yes')" class="mt-2">
                          <strong class="text-body-2">Details:</strong>
                          <v-text-field
                            v-if="isEditing"
                            v-model="editData.medication_details"
                            label="Specify medications"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            class="mt-1"
                          />
                          <p v-else class="text-body-2 ml-2">{{ healthRecord.medication_details || 'Not specified' }}</p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Does anyone in your family have any of these conditions (Hypertension, Tuberculosis, Cancer, Diabetes, Depression, Stroke)?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.family_conditions"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.family_conditions === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Have you had any medical illness or operation in the past 12 months?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.was_operated"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.was_operated === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you smoke cigarettes/E-cigarettes?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.is_smoking"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.is_smoking === "yes" ? "Yes" : "No" }}</p>
                        <div v-if="healthRecord.is_smoking === 'yes' || (isEditing && editData.is_smoking === 'yes')" class="mt-2">
                          <strong class="text-body-2">Frequency:</strong>
                          <v-text-field
                            v-if="isEditing"
                            v-model="editData.smoking_details"
                            label="Smoking frequency"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            class="mt-1"
                          />
                          <p v-else class="text-body-2 ml-2">{{ healthRecord.smoking_details || 'Not specified' }}</p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you drink alcoholic beverages?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.is_drinking_alcohol"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.is_drinking_alcohol === "yes" ? "Yes" : "No" }}</p>
                        <div v-if="healthRecord.is_drinking_alcohol === 'yes' || (isEditing && editData.is_drinking_alcohol === 'yes')" class="mt-2">
                          <strong class="text-body-2">Frequency:</strong>
                          <v-text-field
                            v-if="isEditing"
                            v-model="editData.alcohol_details"
                            label="Drinking frequency"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            class="mt-1"
                          />
                          <p v-else class="text-body-2 ml-2">{{ healthRecord.alcohol_details || 'Not specified' }}</p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you have eyesight problems / Wear eyeglasses or contact lenses?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.has_eye_problems"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.has_eye_problems === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Do you have hearing problems / Ear infections?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.has_hearing_problems"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.has_hearing_problems === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Have you been exposed to any communicable disease (chickenpox, TB, Tuberculosis)?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.is_exposed"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.is_exposed === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>

              <!-- Menstrual History (if applicable) -->
              <v-card v-if="healthRecord.gender === 'female'" class="mb-6" elevation="3" color="pink-lighten-5">
                <v-card-title class="text-h5 primary--text bg-pink-lighten-4 pa-4">
                  <v-icon class="mr-2">mdi-calendar-heart</v-icon>
                  Menstrual History
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <strong>Age of onset:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model.number="editData.age_of_onset"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          min="1"
                        />
                        <p v-else>{{ healthRecord.age_of_onset || "Not specified" }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Pain (before, during, after):</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.pain"
                          :items="painOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ formatPainTiming(healthRecord.pain) }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Intensity of pain (mild, moderate, severe):</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.intensity_of_pain"
                          :items="intensityOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ formatIntensity(healthRecord.intensity_of_pain) }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Are you taking any medication for menstrual pain?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.is_taking_medicine"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.is_taking_medicine === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>

              <!-- Emergency Contact -->
              <v-card class="mb-6" elevation="3" color="red-lighten-5">
                <v-card-title class="text-h5 primary--text bg-red-lighten-4 pa-4">
                  <v-icon class="mr-2">mdi-phone-alert</v-icon>
                  Person to Notify in Case of Emergency
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <strong>Full Name:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model="editData.name"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.name }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Relationship to Student:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model="editData.relationship"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.relationship }}</p>
                      </v-col>
                      <v-col cols="12">
                        <strong>Address:</strong>
                        <v-textarea
                          v-if="isEditing"
                          v-model="editData.address"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          rows="2"
                        />
                        <p v-else>{{ healthRecord.address }}</p>
                      </v-col>
                      <v-col cols="12" md="6">
                        <strong>Contact Number:</strong>
                        <v-text-field
                          v-if="isEditing"
                          v-model="editData.contact"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.contact }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Can we administer first aid if necessary?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.first_aid"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.first_aid === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Can we give oral medications if needed?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.oral_meds"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.oral_meds === "yes" ? "Yes" : "No" }}</p>
                      </v-col>
                      <v-col cols="12" md="4">
                        <strong>Should we refer you to a clinic/hospital if required?</strong>
                        <v-select
                          v-if="isEditing"
                          v-model="editData.referal"
                          :items="yesNoOptions"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                        />
                        <p v-else>{{ healthRecord.referal === "yes" ? "Yes" : "No" }}</p>
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

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccess" color="success" timeout="4000" location="top">
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccess = false">Close</v-btn>
      </template>
    </v-snackbar>

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
import { readItems, updateItem } from "@directus/sdk";
import CreateHealthRecord from "../CreateHealthRecord.vue";

const router = useRouter();
const { userData, logout } = useAuth();

// Reactive data
const activeTab = ref("create-record");
const healthRecord = ref<any>(null);
const annualAssessments = ref<any[]>([]);
const loadingHealthRecord = ref(false);
const loadingAssessments = ref(false);
const hasExistingRecord = ref(false);
const showError = ref(false);
const errorMessage = ref("");
const isEditing = ref(false);
const editData = ref<any>({});
const saving = ref(false);
const showSuccess = ref(false);
const successMessage = ref("");

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
      readItems("anual_assessment", {
        filter: {
          student_id: {
            _eq: studentId.value,
          },
        },
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
  const timingMap: Record<string, string> = {
    before: "Before menstruation",
    during: "During menstruation",
    after: "After menstruation",
  };
  return timingMap[pain] || pain || "Not specified";
};

const formatIntensity = (intensity: string) => {
  const intensityMap: Record<string, string> = {
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
  };
  return intensityMap[intensity] || intensity || "Not specified";
};

const formatCivilStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    single: "Single",
    married: "Married",
    widowed: "Widowed",
    other: "Other",
  };
  return statusMap[status] || status || "Not specified";
};

const formatGender = (gender: string) => {
  const genderMap: Record<string, string> = {
    male: "Male",
    female: "Female",
    prefer_not_to_say: "Prefer not to say",
  };
  return genderMap[gender] || gender || "Not specified";
};

// Form options
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

// Edit functionality
const startEditing = () => {
  isEditing.value = true;
  editData.value = healthRecord.value ? { ...healthRecord.value } : {};
};

const cancelEditing = () => {
  isEditing.value = false;
  editData.value = {};
};

const saveChanges = async () => {
  if (!healthRecord.value?.id) return;
  
  saving.value = true;
  try {
    await client.request(
      updateItem("student_health_record", healthRecord.value.id, editData.value)
    );
    
    // Update the healthRecord with new data
    healthRecord.value = { ...healthRecord.value, ...editData.value };
    
    isEditing.value = false;
    editData.value = {};
    successMessage.value = "Health record updated successfully!";
    showSuccess.value = true;
  } catch (error: any) {
    console.error("Error updating health record:", error);
    errorMessage.value = "Failed to update health record. Please try again.";
    showError.value = true;
  } finally {
    saving.value = false;
  }
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
  font-weight: 600;
}

strong {
  color: #175833;
  font-weight: 600;
}

p {
  margin-top: 4px;
  margin-bottom: 16px;
  color: #424242;
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

.gap-2 {
  gap: 8px;
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
