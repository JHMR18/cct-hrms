<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card class="pa-6">
              <v-card-title class="text-h4 mb-6 text-center">
                Create Health Record
              </v-card-title>

              <v-form ref="healthRecordForm" @submit.prevent="submitForm">
                <!-- Personal Information Section -->
                <v-card class="mb-6" elevation="2">
                  <v-card-title class="text-h5 primary--text">
                    <v-icon class="mr-2">mdi-account</v-icon>
                    Personal Information
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.first_name"
                            label="First Name"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.middle_name"
                            label="Middle Name"
                            variant="outlined"
                            :rules="requiredRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="formData.last_name"
                            label="Last Name"
                            variant="outlined"
                            :rules="requiredRules"
                            required
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
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>

                <!-- Health Information Section -->
                <v-card class="mb-6" elevation="2">
                  <v-card-title class="text-h5 primary--text">
                    <v-icon class="mr-2">mdi-heart</v-icon>
                    Health Information
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.has_allergies"
                            label="Do you have any allergies?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.has_medical_condition"
                            label="Do you have any diagnosed medical conditions?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.is_taking_medication"
                            label="Are you currently taking any prescribed medication?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.family_conditions"
                            label="Do you have any family health conditions we should know about?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.was_operated"
                            label="Have you undergone any surgery or medical operation?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.is_smoking"
                            label="Do you smoke?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.is_drinking_alcohol"
                            label="Do you consume alcoholic beverages?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.has_eye_problems"
                            label="Do you have any eye problems?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.has_hearing_problems"
                            label="Do you have any hearing problems?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.is_exposed"
                            label="Are you exposed to hazardous substances at home, school, or work?"
                            :items="yesNoOptions"
                            variant="outlined"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>

                <!-- Menstrual History Section (Female only) -->
                <v-card v-if="formData.gender === 'female'" class="mb-6" elevation="2">
                  <v-card-title class="text-h5 primary--text">
                    <v-icon class="mr-2">mdi-calendar-heart</v-icon>
                    Menstrual History
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model.number="formData.age_of_onset"
                            label="At what age did you start menstruating?"
                            type="number"
                            variant="outlined"
                            :rules="positiveNumberRules"
                            min="1"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.pain"
                            label="When do you usually feel menstrual pain?"
                            :items="painOptions"
                            variant="outlined"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="formData.intensity_of_pain"
                            label="How would you describe the intensity of your menstrual pain?"
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
                <v-card class="mb-6" elevation="2">
                  <v-card-title class="text-h5 primary--text">
                    <v-icon class="mr-2">mdi-phone-alert</v-icon>
                    Person to Notify in Case of Emergency
                  </v-card-title>
                  <v-card-text>
                    <v-container>
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
                            label="Address"
                            variant="outlined"
                            :rules="requiredRules"
                            rows="3"
                            required
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
                <div class="d-flex justify-end">
                  <v-btn
                    color="secondary"
                    size="large"
                    class="mr-3"
                    @click="$router.push('/student/health-records')"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    :loading="loading"
                  >
                    Create Record
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Success Alert -->
    <v-snackbar
      v-model="showSuccess"
      color="success"
      timeout="4000"
      location="top"
    >
      Health record created successfully!
      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccess = false">Close</v-btn>
      </template>
    </v-snackbar>

    <!-- Error Alert -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="6000"
      location="top"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showError = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { client } from '@/utils/useDirectus'
import { createItem } from '@directus/sdk'
import { useAuth } from '@/utils/useAuth'

const router = useRouter()
const { userData } = useAuth()
const healthRecordForm = ref()
const loading = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const formData = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  birthdate: '',
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

const civilStatusOptions = [
  { title: 'Single', value: 'single' },
  { title: 'Married', value: 'married' },
  { title: 'Widowed', value: 'widowed' },
  { title: 'Other', value: 'other' }
]

const genderOptions = [
  { title: 'Male', value: 'male' },
  { title: 'Female', value: 'female' },
  { title: 'Prefer not to say', value: 'prefer_not_to_say' }
]

const yesNoOptions = [
  { title: 'Yes', value: 'yes' },
  { title: 'No', value: 'no' }
]

const painOptions = [
  { title: 'Before menstruation', value: 'before' },
  { title: 'During menstruation', value: 'during' },
  { title: 'After menstruation', value: 'after' }
]

const intensityOptions = [
  { title: 'Mild', value: 'mild' },
  { title: 'Moderate', value: 'moderate' },
  { title: 'Severe', value: 'severe' }
]

const requiredRules = [
  (v: string) => !!v || 'This field is required'
]

const phoneRules = [
  (v: string) => !!v || 'Phone number is required',
  (v: string) => /^09\d{9}$/.test(v) || 'Please enter a valid Philippine phone number (09XXXXXXXXX)'
]

const positiveNumberRules = [
  (v: number | null) => v === null || v > 0 || 'Must be a positive number'
]

const submitForm = async () => {
  const form = healthRecordForm.value
  if (!form) return

  const { valid } = await form.validate()
  if (!valid) return

  loading.value = true
  errorMessage.value = ''

  try {
    const recordData = {
      ...formData.value,
      student_id: userData.value?.id
    }
    
    await client.request(
      createItem('student_health_record', recordData)
    )

    showSuccess.value = true
    
    setTimeout(() => {
      router.push('/student/health-records')
    }, 2000)
    
  } catch (error: any) {
    console.error('Error creating health record:', error)
    errorMessage.value = error?.message || 'Failed to create health record. Please try again.'
    showError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card-title {
  color: #175833;
}

.primary--text {
  color: #175833 !important;
}

:deep(.v-field--focused .v-field__outline) {
  border-color: #175833;
  border-width: 2px;
}

:deep(.v-btn--color-primary) {
  background-color: #175833 !important;
}

:deep(.v-btn--color-secondary) {
  background-color: #eff316 !important;
  color: #175833 !important;
}
</style>