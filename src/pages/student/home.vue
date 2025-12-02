<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title class="font-weight-medium">
        CCT HRMS - Student Portal
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
          active
        />
        <v-list-item
          prepend-icon="mdi-file-document"
          title="Health Record"
          value="health-record"
          @click="$router.push('/student/dashboard')"
        />
        </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <!-- Welcome Section -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="d-flex align-center mb-4">
              <v-icon size="48" color="primary" class="mr-4">mdi-account-circle</v-icon>
              <div>
                <h1 class="text-h4 font-weight-medium">Welcome, {{ studentName }}!</h1>
                <p class="text-subtitle-1 text-medium-emphasis mb-0">
                  Manage your health records
                </p>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Health Stats -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="4">
            <v-card class="pa-4" elevation="2" color="info" dark>
              <div class="d-flex align-center">
                <v-avatar size="56" class="mr-4" color="rgba(255,255,255,0.2)">
                  <v-icon color="white" size="28">mdi-file-document</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h4 font-weight-bold">{{ hasHealthRecord ? '1' : '0' }}</h3>
                  <p class="text-body-2 mb-0 opacity-90">Health Record</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-row class="mb-6">
          <v-col cols="12">
            <v-card elevation="2" class="pa-4">
              <h3 class="text-h6 mb-4">Quick Actions</h3>
              <div class="d-flex flex-wrap gap-3">
                <v-btn
                  color="info"
                  variant="elevated"
                  prepend-icon="mdi-file-document"
                  @click="$router.push('/student/dashboard')"
                >
                  View Health Record
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Announcements Section -->
        <v-row class="mb-6">
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-bullhorn</v-icon>
                Latest Announcements
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
                    >
                      <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-progress-circular indeterminate color="primary" />
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
                  <p class="text-body-2 text-medium-emphasis">
                    There are no announcements at the moment
                  </p>
                </div>
              </div>
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
        
        <v-card-title>
          {{ selectedAnnouncement.title }}
        </v-card-title>

        <v-card-text>
          <p class="text-body-1">{{ selectedAnnouncement.body }}</p>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="announcementDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { useAuth } from "@/utils/useAuth";
import { getAnnouncements, getHealthRecords } from "@/utils/useDirectus";

const router = useRouter();
const theme = useTheme();
const { logout: authLogout, userData } = useAuth();

const drawer = ref(false);
const isDark = computed(() => theme.current.value.dark);
const logoutLoading = ref(false);

// Data refs
const announcements = ref<any[]>([]);
const announcementDialog = ref(false);
const selectedAnnouncement = ref<any>(null);
const hasHealthRecord = ref(false);

// Student info
const studentName = computed(() => {
  if (userData.value) {
    return `${userData.value.first_name} ${userData.value.last_name}`;
  }
  return "Student";
});

// Get only published announcements, limited to 3 latest
const latestAnnouncements = computed(() => {
  return announcements.value
    .filter((a) => a.status === "published")
    .slice(0, 3);
});

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};

const handleLogout = async () => {
  try {
    logoutLoading.value = true;
    await authLogout();
    router.push("/");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    logoutLoading.value = false;
  }
};

const fetchDashboardData = async () => {
  try {
    const [announcementsData, healthRecords] = await Promise.all([
      getAnnouncements(),
      getHealthRecords(),
    ]);

    announcements.value = Array.isArray(announcementsData) ? announcementsData : [];

    // Check if student has a health record
    if (Array.isArray(healthRecords) && userData.value) {
      const userRecord = healthRecords.find((record: any) => record.user_id === userData.value.id);
      hasHealthRecord.value = !!userRecord;
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

const getImageUrl = (imageId: string) => {
  if (!imageId) return "";
  const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";
  return `${baseUrl}/assets/${imageId}`;
};


const viewAnnouncementDetails = (announcement: any) => {
  selectedAnnouncement.value = announcement;
  announcementDialog.value = true;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
