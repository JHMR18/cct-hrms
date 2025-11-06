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
          <v-list-item @click="logout" :disabled="loading">
            <v-list-item-title>
              <v-icon start>{{ loading ? "mdi-loading mdi-spin" : "mdi-logout" }}</v-icon>
              {{ loading ? "Logging out..." : "Logout" }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" active />
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
          @click="$router.push('/daily-visits')"
        />
        <v-list-item
          prepend-icon="mdi-clipboard-list"
          title="Annual Assessments"
          value="annual-assessments"
          @click="$router.push('/annual-assessments')"
        />
        <v-list-item prepend-icon="mdi-chart-line" title="Reports" value="reports" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <!-- Welcome Section -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="d-flex align-center mb-4">
              <v-icon size="48" color="primary" class="mr-4"> mdi-hospital-building </v-icon>
              <div>
                <h1 class="text-h4 font-weight-medium">Health Dashboard</h1>
                <p class="text-subtitle-1 text-medium-emphasis mb-0">
                  Welcome back! Here's an overview of today's health activities.
                </p>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-row class="mb-6">
          <v-col cols="12">
            <v-card elevation="2" class="pa-4">
              <h3 class="text-h6 mb-4">Quick Actions</h3>
              <div class="d-flex flex-wrap gap-3">
                <v-btn
                  color="primary"
                  variant="elevated"
                  prepend-icon="mdi-plus"
                  @click="$router.push('/daily-visit')"
                >
                  New Daily Visit
                </v-btn>
                <v-btn
                  color="success"
                  variant="elevated"
                  prepend-icon="mdi-clipboard-plus"
                  @click="$router.push('/annual-assessment')"
                >
                  Annual Assessment
                </v-btn>
                <v-btn
                  color="info"
                  variant="elevated"
                  prepend-icon="mdi-account-plus"
                  @click="$router.push('/create-health-record')"
                >
                  Add Health Record
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Health Statistics -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="3" v-for="stat in healthStats" :key="stat.title">
            <v-card class="pa-4" elevation="2" :color="stat.color" dark>
              <div class="d-flex align-center">
                <v-avatar size="56" class="mr-4" color="rgba(255,255,255,0.2)">
                  <v-icon color="white" size="28">{{ stat.icon }}</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h4 font-weight-bold">{{ stat.value }}</h3>
                  <p class="text-body-2 mb-0 opacity-90">{{ stat.title }}</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Health Alerts & Recent Activity -->
        <v-row class="mb-6">
          <v-col cols="12">
            <v-card elevation="2" class="h-100">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="info">mdi-history</v-icon>
                Recent Activity
              </v-card-title>
              <v-divider />
              <v-list>
                <v-list-item
                  v-for="(activity, index) in recentActivities"
                  :key="index"
                  :prepend-icon="activity.icon"
                  :title="activity.title"
                  :subtitle="activity.time"
                />
                <v-list-item v-if="recentActivities.length === 0">
                  <div class="text-center py-4 w-100">
                    <v-icon size="48" color="grey" class="mb-2"> mdi-clock-outline </v-icon>
                    <p class="text-body-1">No recent activity</p>
                  </div>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <!-- Today's Overview -->
        <v-row>
          <v-col cols="12" md="8">
            <v-card elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-calendar-today</v-icon>
                Today's Overview
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <div class="text-center pa-4">
                      <v-icon size="48" color="primary" class="mb-2"> mdi-account-group </v-icon>
                      <h3 class="text-h5">{{ todaysVisits }}</h3>
                      <p class="text-body-2 text-medium-emphasis">Today's Visits</p>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="text-center pa-4">
                      <v-icon size="48" color="success" class="mb-2"> mdi-clipboard-check </v-icon>
                      <h3 class="text-h5">{{ totalAnnualAssessments }}</h3>
                      <p class="text-body-2 text-medium-emphasis">Total Assessments</p>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="text-center pa-4">
                      <v-icon size="48" color="info" class="mb-2"> mdi-heart-pulse </v-icon>
                      <h3 class="text-h5">{{ totalHealthRecords }}</h3>
                      <p class="text-body-2 text-medium-emphasis">Health Records</p>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card elevation="2" class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-chart-donut</v-icon>
                Health Conditions
              </v-card-title>
              <v-divider />
              <v-card-text>
                <div class="d-flex flex-column gap-3">
                  <div class="d-flex align-center justify-between">
                    <span>Has Allergies</span>
                    <v-chip color="orange" size="small">{{ conditionStats.allergies }}%</v-chip>
                  </div>
                  <div class="d-flex align-center justify-between">
                    <span>Medical Conditions</span>
                    <v-chip color="red" size="small">{{ conditionStats.medical }}%</v-chip>
                  </div>
                  <div class="d-flex align-center justify-between">
                    <span>Taking Medication</span>
                    <v-chip color="blue" size="small">{{ conditionStats.medication }}%</v-chip>
                  </div>
                  <div class="d-flex align-center justify-between">
                    <span>Eye Problems</span>
                    <v-chip color="purple" size="small">{{ conditionStats.eyes }}%</v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <v-card elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-check-circle</v-icon>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { useAuth } from "@/utils/useAuth";
import { getDailyVisits, getHealthRecords, getAnnualAssessments } from "@/utils/useDirectus";

const router = useRouter();
const theme = useTheme();
const { logout: authLogout, userData } = useAuth();

const drawer = ref(false);
const isDark = computed(() => theme.current.value.dark);
const loading = ref(false);

// Data refs
const totalHealthRecords = ref(0);
const totalDailyVisits = ref(0);
const totalAnnualAssessments = ref(0);
const todaysVisits = ref(0);

// Computed health stats
const healthStats = computed(() => [
  {
    title: "Total Health Records",
    value: totalHealthRecords.value.toString(),
    icon: "mdi-account-heart",
    color: "primary",
  },
  {
    title: "Today's Visits",
    value: todaysVisits.value.toString(),
    icon: "mdi-calendar-check",
    color: "success",
  },
  {
    title: "Total Daily Visits",
    value: totalDailyVisits.value.toString(),
    icon: "mdi-clipboard-text",
    color: "info",
  },
  {
    title: "Annual Assessments",
    value: totalAnnualAssessments.value.toString(),
    icon: "mdi-clipboard-list",
    color: "warning",
  },
]);

const recentActivities = ref([
  {
    title: "New daily visit recorded",
    time: "5 minutes ago",
    icon: "mdi-clipboard-plus",
  },
  {
    title: "Annual assessment completed",
    time: "15 minutes ago",
    icon: "mdi-check-circle",
  },
  {
    title: "Health record updated",
    time: "1 hour ago",
    icon: "mdi-account-edit",
  },
  {
    title: "Treatment administered",
    time: "2 hours ago",
    icon: "mdi-medical-bag",
  },
]);

const conditionStats = ref({
  allergies: 15,
  medical: 28,
  medication: 22,
  eyes: 12,
});

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

const logout = async () => {
  try {
    loading.value = true;
    await authLogout();
    router.push("/");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    loading.value = false;
  }
};

const fetchDashboardData = async () => {
  try {
    // Fetch all data in parallel
    const [healthRecords, dailyVisits, annualAssessments] = await Promise.all([
      getHealthRecords(),
      getDailyVisits(),
      getAnnualAssessments(),
    ]);

    // Set total counts
    totalHealthRecords.value = Array.isArray(healthRecords) ? healthRecords.length : 0;
    totalDailyVisits.value = Array.isArray(dailyVisits) ? dailyVisits.length : 0;
    totalAnnualAssessments.value = Array.isArray(annualAssessments) ? annualAssessments.length : 0;

    // Calculate today's visits
    const today = new Date().toISOString().split('T')[0];
    todaysVisits.value = Array.isArray(dailyVisits) 
      ? dailyVisits.filter((visit: any) => visit.date_of_visit === today).length 
      : 0;
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

onMounted(() => {
  fetchDashboardData();
});
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
