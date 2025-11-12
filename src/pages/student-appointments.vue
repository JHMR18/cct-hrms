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
          @click="$router.push('/daily-visits')"
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
          active
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
          <h1 class="text-h4 font-weight-medium">Student Appointments Management</h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-0">
            View and manage all student appointments
          </p>
        </div>

        <!-- Stats Cards -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" elevation="2">
              <div class="d-flex align-center">
                <v-avatar color="primary" size="56" class="mr-4">
                  <v-icon color="white" size="28">mdi-calendar-clock</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5 font-weight-bold">{{ totalAppointments }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Total</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" elevation="2">
              <div class="d-flex align-center">
                <v-avatar color="warning" size="56" class="mr-4">
                  <v-icon color="white" size="28">mdi-clock-outline</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5 font-weight-bold">{{ pendingAppointments }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Pending</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" elevation="2">
              <div class="d-flex align-center">
                <v-avatar color="info" size="56" class="mr-4">
                  <v-icon color="white" size="28">mdi-calendar-check</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5 font-weight-bold">{{ scheduledAppointments }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Scheduled</p>
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
                  <h3 class="text-h5 font-weight-bold">{{ completedAppointments }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Completed</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filter and Search -->
        <v-row class="mb-6">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              clearable
              placeholder="Search by purpose or student..."
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterStatus"
              label="Filter by Status"
              :items="['all', 'pending', 'scheduled', 'completed', 'cancelled']"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-filter"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filterDate"
              label="Filter by Date"
              type="date"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-calendar"
            />
          </v-col>
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn
              color="primary"
              variant="text"
              @click="clearFilters"
              block
            >
              Clear Filters
            </v-btn>
          </v-col>
        </v-row>

        <!-- Appointments Table -->
        <v-row>
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title class="d-flex align-center justify-between">
                <span>All Appointments</span>
                <v-chip>{{ filteredAppointments.length }} appointments</v-chip>
              </v-card-title>
              <v-divider />
              
              <v-data-table
                :headers="headers"
                :items="filteredAppointments"
                :items-per-page="10"
                class="elevation-0"
                v-if="filteredAppointments.length > 0"
              >
                <template v-slot:item.student="{ item }">
                  <div class="d-flex align-center py-2">
                    <v-avatar color="primary" size="32" class="mr-3">
                      <v-icon color="white" size="18">mdi-account</v-icon>
                    </v-avatar>
                    <div>
                      <div class="font-weight-medium">{{ getStudentName(item.student_id || item.user_created) }}</div>
                      <div class="text-caption text-medium-emphasis">ID: {{ item.student_id || item.user_created }}</div>
                    </div>
                  </div>
                </template>

                <template v-slot:item.date="{ item }">
                  <div class="d-flex align-center">
                    <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                    {{ formatDate(item.date) }}
                  </div>
                </template>

                <template v-slot:item.purpose="{ item }">
                  <div class="purpose-cell">{{ item.purpose }}</div>
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="getStatusColor(item.status)"
                    size="small"
                    variant="flat"
                  >
                    {{ item.status }}
                  </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                  <div class="d-flex gap-1">
                    <v-btn
                      icon="mdi-eye"
                      variant="text"
                      size="small"
                      color="info"
                      @click="viewAppointment(item)"
                    />
                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      size="small"
                      color="primary"
                      @click="editAppointment(item)"
                    />
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      size="small"
                      color="error"
                      @click="confirmDelete(item)"
                    />
                  </div>
                </template>
              </v-data-table>

              <div v-else class="pa-8">
                <div class="text-center">
                  <v-icon size="80" color="grey-lighten-1">mdi-calendar-blank-outline</v-icon>
                  <h3 class="text-h5 mt-4 mb-2">No Appointments Found</h3>
                  <p class="text-body-1 text-medium-emphasis">
                    {{ searchQuery || filterStatus !== 'all' || filterDate ? 'Try adjusting your filters' : 'No student appointments have been created yet' }}
                  </p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- View Appointment Dialog -->
    <v-dialog v-model="viewDialog" max-width="600">
      <v-card v-if="selectedAppointment">
        <v-card-title class="d-flex justify-between align-center">
          <span>Appointment Details</span>
          <v-chip
            :color="getStatusColor(selectedAppointment.status)"
            size="small"
            variant="flat"
          >
            {{ selectedAppointment.status }}
          </v-chip>
        </v-card-title>
        <v-divider />

        <v-card-text class="pt-4">
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-account</v-icon>
              </template>
              <v-list-item-title>Student</v-list-item-title>
              <v-list-item-subtitle>{{ getStudentName(selectedAppointment.student_id || selectedAppointment.user_created) }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-calendar</v-icon>
              </template>
              <v-list-item-title>Date</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(selectedAppointment.date) }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-text</v-icon>
              </template>
              <v-list-item-title>Purpose</v-list-item-title>
              <v-list-item-subtitle>{{ selectedAppointment.purpose }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-clock</v-icon>
              </template>
              <v-list-item-title>Created</v-list-item-title>
              <v-list-item-subtitle>{{ formatDateTime(selectedAppointment.date_created) }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-btn
            color="primary"
            variant="text"
            prepend-icon="mdi-pencil"
            @click="editAppointment(selectedAppointment); viewDialog = false"
          >
            Edit
          </v-btn>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="viewDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Appointment Dialog -->
    <v-dialog v-model="editDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-pencil</v-icon>
          Update Appointment
        </v-card-title>
        <v-divider />

        <v-card-text class="pt-6">
          <v-form ref="appointmentForm" @submit.prevent="saveAppointment">
            <v-text-field
              v-model="formData.date"
              label="Appointment Date"
              type="date"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              :rules="[v => !!v || 'Date is required']"
              required
              class="mb-4"
            />

            <v-textarea
              v-model="formData.purpose"
              label="Purpose of Visit"
              variant="outlined"
              prepend-inner-icon="mdi-text"
              :rules="[v => !!v || 'Purpose is required']"
              rows="4"
              required
              class="mb-4"
              readonly
            />

            <v-select
              v-model="formData.status"
              label="Status"
              variant="outlined"
              prepend-inner-icon="mdi-flag"
              :items="statusOptions"
              :rules="[v => !!v || 'Status is required']"
              required
            />
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="closeEditDialog"
            :disabled="saving"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="saveAppointment"
            :loading="saving"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="error">mdi-alert-circle</v-icon>
          Delete Appointment
        </v-card-title>
        <v-divider />

        <v-card-text class="pt-4">
          <p class="text-body-1">
            Are you sure you want to delete this appointment?
          </p>
          <p class="text-body-2 text-medium-emphasis">
            <strong>Student:</strong> {{ getStudentName(appointmentToDelete?.student_id || appointmentToDelete?.user_created) }}
          </p>
          <p class="text-body-2 text-medium-emphasis">
            <strong>Date:</strong> {{ formatDate(appointmentToDelete?.date) }}
          </p>
          <p class="text-body-2 text-error">
            This action cannot be undone.
          </p>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="deleteDialog = false"
            :disabled="deleting"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="handleDelete"
            :loading="deleting"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { useAuth } from "@/utils/useAuth";
import {
  getStudentAppointments,
  updateStudentAppointment,
  deleteStudentAppointment,
  getStudents,
} from "@/utils/useDirectus";

const router = useRouter();
const theme = useTheme();
const { logout: authLogout, userData } = useAuth();

const drawer = ref(false);
const isDark = computed(() => theme.current.value.dark);
const logoutLoading = ref(false);

// Data refs
const appointments = ref<any[]>([]);
const students = ref<any[]>([]);
const viewDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);
const selectedAppointment = ref<any>(null);
const appointmentToDelete = ref<any>(null);
const appointmentForm = ref();

// Filter refs
const searchQuery = ref("");
const filterStatus = ref("all");
const filterDate = ref("");

// Form data
const formData = ref({
  id: null as string | null,
  date: "",
  purpose: "",
  status: "pending",
});

const statusOptions = ["pending", "scheduled", "completed", "cancelled"];

// Snackbar
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

// Table headers
const headers = [
  { title: "Student", key: "student", sortable: false },
  { title: "Date", key: "date", sortable: true },
  { title: "Purpose", key: "purpose", sortable: false },
  { title: "Status", key: "status", sortable: true },
  { title: "Actions", key: "actions", sortable: false, align: "center" as const },
];

// Computed stats
const totalAppointments = computed(() => appointments.value.length);
const pendingAppointments = computed(
  () => appointments.value.filter((a) => a.status === "pending").length
);
const scheduledAppointments = computed(
  () => appointments.value.filter((a) => a.status === "scheduled").length
);
const completedAppointments = computed(
  () => appointments.value.filter((a) => a.status === "completed").length
);

// Filtered appointments
const filteredAppointments = computed(() => {
  let filtered = appointments.value;

  // Filter by status
  if (filterStatus.value !== "all") {
    filtered = filtered.filter((a) => a.status === filterStatus.value);
  }

  // Filter by date
  if (filterDate.value) {
    filtered = filtered.filter((a) => a.date === filterDate.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.purpose?.toLowerCase().includes(query) ||
        getStudentName(a.student_id || a.user_created).toLowerCase().includes(query)
    );
  }

  return filtered;
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

const fetchData = async () => {
  try {
    const [appointmentsData, studentsData] = await Promise.all([
      getStudentAppointments(),
      getStudents(),
    ]);
    appointments.value = Array.isArray(appointmentsData) ? appointmentsData : [];
    students.value = Array.isArray(studentsData) ? studentsData : [];
  } catch (error) {
    console.error("Error fetching data:", error);
    showSnackbar("Error fetching appointments", "error");
  }
};

const getStudentName = (userId: string) => {
  const student = students.value.find((s) => s.id === userId);
  if (student) {
    return `${student.first_name} ${student.last_name}`;
  }
  return "Unknown Student";
};

const viewAppointment = (appointment: any) => {
  selectedAppointment.value = appointment;
  viewDialog.value = true;
};

const editAppointment = (appointment: any) => {
  formData.value = {
    id: appointment.id,
    date: appointment.date,
    purpose: appointment.purpose,
    status: appointment.status,
  };
  editDialog.value = true;
};

const confirmDelete = (appointment: any) => {
  appointmentToDelete.value = appointment;
  deleteDialog.value = true;
};

const handleDelete = async () => {
  if (!appointmentToDelete.value?.id) return;

  deleting.value = true;
  try {
    await deleteStudentAppointment(appointmentToDelete.value.id);
    showSnackbar("Appointment deleted successfully", "success");
    deleteDialog.value = false;
    appointmentToDelete.value = null;
    await fetchData();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    showSnackbar(`Error deleting appointment: ${error}`, "error");
  } finally {
    deleting.value = false;
  }
};

const saveAppointment = async () => {
  const form = appointmentForm.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  saving.value = true;
  try {
    const data = {
      date: formData.value.date,
      status: formData.value.status,
    };

    await updateStudentAppointment(formData.value.id!, data);

    showSnackbar("Appointment updated successfully", "success");

    closeEditDialog();
    await fetchData();
  } catch (error) {
    console.error("Error saving appointment:", error);
    showSnackbar(`Error saving appointment: ${error}`, "error");
  } finally {
    saving.value = false;
  }
};

const closeEditDialog = () => {
  editDialog.value = false;
  formData.value = {
    id: null,
    date: "",
    purpose: "",
    status: "pending",
  };
};

const clearFilters = () => {
  searchQuery.value = "";
  filterStatus.value = "all";
  filterDate.value = "";
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "warning",
    scheduled: "info",
    completed: "success",
    cancelled: "error",
  };
  return colors[status] || "grey";
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

const formatDateTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const showSnackbar = (message: string, color: string = "success") => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.purpose-cell {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
