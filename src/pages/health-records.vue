<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="font-weight-medium">
        CCT Health Record Management System
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? "mdi-white-balance-sunny" : "mdi-weather-night" }}</v-icon>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="36">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="userData">
            <v-list-item-title class="font-weight-medium">
              {{ userData.first_name }} {{ userData.last_name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ userData.email }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider v-if="userData" />
          <v-list-item @click="handleLogout" :disabled="logoutLoading">
            <v-list-item-title>
              <v-icon start>{{ logoutLoading ? "mdi-loading mdi-spin" : "mdi-logout" }}</v-icon>
              {{ logoutLoading ? "Logging out..." : "Logout" }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item 
          prepend-icon="mdi-view-dashboard" 
          title="Dashboard" 
          value="dashboard"
          @click="$router.push('/home')"
        />
        <v-list-item
          prepend-icon="mdi-account-heart"
          title="Health Records"
          value="health-records"
          active
        />
        <v-list-item
          prepend-icon="mdi-calendar-check"
          title="Daily Visits"
          value="daily-visits"
          @click="$router.push('/daily-visits')"
        />
        <v-list-item
          prepend-icon="mdi-clipboard-list"
          title="Annual Assessments"
          value="annual-assessments"
          @click="$router.push('/annual-assessments')"
        />
        <v-list-item
          prepend-icon="mdi-bullhorn"
          title="Announcements"
          value="announcements"
          @click="$router.push('/announcements')"
        />
        <v-list-item prepend-icon="mdi-chart-line" title="Reports" value="reports" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <div class="mb-6">
          <h1 class="text-h4 font-weight-medium">Health Records Management</h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-0">
            View and manage all student health records
          </p>
        </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-account-heart</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ totalRecords }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Total Records</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="warning" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-alert-circle</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ recordsWithAllergies }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">With Allergies</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="error" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-medical-bag</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ recordsWithConditions }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Medical Conditions</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="info" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-pill</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ recordsOnMedication }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">On Medication</p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center justify-between">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-account-heart</v-icon>
          Student Health Records
        </div>
        <div class="d-flex align-center gap-2">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search records..."
            single-line
            hide-details
            density="compact"
            style="min-width: 400px;"
          />
          <v-btn
            icon
            @click="refreshData"
            :loading="loading"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="$router.push('/create-health-record')"
          >
            New Health Record
          </v-btn>
        </div>
      </v-card-title>
      <v-divider />

      <v-data-table
        :headers="headers"
        :items="filteredRecords"
        :loading="loading"
        :search="search"
        class="elevation-0"
        :items-per-page="10"
      >
        <template v-slot:item.full_name="{ item }">
          <div class="d-flex align-center">
            <v-avatar :color="item.gender === 'male' ? 'blue' : 'pink'" size="32" class="mr-3">
              <v-icon color="white" size="small">
                {{ item.gender === 'male' ? 'mdi-gender-male' : 'mdi-gender-female' }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.first_name }} {{ item.last_name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.student_no }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.birtdate="{ item }">
          <div>
            {{ formatDate(item.birtdate) }}
            <div class="text-caption text-medium-emphasis">
              Age: {{ calculateAge(item.birtdate) }}
            </div>
          </div>
        </template>

        <template v-slot:item.contact_no="{ item }">
          <v-chip color="info" size="small" variant="outlined">
            {{ item.contact_no }}
          </v-chip>
        </template>

        <template v-slot:item.health_status="{ item }">
          <div class="d-flex flex-column gap-1">
            <v-chip
              v-if="item.has_allergies === 'yes'"
              color="warning"
              size="x-small"
              label
            >
              Allergies
            </v-chip>
            <v-chip
              v-if="item.has_medical_condition === 'yes'"
              color="error"
              size="x-small"
              label
            >
              Medical Condition
            </v-chip>
            <v-chip
              v-if="item.is_taking_medication === 'yes'"
              color="info"
              size="x-small"
              label
            >
              On Medication
            </v-chip>
            <v-chip
              v-if="!hasHealthIssues(item)"
              color="success"
              size="x-small"
              label
            >
              Healthy
            </v-chip>
          </div>
        </template>

        <template v-slot:item.emergency_contact="{ item }">
          <div>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.relationship }}</div>
            <div class="text-caption">{{ item.contact }}</div>
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
              @click="editRecord(item)"
            >
              <v-icon size="small">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="error"
              @click="deleteRecord(item)"
            >
              <v-icon size="small">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="text-center py-8">
            <v-icon size="64" color="grey" class="mb-4">
              mdi-account-remove
            </v-icon>
            <h3 class="text-h6 mb-2">No health records found</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Get started by creating your first health record
            </p>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="$router.push('/create-health-record')"
            >
              Create Health Record
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="1000">
      <v-card v-if="selectedRecord">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-account-heart</v-icon>
          Health Record Details - {{ selectedRecord.first_name }} {{ selectedRecord.last_name }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row>
            <!-- Personal Information -->
            <v-col cols="12">
              <h4 class="text-h6 mb-3">Personal Information</h4>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-3">
                <strong>Full Name:</strong><br />
                {{ selectedRecord.first_name }} {{ selectedRecord.middle_name }} {{ selectedRecord.last_name }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-3">
                <strong>Student Number:</strong><br />
                {{ selectedRecord.student_no }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-3">
                <strong>Birth Date:</strong><br />
                {{ formatDate(selectedRecord.birtdate) }} (Age: {{ calculateAge(selectedRecord.birtdate) }})
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-3">
                <strong>Gender:</strong><br />
                {{ selectedRecord.gender }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-3">
                <strong>Civil Status:</strong><br />
                {{ selectedRecord.civil_status }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-3">
                <strong>Contact Number:</strong><br />
                {{ selectedRecord.contact_no }}
              </div>
            </v-col>

            <!-- Medical History -->
            <v-col cols="12">
              <h4 class="text-h6 mb-3 mt-4">Medical History</h4>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <strong>Allergies:</strong>
                <v-chip :color="selectedRecord.has_allergies === 'yes' ? 'warning' : 'success'" size="small" class="ml-2">
                  {{ selectedRecord.has_allergies === 'yes' ? 'Yes' : 'No' }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <strong>Medical Conditions:</strong>
                <v-chip :color="selectedRecord.has_medical_condition === 'yes' ? 'error' : 'success'" size="small" class="ml-2">
                  {{ selectedRecord.has_medical_condition === 'yes' ? 'Yes' : 'No' }}
                </v-chip>
              </div>
            </v-col>

            <!-- Emergency Contact -->
            <v-col cols="12">
              <h4 class="text-h6 mb-3 mt-4">Emergency Contact</h4>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <strong>Contact Name:</strong><br />
                {{ selectedRecord.name }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <strong>Relationship:</strong><br />
                {{ selectedRecord.relationship }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <strong>Contact Number:</strong><br />
                {{ selectedRecord.contact }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-3">
                <strong>Address:</strong><br />
                {{ selectedRecord.address }}
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
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuth } from '@/utils/useAuth'
import { getHealthRecords } from '@/utils/useDirectus'

const router = useRouter()
const theme = useTheme()
const { logout: authLogout, userData } = useAuth()

const drawer = ref(false)
const isDark = computed(() => theme.current.value.dark)
const logoutLoading = ref(false)
const loading = ref(false)
const search = ref('')
const detailsDialog = ref(false)
const selectedRecord = ref(null)

const records = ref<any[]>([])

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const handleLogout = async () => {
  try {
    logoutLoading.value = true
    await authLogout()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    logoutLoading.value = false
  }
}

const headers = [
  { title: 'Student', key: 'full_name', sortable: true },
  { title: 'Birth Date', key: 'birtdate', sortable: true },
  { title: 'Contact', key: 'contact_no', sortable: true },
  { title: 'Health Status', key: 'health_status', sortable: false },
  { title: 'Emergency Contact', key: 'emergency_contact', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

// Computed statistics
const totalRecords = computed(() => records.value.length)

const recordsWithAllergies = computed(() =>
  records.value.filter(record => record.has_allergies === 'yes').length
)

const recordsWithConditions = computed(() =>
  records.value.filter(record => record.has_medical_condition === 'yes').length
)

const recordsOnMedication = computed(() =>
  records.value.filter(record => record.is_taking_medication === 'yes').length
)

const filteredRecords = computed(() => {
  if (!search.value) return records.value

  const searchLower = search.value.toLowerCase()
  return records.value.filter(record =>
    record.first_name?.toLowerCase().includes(searchLower) ||
    record.last_name?.toLowerCase().includes(searchLower) ||
    record.student_no?.toLowerCase().includes(searchLower) ||
    record.contact_no?.toLowerCase().includes(searchLower)
  )
})

const fetchRecords = async () => {
  loading.value = true
  try {
    const data = await getHealthRecords()
    records.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching health records:', error)
    alert('Error loading health records. Please try again.')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchRecords()
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const calculateAge = (birthDate: string) => {
  if (!birthDate) return 'N/A'
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const hasHealthIssues = (record: any) => {
  return record.has_allergies === 'yes' ||
         record.has_medical_condition === 'yes' ||
         record.is_taking_medication === 'yes'
}

const viewDetails = (record: any) => {
  selectedRecord.value = record
  detailsDialog.value = true
}

const editRecord = (record: any) => {
  // TODO: Implement edit functionality
  console.log('Edit record:', record)
  alert('Edit functionality will be implemented in the next update.')
}

const deleteRecord = (record: any) => {
  // TODO: Implement delete functionality
  if (confirm('Are you sure you want to delete this health record?')) {
    console.log('Delete record:', record)
    alert('Delete functionality will be implemented in the next update.')
  }
}

onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-1px);
}

.mdi-spin {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
