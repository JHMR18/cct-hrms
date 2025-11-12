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
          prepend-icon="mdi-bullhorn"
          title="Announcements"
          value="announcements"
          active
        />
        <v-list-item prepend-icon="mdi-chart-line" title="Reports" value="reports" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <div class="mb-6">
          <div class="d-flex justify-between align-center">
            <div>
              <h1 class="text-h4 font-weight-medium">Announcements Management</h1>
              <p class="text-subtitle-1 text-medium-emphasis mb-0">
                Create and manage announcements for students and staff
              </p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openAddDialog"
            >
              Add Announcement
            </v-btn>
          </div>
        </div>

        <!-- Stats Cards -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" elevation="2">
              <div class="d-flex align-center">
                <v-avatar color="primary" size="56" class="mr-4">
                  <v-icon color="white" size="28">mdi-bullhorn</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5 font-weight-bold">{{ totalAnnouncements }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Total Announcements</p>
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
                  <h3 class="text-h5 font-weight-bold">{{ publishedAnnouncements }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Published</p>
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
                  <h3 class="text-h5 font-weight-bold">{{ draftAnnouncements }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Drafts</p>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4" elevation="2">
              <div class="d-flex align-center">
                <v-avatar color="error" size="56" class="mr-4">
                  <v-icon color="white" size="28">mdi-archive</v-icon>
                </v-avatar>
                <div>
                  <h3 class="text-h5 font-weight-bold">{{ archivedAnnouncements }}</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Archived</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Announcements Grid -->
        <v-row>
          <v-col v-for="announcement in announcements" :key="announcement.id" cols="12" md="6" lg="4">
            <v-card elevation="2" class="h-100">
              <v-img
                v-if="announcement.image"
                :src="getImageUrl(announcement.image)"
                height="200"
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
                src="https://via.placeholder.com/400x200?text=No+Image"
                height="200"
                cover
              />

              <v-card-title class="d-flex justify-between align-start">
                <span class="text-h6">{{ announcement.title }}</span>
                <v-chip
                  :color="getStatusColor(announcement.status)"
                  size="small"
                  variant="flat"
                >
                  {{ announcement.status }}
                </v-chip>
              </v-card-title>

              <v-card-text>
                <p class="text-body-2 line-clamp-3">
                  {{ announcement.body }}
                </p>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-eye"
                  @click="viewAnnouncement(announcement)"
                >
                  View
                </v-btn>
                <v-spacer />
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="primary"
                  @click="editAnnouncement(announcement)"
                />
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  size="small"
                  color="error"
                  @click="confirmDelete(announcement)"
                />
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col v-if="announcements.length === 0" cols="12">
            <v-card elevation="2" class="pa-8">
              <div class="text-center">
                <v-icon size="80" color="grey-lighten-1">mdi-bullhorn-outline</v-icon>
                <h3 class="text-h5 mt-4 mb-2">No Announcements Yet</h3>
                <p class="text-body-1 text-medium-emphasis mb-4">
                  Create your first announcement to get started
                </p>
                <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
                  Add Announcement
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Add/Edit Announcement Dialog -->
    <v-dialog v-model="dialog" max-width="800" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-bullhorn</v-icon>
          {{ editMode ? 'Edit Announcement' : 'Add New Announcement' }}
        </v-card-title>
        <v-divider />

        <v-card-text class="pt-6">
          <v-form ref="announcementForm" @submit.prevent="saveAnnouncement">
            <v-text-field
              v-model="formData.title"
              label="Title"
              variant="outlined"
              prepend-inner-icon="mdi-format-title"
              :rules="[v => !!v || 'Title is required']"
              required
              class="mb-4"
            />

            <v-textarea
              v-model="formData.body"
              label="Body"
              variant="outlined"
              prepend-inner-icon="mdi-text"
              :rules="[v => !!v || 'Body is required']"
              rows="5"
              required
              class="mb-4"
            />

            <v-file-input
              v-model="imageFile"
              label="Image"
              variant="outlined"
              prepend-inner-icon="mdi-image"
              accept="image/*"
              @change="handleImageChange"
              class="mb-4"
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
            @click="closeDialog"
            :disabled="saving"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="saveAnnouncement"
            :loading="saving"
          >
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Announcement Dialog -->
    <v-dialog v-model="viewDialog" max-width="800">
      <v-card v-if="selectedAnnouncement">
        <v-img
          v-if="selectedAnnouncement.image"
          :src="getImageUrl(selectedAnnouncement.image)"
          height="300"
          cover
        />
        
        <v-card-title class="d-flex justify-between align-center">
          <span>{{ selectedAnnouncement.title }}</span>
          <v-chip
            :color="getStatusColor(selectedAnnouncement.status)"
            size="small"
            variant="flat"
          >
            {{ selectedAnnouncement.status }}
          </v-chip>
        </v-card-title>

        <v-card-text>
          <p class="text-body-1">{{ selectedAnnouncement.body }}</p>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-btn
            color="error"
            variant="text"
            prepend-icon="mdi-delete"
            @click="confirmDelete(selectedAnnouncement); viewDialog = false"
          >
            Delete
          </v-btn>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="viewDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="error">mdi-alert-circle</v-icon>
          Confirm Delete
        </v-card-title>
        <v-divider />

        <v-card-text class="pt-4">
          <p class="text-body-1">
            Are you sure you want to delete this announcement?
          </p>
          <p class="text-body-2 text-medium-emphasis">
            <strong>{{ announcementToDelete?.title }}</strong>
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
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, uploadFile } from "@/utils/useDirectus";

const router = useRouter();
const theme = useTheme();
const { logout: authLogout, userData } = useAuth();

const drawer = ref(false);
const isDark = computed(() => theme.current.value.dark);
const logoutLoading = ref(false);

// Announcements data
const announcements = ref<any[]>([]);
const dialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const editMode = ref(false);
const saving = ref(false);
const deleting = ref(false);
const selectedAnnouncement = ref<any>(null);
const announcementToDelete = ref<any>(null);
const announcementForm = ref();
const imageFile = ref<File | File[] | null>(null);

// Form data
const formData = ref({
  id: null as string | null,
  title: "",
  body: "",
  image: null as string | null,
  status: "draft",
});

const statusOptions = ["published", "draft", "archived"];

// Snackbar
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

// Computed stats
const totalAnnouncements = computed(() => announcements.value.length);
const publishedAnnouncements = computed(
  () => announcements.value.filter((a) => a.status === "published").length
);
const draftAnnouncements = computed(
  () => announcements.value.filter((a) => a.status === "draft").length
);
const archivedAnnouncements = computed(
  () => announcements.value.filter((a) => a.status === "archived").length
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

const fetchAnnouncements = async () => {
  try {
    const data = await getAnnouncements();
    announcements.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching announcements:", error);
    showSnackbar("Error fetching announcements", "error");
  }
};

const openAddDialog = () => {
  editMode.value = false;
  formData.value = {
    id: null,
    title: "",
    body: "",
    image: null,
    status: "draft",
  };
  imageFile.value = null;
  dialog.value = true;
};

const editAnnouncement = (announcement: any) => {
  editMode.value = true;
  formData.value = {
    id: announcement.id,
    title: announcement.title,
    body: announcement.body,
    image: announcement.image,
    status: announcement.status,
  };
  selectedAnnouncement.value = announcement;
  imageFile.value = null;
  dialog.value = true;
};

const viewAnnouncement = (announcement: any) => {
  selectedAnnouncement.value = announcement;
  viewDialog.value = true;
};

const confirmDelete = (announcement: any) => {
  announcementToDelete.value = announcement;
  deleteDialog.value = true;
};

const handleDelete = async () => {
  if (!announcementToDelete.value?.id) return;

  deleting.value = true;
  try {
    await deleteAnnouncement(announcementToDelete.value.id);
    showSnackbar("Announcement deleted successfully", "success");
    deleteDialog.value = false;
    announcementToDelete.value = null;
    await fetchAnnouncements();
  } catch (error) {
    console.error("Error deleting announcement:", error);
    showSnackbar(`Error deleting announcement: ${error}`, "error");
  } finally {
    deleting.value = false;
  }
};

const handleImageChange = async (event: any) => {
  console.log("Image changed:", imageFile.value);
  // The file is already bound to imageFile.value by v-model
  // Just log it for debugging
};

const saveAnnouncement = async () => {
  const form = announcementForm.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  saving.value = true;
  try {
    let imageId = formData.value.image;

    // Upload image if a new file was selected
    if (imageFile.value) {
      console.log("Uploading image...", imageFile.value);
      
      // Handle both single file and array formats
      const file = Array.isArray(imageFile.value) 
        ? imageFile.value[0] 
        : imageFile.value;
      
      if (file instanceof File) {
        console.log("File to upload:", file.name, file.type, file.size);
        const uploadResult = await uploadFile(file);
        console.log("Upload result:", uploadResult);
        imageId = uploadResult.id;
      }
    }

    const data = {
      title: formData.value.title,
      body: formData.value.body,
      status: formData.value.status,
      image: imageId,
    };

    console.log("Saving announcement:", data, "Edit mode:", editMode.value);

    if (editMode.value && formData.value.id) {
      // Update existing announcement
      await updateAnnouncement(formData.value.id, data);
    } else {
      // Create new announcement
      await createAnnouncement(data);
    }
    
    showSnackbar(
      editMode.value ? "Announcement updated successfully" : "Announcement created successfully",
      "success"
    );
    
    closeDialog();
    await fetchAnnouncements();
  } catch (error) {
    console.error("Error saving announcement:", error);
    showSnackbar(`Error saving announcement: ${error}`, "error");
  } finally {
    saving.value = false;
  }
};

const closeDialog = () => {
  dialog.value = false;
  formData.value = {
    id: null,
    title: "",
    body: "",
    image: null,
    status: "draft",
  };
  imageFile.value = null;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    published: "success",
    draft: "warning",
    archived: "error",
  };
  return colors[status] || "grey";
};

const getImageUrl = (imageId: string) => {
  if (!imageId) return "";
  const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";
  return `${baseUrl}/assets/${imageId}`;
};

const showSnackbar = (message: string, color: string = "success") => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(() => {
  fetchAnnouncements();
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
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
