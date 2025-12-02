<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center mb-6">
      <v-btn
        icon
        variant="text"
        @click="$router.back()"
        class="mr-3"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div>
        <h1 class="text-h4 font-weight-medium">Create Health Record</h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-0">
          Create a comprehensive health record for a student
        </p>
      </div>
    </div>

    <v-row>
      <v-col cols="12" lg="8">
        <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
          <!-- Student Selection -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-account</v-icon>
              Student Information
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
                    hint="Select the student for this health record"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.student_no"
                    label="Student Number"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Personal Information -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-account-details</v-icon>
              Personal Information
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.first_name"
                    label="First Name"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.middle_name"
                    label="Middle Name"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.last_name"
                    label="Last Name"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.birtdate"
                    label="Birth Date"
                    type="date"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Gender <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.gender"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Male"
                      value="male"
                      color="primary"
                    />
                    <v-radio
                      label="Female"
                      value="female"
                      color="primary"
                    />
                    <v-radio
                      label="Other"
                      value="other"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.civil_status"
                    label="Civil Status"
                    :items="['single', 'married', 'divorced', 'widowed']"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.contact_no"
                    label="Contact Number"
                    variant="outlined"
                    :rules="[rules.required, rules.phone]"
                    required
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Medical History -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-medical-bag</v-icon>
              Medical History
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Has Allergies? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.has_allergies"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Has Medical Condition? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.has_medical_condition"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Taking Medication? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.is_taking_medication"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Family Medical Conditions? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.family_conditions"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Previous Operations? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.was_operated"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Lifestyle -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-heart-pulse</v-icon>
              Lifestyle
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Smoking? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.is_smoking"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Drinking Alcohol? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.is_drinking_alcohol"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Health Issues -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-eye</v-icon>
              Health Issues
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Eye Problems? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.has_eye_problems"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Hearing Problems? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.has_hearing_problems"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Environmental Exposure? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.is_exposed"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Pain Assessment (Female Only) -->
          <v-card v-if="formData.gender === 'female'" elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-calendar-heart</v-icon>
              Menstrual History
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="formData.age_of_onset"
                    label="Age of Onset"
                    type="number"
                    variant="outlined"
                    hint="Age when symptoms first appeared"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Pain Occurrence <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.pain"
                    :rules="[rules.required]"
                    required
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Before menstruation"
                      value="before"
                      color="primary"
                    />
                    <v-radio
                      label="During menstruation"
                      value="during"
                      color="primary"
                    />
                    <v-radio
                      label="After menstruation"
                      value="after"
                      color="primary"
                    />
                    <v-radio
                      label="No pain"
                      value="none"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Pain Intensity <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.intensity_of_pain"
                    :rules="[rules.required]"
                    required
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Mild"
                      value="mild"
                      color="primary"
                    />
                    <v-radio
                      label="Moderate"
                      value="moderate"
                      color="primary"
                    />
                    <v-radio
                      label="Severe"
                      value="severe"
                      color="primary"
                    />
                    <v-radio
                      label="No pain"
                      value="none"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Taking Medicine for Pain? <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.is_taking_medicine"
                    :rules="[rules.required]"
                    required
                    inline
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Emergency Contact -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-phone</v-icon>
              Emergency Contact
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.name"
                    label="Contact Name"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.relationship"
                    label="Relationship"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.contact"
                    label="Contact Number"
                    variant="outlined"
                    :rules="[rules.required, rules.phone]"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.address"
                    label="Address"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Medical Preferences -->
          <v-card elevation="2" class="mb-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-medical-bag</v-icon>
              Medical Preferences
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="4">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      First Aid Consent <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.first_aid"
                    :rules="[rules.required]"
                    required
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Oral Medication Consent <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.oral_meds"
                    :rules="[rules.required]"
                    required
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="mb-2">
                    <label class="text-subtitle-1 font-weight-medium">
                      Medical Referral Consent <span class="text-error">*</span>
                    </label>
                  </div>
                  <v-radio-group
                    v-model="formData.referal"
                    :rules="[rules.required]"
                    required
                    density="compact"
                    class="mt-2"
                  >
                    <v-radio
                      label="Yes"
                      value="yes"
                      color="primary"
                    />
                    <v-radio
                      label="No"
                      value="no"
                      color="primary"
                    />
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Action Buttons -->
          <v-card elevation="2">
            <v-card-text class="pa-6">
              <div class="d-flex justify-end gap-3">
                <v-btn
                  variant="outlined"
                  @click="resetForm"
                  :disabled="submitting"
                >
                  Reset
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="submitting"
                  :disabled="!valid"
                >
                  Create Health Record
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-form>
      </v-col>

      <v-col cols="12" lg="4">
        <!-- Progress Indicator -->
        <v-card elevation="2" class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-progress-check</v-icon>
            Form Progress
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex align-center justify-between mb-2">
              <span>Personal Info</span>
              <v-icon :color="isPersonalInfoComplete ? 'success' : 'grey'">
                {{ isPersonalInfoComplete ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
            </div>
            <div class="d-flex align-center justify-between mb-2">
              <span>Medical History</span>
              <v-icon :color="isMedicalHistoryComplete ? 'success' : 'grey'">
                {{ isMedicalHistoryComplete ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
            </div>
            <div class="d-flex align-center justify-between mb-2">
              <span>Emergency Contact</span>
              <v-icon :color="isEmergencyContactComplete ? 'success' : 'grey'">
                {{ isEmergencyContactComplete ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
            </div>
            <div class="d-flex align-center justify-between">
              <span>Medical Preferences</span>
              <v-icon :color="isMedicalPreferencesComplete ? 'success' : 'grey'">
                {{ isMedicalPreferencesComplete ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
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
                prepend-icon="mdi-clipboard-list"
                @click="$router.push('/annual-assessment')"
              >
                Annual Assessment
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
          Health Record Created Successfully
        </v-card-title>
        <v-card-text class="text-center">
          The student health record has been created successfully.
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="primary"
            @click="successDialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createHealthRecord, getStudents } from '@/utils/useDirectus'

const router = useRouter()
const form = ref()
const valid = ref(false)
const submitting = ref(false)
const successDialog = ref(false)
const loadingStudents = ref(false)
const studentOptions = ref<Array<{ title: string; value: string }>>([])

interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
}

const formData = reactive({
  student_id: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  birtdate: '',
  civil_status: '',
  student_no: '',
  gender: '',
  contact_no: '',
  has_allergies: '',
  has_medical_condition: '',
  is_taking_medication: '',
  family_conditions: '',
  was_operated: '',
  is_smoking: '',
  is_drinking_alcohol: '',
  has_eye_problems: '',
  has_hearing_problems: '',
  is_exposed: '',
  age_of_onset: null as number | null,
  pain: '',
  intensity_of_pain: '',
  is_taking_medicine: '',
  name: '',
  address: '',
  relationship: '',
  contact: '',
  first_aid: '',
  oral_meds: '',
  referal: ''
})

const rules = {
  required: (value: any) => !!value || 'This field is required',
  phone: (value: string) => {
    const pattern = /^[\+]?[0-9\-\(\)\s]+$/
    return pattern.test(value) || 'Invalid phone number format'
  }
}

// Progress indicators
const isPersonalInfoComplete = computed(() => {
  return formData.student_id && formData.first_name && formData.last_name &&
         formData.birtdate && formData.gender && formData.civil_status &&
         formData.contact_no && formData.student_no
})

const isMedicalHistoryComplete = computed(() => {
  return formData.has_allergies && formData.has_medical_condition &&
         formData.is_taking_medication && formData.family_conditions &&
         formData.was_operated
})

const isEmergencyContactComplete = computed(() => {
  return formData.name && formData.relationship && formData.contact && formData.address
})

const isMedicalPreferencesComplete = computed(() => {
  return formData.first_aid && formData.oral_meds && formData.referal
})

const fetchStudents = async () => {
  loadingStudents.value = true
  try {
    const students: Student[] = await getStudents()
    studentOptions.value = students.map(student => ({
      title: `${student.first_name} ${student.last_name} (${student.email})`,
      value: student.id
    }))
  } catch (error) {
    console.error('Error fetching students:', error)
    alert('Error loading students. Please refresh the page.')
  } finally {
    loadingStudents.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    student_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    birtdate: '',
    civil_status: '',
    student_no: '',
    gender: '',
    contact_no: '',
    has_allergies: '',
    has_medical_condition: '',
    is_taking_medication: '',
    family_conditions: '',
    was_operated: '',
    is_smoking: '',
    is_drinking_alcohol: '',
    has_eye_problems: '',
    has_hearing_problems: '',
    is_exposed: '',
    age_of_onset: null,
    pain: '',
    intensity_of_pain: '',
    is_taking_medicine: '',
    name: '',
    address: '',
    relationship: '',
    contact: '',
    first_aid: '',
    oral_meds: '',
    referal: ''
  })
  form.value?.resetValidation()
}

const submitForm = async () => {
  if (!valid.value) return

  submitting.value = true

  try {
    // Save to Directus database
    await createHealthRecord(formData)

    successDialog.value = true
    resetForm()
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Error saving health record. Please try again.')
  } finally {
    submitting.value = false
  }
}

// Fetch students when component mounts
onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-1px);
}
</style>
