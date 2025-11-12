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
          @click="$router.push('/student/home')"
        />
        <v-list-item
          prepend-icon="mdi-file-document"
          title="Health Record"
          value="health-record"
          @click="$router.push('/student/dashboard')"
        />
        <v-list-item
          prepend-icon="mdi-calendar-clock"
          title="Appointments"
          value="appointments"
          active
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <div class="mb-6">
          <div class="d-flex justify-between align-center">
            <div>
              <h1 class="text-h4 font-weight-medium">My Appointments</h1>
              <p class="text-subtitle-1 text-medium-emphasis mb-0">
                Book and manage your health appointments
              </p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openAddDialog"
            >
              Book Appointment
            </v-btn>
          </div>
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

        <!-- Appointments List -->
        <v-row>
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title>All Appointments</v-card-title>
              <v-divider />
              
              <v-list v-if="appointments.length > 0">
                <v-list-item
                  v-for="appointment in appointments"
                  :key="appointment.id"
                  class="appointment-item"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="getStatusColor(appointment.status)" size="48">
                      <v-icon color="white">mdi-calendar</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-h6 mb-1">
                    {{ appointment.purpose }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <div class="d-flex align-center mt-1">
                      <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                      {{ formatDate(appointment.date) }}
                    </div>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="d-flex align-center gap-2">
                      <v-chip
                        :color="getStatusColor(appointment.status)"
                        size="default"
                        variant="flat"
                      >
                        {{ appointment.status }}
                      </v-chip>
                      <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        size="small"
                        color="primary"
                        @click="editAppointment(appointment)"
                        v-if="appointment.status !== 'completed' && appointment.status !== 'cancelled'"
                      />
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        size="small"
                        color="error"
                        @click="confirmDelete(appointment)"
                        v-if="appointment.status === 'pending'"
                      />
                    </div>
                  </template>
                </v-list-item>
                <v-divider v-if="appointments.length > 1" />
              </v-list>

              <div v-else class="pa-8">
                <div class="text-center">
                  <v-icon size="80" color="grey-lighten-1">mdi-calendar-blank-outline</v-icon>
                  <h3 class="text-h5 mt-4 mb-2">No Appointments Yet</h3>
                  <p class="text-body-1 text-medium-emphasis mb-4">
                    Book your first appointment to get started
                  </p>
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
                    Book Appointment
                  </v-btn>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Add/Edit Appointment Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-calendar-plus</v-icon>
          {{ editMode ? 'Edit Appointment' : 'Book New Appointment' }}
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
              :min="minDate"
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
              placeholder="Describe the reason for your appointment..."
            />

            <v-select
              v-model="formData.status"
              label="Status"
              variant="outlined"
              prepend-inner-icon="mdi-flag"
              :items="statusOptions"
              :rules="[v => !!v || 'Status is required']"
              required
              :disabled="!editMode"
            />
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="closeDialog"
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
            {{ editMode ? 'Update' : 'Book Appointment' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="error">mdi-alert-circle</v-icon>
          Cancel Appointment
        </v-card-title>
        <v-divider />

        <v-card-text class="pt-4">
          <p class="text-body-1">
            Are you sure you want to cancel this appointment?
          </p>
          <p class="text-body-2 text-medium-emphasis">
            <strong>Date:</strong> {{ appointmentToDelete?.date }}
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
  createStudentAppointment,
  updateStudentAppointment,
  deleteStudentAppointment,
} from "@/utils/useDirectus";

const router = useRouter();
const theme = useTheme();
const { logout: authLogout, userData } = useAuth();

const drawer = ref(false);
const isDark = computed(() => theme.current.value.dark);
const logoutLoading = ref(false);

// Appointments data
const appointments = ref<any[]>([]);
const dialog = ref(false);
const deleteDialog = ref(false);
const editMode = ref(false);
const saving = ref(false);
const deleting = ref(false);
const appointmentToDelete = ref<any>(null);
const appointmentForm = ref();

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

// Minimum date (today)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

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

const fetchAppointments = async () => {
  try {
    const data = await getStudentAppointments();
    appointments.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    showSnackbar("Error fetching appointments", "error");
  }
};

const openAddDialog = () => {
  editMode.value = false;
  formData.value = {
    id: null,
    date: "",
    purpose: "",
    status: "pending",
  };
  dialog.value = true;
};

const editAppointment = (appointment: any) => {
  editMode.value = true;
  formData.value = {
    id: appointment.id,
    date: appointment.date,
    purpose: appointment.purpose,
    status: appointment.status,
  };
  dialog.value = true;
};

const confirmDelete = (appointment: any) => {
  appointmentToDelete.value = appointment;
  deleteDialog.value = true;
};

const handleDelete = async () => {
  if (!appointmentToDelete.value?.id) return;

  deleting.value = true;
  try {
    console.log("Deleting appointment:", appointmentToDelete.value.id);
    console.log("Appointment details:", appointmentToDelete.value);
    
    await deleteStudentAppointment(appointmentToDelete.value.id);
    showSnackbar("Appointment cancelled successfully", "success");
    deleteDialog.value = false;
    appointmentToDelete.value = null;
    await fetchAppointments();
  } catch (error: any) {
    console.error("Error deleting appointment:", error);
    const errorMsg = error?.errors?.[0]?.message || error?.message || "Unknown error occurred";
    showSnackbar(`Error cancelling appointment: ${errorMsg}`, "error");
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
      purpose: formData.value.purpose,
      status: formData.value.status,
      student_id: userData.value?.id,
    };

    console.log("Saving appointment with data:", data);
    console.log("Edit mode:", editMode.value, "ID:", formData.value.id);

    if (editMode.value && formData.value.id) {
      await updateStudentAppointment(formData.value.id, data);
    } else {
      await createStudentAppointment(data);
    }

    showSnackbar(
      editMode.value ? "Appointment updated successfully" : "Appointment booked successfully",
      "success"
    );

    closeDialog();
    await fetchAppointments();
  } catch (error: any) {
    console.error("Error saving appointment:", error);
    const errorMsg = error?.errors?.[0]?.message || error?.message || "Unknown error occurred";
    showSnackbar(`Error saving appointment: ${errorMsg}`, "error");
  } finally {
    saving.value = false;
  }
};

const closeDialog = () => {
  dialog.value = false;
  formData.value = {
    id: null,
    date: "",
    purpose: "",
    status: "pending",
  };
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

const showSnackbar = (message: string, color: string = "success") => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(() => {
  fetchAppointments();
});
</script>

<style scoped>
.appointment-item {
  padding: 16px;
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
