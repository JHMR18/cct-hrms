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
        <!-- Welcome Section -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="d-flex align-center mb-4">
              <v-icon size="48" color="primary" class="mr-4"> mdi-hospital-building </v-icon>
              <div>
                <h1 class="text-h4 font-weight-medium">Health Dashboard</h1>
                <p class="text-subtitle-1 text-medium-emphasis mb-0">
                  Welcome back! Here's an overview of today's health activities and analytics.
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

        <!-- Health Analytics Section -->
        <v-row class="mb-6">
          <v-col cols="12">
            <h2 class="text-h5 mb-4 d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
              Health Analytics Dashboard
            </h2>
          </v-col>
        </v-row>

        <!-- Analytics Charts Row 1 -->
        <v-row class="mb-6">
          <!-- Gender Distribution Chart -->
          <v-col cols="12" md="6">
            <v-card elevation="2" class="pa-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-gender-male-female</v-icon>
                Gender Distribution
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <div style="position: relative; height: 300px">
                  <canvas ref="genderChartRef"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Medical Conditions Chart -->
          <v-col cols="12" md="6">
            <v-card elevation="2" class="pa-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="red">mdi-heart-pulse</v-icon>
                Medical Conditions Overview
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <div style="position: relative; height: 300px">
                  <canvas ref="medicalChartRef"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Analytics Charts Row 2 -->
        <v-row class="mb-6">
          <!-- Allergies & Medications Chart -->
          <v-col cols="12" md="6">
            <v-card elevation="2" class="pa-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="orange">mdi-allergy</v-icon>
                Allergies & Medications
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <div style="position: relative; height: 300px">
                  <canvas ref="allergyChartRef"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Lifestyle Habits Chart -->
          <v-col cols="12" md="6">
            <v-card elevation="2" class="pa-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="purple">mdi-smoking</v-icon>
                Lifestyle Habits
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <div style="position: relative; height: 300px">
                  <canvas ref="lifestyleChartRef"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Analytics Charts Row 3 -->
        <v-row class="mb-6">
          <!-- Health Issues Distribution -->
          <v-col cols="12">
            <v-card elevation="2" class="pa-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="teal">mdi-eye</v-icon>
                Common Health Issues Distribution
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4">
                <div style="position: relative; height: 350px">
                  <canvas ref="healthIssuesChartRef"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Announcements Section -->
        <v-row class="mb-6">
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title class="d-flex align-center justify-between">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" color="primary">mdi-bullhorn</v-icon>
                  Latest Announcements
                </div>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  @click="$router.push('/announcements')"
                >
                  View All
                </v-btn>
              </v-card-title>
              <v-divider />

              <v-row class="pa-4" v-if="announcements.length > 0">
                <v-col
                  v-for="announcement in latestAnnouncements"
                  :key="announcement.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <v-card elevation="1" class="h-100">
                    <v-img
                      v-if="announcement.image"
                      :src="getImageUrl(announcement.image)"
                      height="180"
                      cover
                      @error="handleImageError"
                    >
                      <template v-slot:placeholder>
                        <div
                          class="d-flex align-center justify-center fill-height bg-grey-lighten-3"
                        >
                          <v-progress-circular indeterminate color="primary" />
                        </div>
                      </template>
                      <template v-slot:error>
                        <div
                          class="d-flex align-center justify-center fill-height bg-grey-lighten-2"
                        >
                          <div class="text-center">
                            <v-icon size="48" color="grey">mdi-image-off</v-icon>
                            <p class="text-caption mt-2">Image unavailable</p>
                          </div>
                        </div>
                      </template>
                    </v-img>
                    <v-img
                      v-else
                      src="https://via.placeholder.com/400x180?text=No+Image"
                      height="180"
                      cover
                    />

                    <v-card-title class="text-h6">
                      {{ announcement.title }}
                    </v-card-title>

                    <v-card-text>
                      <p class="text-body-2 line-clamp-2">
                        {{ announcement.body }}
                      </p>
                    </v-card-text>

                    <v-card-actions>
                      <v-chip
                        :color="getStatusColor(announcement.status)"
                        size="small"
                        variant="flat"
                      >
                        {{ announcement.status }}
                      </v-chip>
                      <v-spacer />
                      <v-btn
                        variant="text"
                        color="primary"
                        size="small"
                        @click="viewAnnouncementDetails(announcement)"
                      >
                        Read More
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>

              <div v-else class="pa-8">
                <div class="text-center">
                  <v-icon size="64" color="grey-lighten-1">mdi-bullhorn-outline</v-icon>
                  <h3 class="text-h6 mt-4 mb-2">No Announcements</h3>
                  <p class="text-body-2 text-medium-emphasis mb-4">
                    There are no announcements at the moment
                  </p>
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="$router.push('/announcements')"
                  >
                    Create Announcement
                  </v-btn>
                </div>
              </div>
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

    <!-- View Announcement Dialog -->
    <v-dialog v-model="announcementDialog" max-width="800">
      <v-card v-if="selectedAnnouncement">
        <v-img
          v-if="selectedAnnouncement.image"
          :src="getImageUrl(selectedAnnouncement.image)"
          height="300"
          cover
        />

        <v-card-title class="d-flex justify-between align-center">
          <span>{{ selectedAnnouncement.title }}</span>
          <v-chip :color="getStatusColor(selectedAnnouncement.status)" size="small" variant="flat">
            {{ selectedAnnouncement.status }}
          </v-chip>
        </v-card-title>

        <v-card-text>
          <p class="text-body-1">{{ selectedAnnouncement.body }}</p>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="announcementDialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { useAuth } from "@/utils/useAuth";
import {
  getDailyVisits,
  getHealthRecords,
  getAnnualAssessments,
  getAnnouncements,
} from "@/utils/useDirectus";
import { Chart, registerables } from "chart.js";
import { AnalyticsService, type HealthAnalytics } from "@/services/analyticsService";

// Register Chart.js components
Chart.register(...registerables);

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
const announcements = ref<any[]>([]);
const announcementDialog = ref(false);
const selectedAnnouncement = ref<any>(null);

// Analytics data
const healthAnalytics = ref<HealthAnalytics | null>(null);

// Chart refs
const genderChartRef = ref<HTMLCanvasElement | null>(null);
const medicalChartRef = ref<HTMLCanvasElement | null>(null);
const allergyChartRef = ref<HTMLCanvasElement | null>(null);
const lifestyleChartRef = ref<HTMLCanvasElement | null>(null);
const healthIssuesChartRef = ref<HTMLCanvasElement | null>(null);

// Chart instances
let genderChart: Chart | null = null;
let medicalChart: Chart | null = null;
let allergyChart: Chart | null = null;
let lifestyleChart: Chart | null = null;
let healthIssuesChart: Chart | null = null;

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

// Get only published announcements, limited to 3 latest
const latestAnnouncements = computed(() => {
  return announcements.value.filter((a) => a.status === "published").slice(0, 3);
});

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

const createGenderChart = () => {
  if (!genderChartRef.value || !healthAnalytics.value) return;

  if (genderChart) {
    genderChart.destroy();
  }

  const ctx = genderChartRef.value.getContext("2d");
  if (!ctx) return;

  const data = healthAnalytics.value.genderDistribution;
  const total = data.male + data.female + data.other;

  genderChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Male", "Female", "Prefer not to say"],
      datasets: [
        {
          data: [data.male, data.female, data.other],
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(153, 102, 255, 0.8)",
          ],
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(153, 102, 255, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
};

const createMedicalChart = () => {
  if (!medicalChartRef.value || !healthAnalytics.value) return;

  if (medicalChart) {
    medicalChart.destroy();
  }

  const ctx = medicalChartRef.value.getContext("2d");
  if (!ctx) return;

  const conditions = healthAnalytics.value.medicalConditions;
  const labels = Object.keys(conditions);
  const data = Object.values(conditions);

  medicalChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels.length > 0 ? labels : ["No conditions reported"],
      datasets: [
        {
          label: "Number of Students",
          data: data.length > 0 ? data : [0],
          backgroundColor: "rgba(255, 99, 132, 0.8)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
};

const createAllergyChart = () => {
  if (!allergyChartRef.value || !healthAnalytics.value) return;

  if (allergyChart) {
    allergyChart.destroy();
  }

  const ctx = allergyChartRef.value.getContext("2d");
  if (!ctx) return;

  const data = healthAnalytics.value;

  allergyChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Has Allergies", "No Allergies", "Taking Medication", "Not Taking Medication"],
      datasets: [
        {
          data: [
            data.allergies.has,
            data.allergies.no,
            data.medications.taking,
            data.medications.notTaking,
          ],
          backgroundColor: [
            "rgba(255, 159, 64, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
          ],
          borderColor: [
            "rgba(255, 159, 64, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });
};

const createLifestyleChart = () => {
  if (!lifestyleChartRef.value || !healthAnalytics.value) return;

  if (lifestyleChart) {
    lifestyleChart.destroy();
  }

  const ctx = lifestyleChartRef.value.getContext("2d");
  if (!ctx) return;

  const data = healthAnalytics.value;
  const total = data.lifestyle.smoking + data.lifestyle.drinking;

  lifestyleChart = new Chart(ctx, {
    type: "polarArea",
    data: {
      labels: ["Smoking", "Drinking Alcohol", "Non-Smokers", "Non-Drinkers"],
      datasets: [
        {
          data: [
            data.lifestyle.smoking,
            data.lifestyle.drinking,
            total - data.lifestyle.smoking,
            total - data.lifestyle.drinking,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });
};

const createHealthIssuesChart = () => {
  if (!healthIssuesChartRef.value || !healthAnalytics.value) return;

  if (healthIssuesChart) {
    healthIssuesChart.destroy();
  }

  const ctx = healthIssuesChartRef.value.getContext("2d");
  if (!ctx) return;

  const data = healthAnalytics.value;

  healthIssuesChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "Family History",
        "Previous Operations",
        "Eye Problems",
        "Hearing Problems",
        "Communicable Diseases",
      ],
      datasets: [
        {
          label: "Students with Conditions",
          data: [
            data.familyHistory.has,
            data.operations.has,
            data.eyeProblems.has,
            data.hearingProblems.has,
            data.communicableDiseases.has,
          ],
          backgroundColor: "rgba(23, 88, 51, 0.2)",
          borderColor: "rgba(23, 88, 51, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(23, 88, 51, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(23, 88, 51, 1)",
        },
        {
          label: "Students without Conditions",
          data: [
            data.familyHistory.no,
            data.operations.no,
            data.eyeProblems.no,
            data.hearingProblems.no,
            data.communicableDiseases.no,
          ],
          backgroundColor: "rgba(239, 243, 22, 0.2)",
          borderColor: "rgba(239, 243, 22, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(239, 243, 22, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(239, 243, 22, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
};

const initializeCharts = () => {
  nextTick(() => {
    createGenderChart();
    createMedicalChart();
    createAllergyChart();
    createLifestyleChart();
    createHealthIssuesChart();
  });
};

const fetchDashboardData = async () => {
  try {
    // Fetch all data in parallel
    const [healthRecords, dailyVisits, annualAssessments, announcementsData, analytics] =
      await Promise.all([
        getHealthRecords(),
        getDailyVisits(),
        getAnnualAssessments(),
        getAnnouncements(),
        AnalyticsService.getHealthAnalytics(),
      ]);

    // Set total counts
    totalHealthRecords.value = Array.isArray(healthRecords) ? healthRecords.length : 0;
    totalDailyVisits.value = Array.isArray(dailyVisits) ? dailyVisits.length : 0;
    totalAnnualAssessments.value = Array.isArray(annualAssessments) ? annualAssessments.length : 0;

    // Set announcements
    announcements.value = Array.isArray(announcementsData) ? announcementsData : [];
    console.log("Fetched announcements:", announcements.value);
    console.log(
      "Published announcements:",
      announcements.value.filter((a) => a.status === "published"),
    );

    // Set analytics data
    healthAnalytics.value = analytics;

    // Calculate today's visits
    const today = new Date().toISOString().split("T")[0];
    todaysVisits.value = Array.isArray(dailyVisits)
      ? dailyVisits.filter((visit: any) => visit.date_of_visit === today).length
      : 0;

    // Initialize charts after data is loaded
    initializeCharts();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

const getImageUrl = (imageId: string | any) => {
  if (!imageId) {
    console.log("No image ID provided");
    return "";
  }

  // Handle if imageId is an object (when fetched with relations)
  let actualId = imageId;
  if (typeof imageId === "object" && imageId.id) {
    actualId = imageId.id;
  }

  const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";

  // Try to get access token for authenticated access
  const accessToken = getAccessToken();

  // If we have a token, add it as query parameter
  let url = `${baseUrl}/assets/${actualId}`;
  if (accessToken) {
    url += `?access_token=${accessToken}`;
  }

  console.log("Generated image URL for ID:", actualId, "->", url);
  return url;
};

const getAccessToken = (): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "accessToken") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

const handleImageError = (event: any) => {
  console.error("Image failed to load:", event);
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    published: "success",
    draft: "warning",
    archived: "error",
  };
  return colors[status] || "grey";
};

const viewAnnouncementDetails = (announcement: any) => {
  selectedAnnouncement.value = announcement;
  announcementDialog.value = true;
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
