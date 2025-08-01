<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      
      <v-toolbar-title class="font-weight-medium">
        CCT HRMS Dashboard
      </v-toolbar-title>
      
      <v-spacer />
      
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
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
          <v-list-item @click="logout" :disabled="loading">
            <v-list-item-title>
              <v-icon start>{{ loading ? 'mdi-loading mdi-spin' : 'mdi-logout' }}</v-icon>
              {{ loading ? 'Logging out...' : 'Logout' }}
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
          active
        />
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Patients"
          value="patients"
        />
        <v-list-item
          prepend-icon="mdi-doctor"
          title="Doctors"
          value="doctors"
        />
        <v-list-item
          prepend-icon="mdi-calendar-clock"
          title="Appointments"
          value="appointments"
        />
        <v-list-item
          prepend-icon="mdi-file-document"
          title="Medical Records"
          value="records"
        />
        <v-list-item
          prepend-icon="mdi-pill"
          title="Medications"
          value="medications"
        />
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Reports"
          value="reports"
        />
        <v-list-item
          prepend-icon="mdi-cog"
          title="Settings"
          value="settings"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <!-- Welcome Section -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="d-flex align-center mb-4">
              <v-icon size="48" color="primary" class="mr-4">
                mdi-hospital-building
              </v-icon>
              <div>
                <h1 class="text-h4 font-weight-medium">
                  Welcome to CCT HRMS
                </h1>
                <p class="text-subtitle-1 text-medium-emphasis mb-0">
                  Health Record Management System Dashboard
                </p>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Stats Cards -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="3" v-for="stat in stats" :key="stat.title">
            <v-card class="pa-4" elevation="2">
              <div class="d-flex align-center">
                <v-avatar :color="stat.color" size="56" class="mr-4">
                  <v-icon color="white" size="28">{{ stat.icon }}</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5 font-weight-bold">{{ stat.value }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">{{ stat.title }}</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Activity -->
        <v-row>
          <v-col cols="12" md="8">
            <v-card elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-clock-outline</v-icon>
                Recent Activity
              </v-card-title>
              <v-divider />
              <v-list>
                <v-list-item
                  v-for="(activity, index) in recentActivities"
                  :key="index"
                  :prepend-icon="activity.icon"
                >
                  <v-list-item-title>{{ activity.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ activity.time }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card elevation="2" class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-calendar-today</v-icon>
                Today's Appointments
              </v-card-title>
              <v-divider />
              <v-card-text>
                <div class="text-center py-6">
                  <v-icon size="64" color="success" class="mb-2">
                    mdi-calendar-check
                  </v-icon>
                  <h3 class="text-h6">12 Appointments</h3>
                  <p class="text-body-2 text-medium-emphasis">Scheduled for today</p>
                </div>
              </v-card-text>
            </v-card>

            <v-card elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-alert-circle</v-icon>
                System Status
              </v-card-title>
              <v-divider />
              <v-card-text>
                <div class="d-flex align-center justify-center py-4">
                  <v-chip color="success" variant="flat" size="large">
                    <v-icon start>mdi-check-circle</v-icon>
                    All Systems Operational
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuth } from '@/utils/useAuth'

const router = useRouter()
const theme = useTheme()
const { logout: authLogout, userData } = useAuth()

const drawer = ref(false)
const isDark = computed(() => theme.current.value.dark)
const loading = ref(false)

const stats = ref([
  {
    title: 'Total Patients',
    value: '2,847',
    icon: 'mdi-account-group',
    color: 'primary'
  },
  {
    title: 'Active Doctors',
    value: '42',
    icon: 'mdi-doctor',
    color: 'success'
  },
  {
    title: 'Appointments Today',
    value: '12',
    icon: 'mdi-calendar-today',
    color: 'info'
  },
  {
    title: 'Pending Records',
    value: '8',
    icon: 'mdi-file-document-outline',
    color: 'warning'
  }
])

const recentActivities = ref([
  {
    title: 'New patient registered: John Smith',
    time: '5 minutes ago',
    icon: 'mdi-account-plus'
  },
  {
    title: 'Dr. Johnson completed consultation',
    time: '12 minutes ago',
    icon: 'mdi-stethoscope'
  },
  {
    title: 'Lab results uploaded for Patient ID: 2847',
    time: '25 minutes ago',
    icon: 'mdi-test-tube'
  },
  {
    title: 'Appointment scheduled for tomorrow',
    time: '1 hour ago',
    icon: 'mdi-calendar-plus'
  },
  {
    title: 'Medical record updated',
    time: '2 hours ago',
    icon: 'mdi-file-document-edit'
  }
])

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const logout = async () => {
  try {
    loading.value = true
    await authLogout()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

.mdi-spin {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>