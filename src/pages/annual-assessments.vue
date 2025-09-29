<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-medium">Annual Assessments Management</h1>
        <p class="text-subtitle-1 text-medium-emphasis mb-0">
          View and manage all student annual health assessments
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="$router.push('/annual-assessment')"
      >
        New Assessment
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-clipboard-list</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ totalAssessments }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Total Assessments</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="success" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-check-circle</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ studentsRitForClass }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Fit for Class</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="info" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-calendar-today</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ thisYearAssessments }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">This Year</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="warning" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-human-male-height</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ averageBMI }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Average BMI</p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center justify-between">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-clipboard-list</v-icon>
          Annual Assessment Records
        </div>
        <div class="d-flex align-center gap-2">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search assessments..."
            single-line
            hide-details
            density="compact"
            style="max-width: 300px;"
          />
          <v-btn
            icon
            @click="refreshData"
            :loading="loading"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-divider />

      <v-data-table
        :headers="headers"
        :items="filteredAssessments"
        :loading="loading"
        :search="search"
        class="elevation-0"
        :items-per-page="10"
      >
        <template v-slot:item.student_info="{ item }">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="32" class="mr-3">
              <v-icon color="white" size="small">mdi-account</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">Student ID: {{ item.student_id }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.school_year }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.date_of_examination="{ item }">
          <v-chip color="primary" size="small">
            {{ formatDate(item.date_of_examination) }}
          </v-chip>
        </template>

        <template v-slot:item.measurements="{ item }">
          <div class="d-flex flex-column gap-1">
            <div class="text-caption">
              <strong>Height:</strong> {{ item.height }}cm
            </div>
            <div class="text-caption">
              <strong>Weight:</strong> {{ item.weight }}kg
            </div>
            <div class="text-caption">
              <strong>BMI:</strong>
              <v-chip :color="getBMIColor(item.bmi)" size="x-small" class="ml-1">
                {{ item.bmi }}
              </v-chip>
            </div>
          </div>
        </template>

        <template v-slot:item.vital_signs="{ item }">
          <div class="d-flex flex-column gap-1">
            <div class="text-caption">
              <strong>Temp:</strong> {{ item.temperature }}°C
            </div>
            <div class="text-caption">
              <strong>HR:</strong> {{ item.heart_rate }} bpm
            </div>
            <div class="text-caption">
              <strong>BP:</strong> {{ item.blood_pressure }}
            </div>
            <div class="text-caption">
              <strong>RR:</strong> {{ item.respitory_rate }}/min
            </div>
          </div>
        </template>

        <template v-slot:item.is_fit_for_class="{ item }">
          <v-chip
            :color="getFitnessColor(item.is_fit_for_class)"
            size="small"
          >
            <v-icon start size="small">{{ getFitnessIcon(item.is_fit_for_class) }}</v-icon>
            {{ getFitnessText(item.is_fit_for_class) }}
          </v-chip>
        </template>

        <template v-slot:item.name_of_examiner="{ item }">
          <div class="d-flex align-center">
            <v-icon color="success" size="small" class="mr-1">mdi-doctor</v-icon>
            {{ item.name_of_examiner }}
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn
              icon
              size="small"
              color="primary"
              @click="viewDetails(item)"
            >
              <v-icon size="small">mdi-eye</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="success"
              @click="editAssessment(item)"
            >
              <v-icon size="small">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="error"
              @click="deleteAssessment(item)"
            >
              <v-icon size="small">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="text-center py-8">
            <v-icon size="64" color="grey" class="mb-4">
              mdi-clipboard-remove
            </v-icon>
            <h3 class="text-h6 mb-2">No annual assessments found</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Get started by creating your first annual assessment
            </p>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="$router.push('/annual-assessment')"
            >
              Create Assessment
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="1000">
      <v-card v-if="selectedAssessment">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-clipboard-text</v-icon>
          Annual Assessment Details
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row>
            <!-- Basic Information -->
            <v-col cols="12">
              <h4 class="text-h6 mb-3">Basic Information</h4>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-3">
                <strong>Student ID:</strong><br />
                {{ selectedAssessment.student_id }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-3">
                <strong>School Year:</strong><br />
                {{ selectedAssessment.school_year }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-3">
                <strong>Examination Date:</strong><br />
                {{ formatDate(selectedAssessment.date_of_examination) }}
              </div>
            </v-col>

            <!-- Physical Measurements -->
            <v-col cols="12">
              <h4 class="text-h6 mb-3 mt-4">Physical Measurements</h4>
            </v-col>
            <v-col cols="12" md="3">
              <div class="mb-3">
                <strong>Height:</strong><br />
                {{ selectedAssessment.height }} cm
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="mb-3">
                <strong>Weight:</strong><br />
                {{ selectedAssessment.weight }} kg
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="mb-3">
                <strong>BMI:</strong><br />
                <v-chip :color="getBMIColor(selectedAssessment.bmi)" size="small">
                  {{ selectedAssessment.bmi }}
                </v-chip>
              </div>
            </v-col>

            <!-- Vital Signs -->
            <v-col cols="12">
              <h4 class="text-h6 mb-3 mt-4">Vital Signs</h4>
            </v-col>
            <v-col cols="12" md="3">
              <div class="mb-3">
                <strong>Temperature:</strong><br />
                {{ selectedAssessment.temperature }}°C
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="mb-3">
                <strong>Heart Rate:</strong><br />
                {{ selectedAssessment.heart_rate }} bpm
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="mb-3">
                <strong>Blood Pressure:</strong><br />
                {{ selectedAssessment.blood_pressure }}
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="mb-3">
                <strong>Respiratory Rate:</strong><br />
                {{ selectedAssessment.respitory_rate }}/min
              </div>
            </v-col>

            <!-- Assessment Results -->
            <v-col cols="12">
              <h4 class="text-h6 mb-3 mt-4">Assessment Results</h4>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <strong>General Appearance:</strong><br />
                {{ selectedAssessment.general_apperance }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <strong>Fit for Class:</strong><br />
                <v-chip :color="getFitnessColor(selectedAssessment.is_fit_for_class)" size="small">
                  {{ getFitnessText(selectedAssessment.is_fit_for_class) }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="mb-3">
                <strong>Abnormalities:</strong><br />
                {{ selectedAssessment.has_abnormalities || 'None reported' }}
              </div>
            </v-col>
            <v-col cols="12">
              <div class="mb-3">
                <strong>Examiner:</strong><br />
                {{ selectedAssessment.name_of_examiner }}
              </div>
            </v-col>
            <v-col cols="12" v-if="selectedAssessment.remarks">
              <div class="mb-3">
                <strong>Remarks:</strong><br />
                {{ selectedAssessment.remarks }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn @click="detailsDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAnnualAssessments } from '@/utils/useDirectus'

const router = useRouter()
const loading = ref(false)
const search = ref('')
const detailsDialog = ref(false)
const selectedAssessment = ref(null)

const assessments = ref<any[]>([])

const headers = [
  { title: 'Student', key: 'student_info', sortable: true },
  { title: 'Exam Date', key: 'date_of_examination', sortable: true },
  { title: 'Measurements', key: 'measurements', sortable: false },
  { title: 'Vital Signs', key: 'vital_signs', sortable: false },
  { title: 'Fitness Status', key: 'is_fit_for_class', sortable: true },
  { title: 'Examiner', key: 'name_of_examiner', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

// Computed statistics
const totalAssessments = computed(() => assessments.value.length)

const studentsRitForClass = computed(() =>
  assessments.value.filter(assessment => assessment.is_fit_for_class === 'yes').length
)

const thisYearAssessments = computed(() => {
  const currentYear = new Date().getFullYear()
  return assessments.value.filter(assessment => {
    const examYear = new Date(assessment.date_of_examination).getFullYear()
    return examYear === currentYear
  }).length
})

const averageBMI = computed(() => {
  const validBMIs = assessments.value
    .map(a => parseFloat(a.bmi))
    .filter(bmi => !isNaN(bmi) && bmi > 0)

  if (validBMIs.length === 0) return 'N/A'

  const avg = validBMIs.reduce((sum, bmi) => sum + bmi, 0) / validBMIs.length
  return avg.toFixed(1)
})

const filteredAssessments = computed(() => {
  if (!search.value) return assessments.value

  const searchLower = search.value.toLowerCase()
  return assessments.value.filter(assessment =>
    assessment.student_id?.toLowerCase().includes(searchLower) ||
    assessment.school_year?.toLowerCase().includes(searchLower) ||
    assessment.name_of_examiner?.toLowerCase().includes(searchLower)
  )
})

const fetchAssessments = async () => {
  loading.value = true
  try {
    const data = await getAnnualAssessments()
    assessments.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching assessments:', error)
    alert('Error loading annual assessments. Please try again.')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchAssessments()
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const getBMIColor = (bmi: number) => {
  if (!bmi) return 'grey'
  if (bmi < 18.5) return 'blue'
  if (bmi < 25) return 'green'
  if (bmi < 30) return 'orange'
  return 'red'
}

const getFitnessColor = (fitness: string) => {
  switch (fitness) {
    case 'yes': return 'success'
    case 'yes_with_restrictions': return 'warning'
    case 'no': return 'error'
    default: return 'grey'
  }
}

const getFitnessIcon = (fitness: string) => {
  switch (fitness) {
    case 'yes': return 'mdi-check-circle'
    case 'yes_with_restrictions': return 'mdi-alert-circle'
    case 'no': return 'mdi-close-circle'
    default: return 'mdi-help-circle'
  }
}

const getFitnessText = (fitness: string) => {
  switch (fitness) {
    case 'yes': return 'Fit'
    case 'yes_with_restrictions': return 'Fit with Restrictions'
    case 'no': return 'Not Fit'
    default: return 'Unknown'
  }
}

const viewDetails = (assessment: any) => {
  selectedAssessment.value = assessment
  detailsDialog.value = true
}

const editAssessment = (assessment: any) => {
  // TODO: Implement edit functionality
  console.log('Edit assessment:', assessment)
  alert('Edit functionality will be implemented in the next update.')
}

const deleteAssessment = (assessment: any) => {
  // TODO: Implement delete functionality
  if (confirm('Are you sure you want to delete this assessment record?')) {
    console.log('Delete assessment:', assessment)
    alert('Delete functionality will be implemented in the next update.')
  }
}

onMounted(() => {
  fetchAssessments()
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
