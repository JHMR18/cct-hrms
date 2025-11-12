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
          @click="$router.push('/health-records')"
        />
        <v-list-item
          prepend-icon="mdi-calendar-check"
          title="Daily Visits"
          value="daily-visits"
          active
        />
        <v-list-item
          prepend-icon="mdi-clipboard-list"
          title="Annual Assessments"
          value="annual-assessments"
          @click="$router.push('/annual-assessments')"
        />
        <v-list-item
          prepend-icon="mdi-calendar-clock"
          title="Student Appointments"
          value="student-appointments"
          @click="$router.push('/student-appointments')"
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
          <h1 class="text-h4 font-weight-medium">Daily Visits Management</h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-0">
            View and manage all patient daily visit records
          </p>
        </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-calendar-today</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ todayVisits }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Today's Visits</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="success" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-calendar-check</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ thisWeekVisits }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">This Week</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="info" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-account-group</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ totalVisits }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Total Visits</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="warning" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-trending-up</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ commonComplaint }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Most Common</p>
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
          Daily Visit Records
        </div>
        <div class="d-flex align-center gap-2">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search visits..."
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
            @click="$router.push('/daily-visit')"
          >
            New Daily Visit
          </v-btn>
        </div>
      </v-card-title>
      <v-divider />

      <v-data-table
        :headers="headers"
        :items="filteredVisits"
        :loading="loading"
        :search="search"
        class="elevation-0"
        :items-per-page="10"
      >
        <template v-slot:item.date_of_visit="{ item }">
          <v-chip color="primary" size="small">
            {{ formatDate(item.date_of_visit) }}
          </v-chip>
        </template>

        <template v-slot:item.time_of_visit="{ item }">
          <v-chip color="info" size="small">
            {{ formatTime(item.time_of_visit) }}
          </v-chip>
        </template>

        <template v-slot:item.sex="{ item }">
          <v-icon :color="item.sex === 'Male' ? 'blue' : 'pink'" size="small" class="mr-1">
            {{ item.sex === 'Male' ? 'mdi-gender-male' : 'mdi-gender-female' }}
          </v-icon>
          {{ item.sex }}
        </template>

        <template v-slot:item.department="{ item }">
          <v-chip variant="outlined" size="small">
            {{ item.department }}
          </v-chip>
        </template>

        <template v-slot:item.chief_complaint="{ item }">
          <div style="max-width: 200px;">
            <v-tooltip :text="item.chief_complaint">
              <template v-slot:activator="{ props }">
                <span v-bind="props" class="text-truncate d-block">
                  {{ item.chief_complaint }}
                </span>
              </template>
            </v-tooltip>
          </div>
        </template>

        <template v-slot:item.treatment="{ item }">
          <div style="max-width: 200px;">
            <v-tooltip :text="item.treatment">
              <template v-slot:activator="{ props }">
                <span v-bind="props" class="text-truncate d-block">
                  {{ item.treatment }}
                </span>
              </template>
            </v-tooltip>
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
              @click="editVisit(item)"
            >
              <v-icon size="small">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="error"
              @click="deleteVisit(item)"
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
            <h3 class="text-h6 mb-2">No daily visits found</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Get started by creating your first daily visit record
            </p>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="$router.push('/daily-visit')"
            >
              Create Daily Visit
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800">
      <v-card v-if="selectedVisit">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-clipboard-text</v-icon>
          Daily Visit Details
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <h4 class="text-subtitle-1 font-weight-medium mb-1">Patient Name</h4>
                <p class="text-body-1">{{ selectedVisit.name }}</p>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <h4 class="text-subtitle-1 font-weight-medium mb-1">Date & Time</h4>
                <p class="text-body-1">
                  {{ formatDate(selectedVisit.date_of_visit) }} at {{ formatTime(selectedVisit.time_of_visit) }}
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <h4 class="text-subtitle-1 font-weight-medium mb-1">Sex</h4>
                <p class="text-body-1">{{ selectedVisit.sex }}</p>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="mb-4">
                <h4 class="text-subtitle-1 font-weight-medium mb-1">Department</h4>
                <p class="text-body-1">{{ selectedVisit.department }}</p>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="mb-4">
                <h4 class="text-subtitle-1 font-weight-medium mb-1">Chief Complaint</h4>
                <p class="text-body-1">{{ selectedVisit.chief_complaint }}</p>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="mb-4">
                <h4 class="text-subtitle-1 font-weight-medium mb-1">Treatment</h4>
                <p class="text-body-1">{{ selectedVisit.treatment }}</p>
              </div>
            </v-col>
            <v-col cols="12" v-if="selectedVisit.remarks">
              <div class="mb-4">
                <h4 class="text-subtitle-1 font-weight-medium mb-1">Remarks</h4>
                <p class="text-body-1">{{ selectedVisit.remarks }}</p>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuth } from '@/utils/useAuth'
import { getDailyVisits } from '@/utils/useDirectus'

const router = useRouter()
const theme = useTheme()
const { logout: authLogout, userData } = useAuth()

const drawer = ref(false)
const isDark = computed(() => theme.current.value.dark)
const logoutLoading = ref(false)
const loading = ref(false)
const search = ref('')
const detailsDialog = ref(false)
const selectedVisit = ref(null)

const visits = ref<any[]>([])

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
  { title: 'Date', key: 'date_of_visit', sortable: true },
  { title: 'Time', key: 'time_of_visit', sortable: true },
  { title: 'Patient Name', key: 'name', sortable: true },
  { title: 'Sex', key: 'sex', sortable: true },
  { title: 'Department', key: 'department', sortable: true },
  { title: 'Chief Complaint', key: 'chief_complaint', sortable: false },
  { title: 'Treatment', key: 'treatment', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

// Computed statistics
const todayVisits = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return visits.value.filter(visit => visit.date_of_visit === today).length
})

const thisWeekVisits = computed(() => {
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  return visits.value.filter(visit => {
    const visitDate = new Date(visit.date_of_visit)
    return visitDate >= weekAgo && visitDate <= today
  }).length
})

const totalVisits = computed(() => visits.value.length)

const commonComplaint = computed(() => {
  if (visits.value.length === 0) return 'N/A'

  const complaints = visits.value.map(v => v.chief_complaint?.toLowerCase() || '').filter(c => c)
  const complaintCounts = complaints.reduce((acc, complaint) => {
    acc[complaint] = (acc[complaint] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostCommon = Object.entries(complaintCounts)
    .sort(([,a], [,b]) => b - a)[0]

  return mostCommon ? mostCommon[0].charAt(0).toUpperCase() + mostCommon[0].slice(1) : 'N/A'
})

const filteredVisits = computed(() => {
  if (!search.value) return visits.value

  const searchLower = search.value.toLowerCase()
  return visits.value.filter(visit =>
    visit.name?.toLowerCase().includes(searchLower) ||
    visit.department?.toLowerCase().includes(searchLower) ||
    visit.chief_complaint?.toLowerCase().includes(searchLower) ||
    visit.treatment?.toLowerCase().includes(searchLower)
  )
})

const fetchVisits = async () => {
  loading.value = true
  try {
    const data = await getDailyVisits()
    visits.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching visits:', error)
    alert('Error loading daily visits. Please try again.')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchVisits()
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (timeString: string) => {
  if (!timeString) return 'N/A'
  return timeString
}

const viewDetails = (visit: any) => {
  selectedVisit.value = visit
  detailsDialog.value = true
}

const editVisit = (visit: any) => {
  // TODO: Implement edit functionality
  console.log('Edit visit:', visit)
  alert('Edit functionality will be implemented in the next update.')
}

const deleteVisit = (visit: any) => {
  // TODO: Implement delete functionality
  if (confirm('Are you sure you want to delete this visit record?')) {
    console.log('Delete visit:', visit)
    alert('Delete functionality will be implemented in the next update.')
  }
}

onMounted(() => {
  fetchVisits()
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-1px);
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
