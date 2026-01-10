<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height pa-0">
        <v-row no-gutters class="fill-height">
          <!-- Left side - Branding/Image for Desktop -->
          <v-col cols="12" lg="8" xl="9" class="hidden-md-and-down">
            <v-card
              class="fill-height d-flex align-center justify-center branding-section"
              color="white"
              flat
            >
              <div class="text-center pa-8">
                <div class="logo-container mb-8">
                  <img src="/cct-logo.png" alt="CCT Logo" class="cct-logo mb-4" />
                </div>
                <h1 class="display-1 font-weight-bold text-primary mb-6">CCT HRMS</h1>
                <h2 class="text-h4 text-primary font-weight-light mb-6">
                  Health Record Management System
                </h2>
                <p class="text-h6 text-primary opacity-90 mb-8 max-width">
                  Secure, efficient, and comprehensive healthcare data management solution
                </p>
                <div class="feature-highlights">
                  <v-chip color="secondary" class="ma-2" size="large">
                    <v-icon start>mdi-shield-check</v-icon>
                    Secure
                  </v-chip>
                  <v-chip color="secondary" class="ma-2" size="large">
                    <v-icon start>mdi-speedometer</v-icon>
                    Fast
                  </v-chip>
                  <v-chip color="secondary" class="ma-2" size="large">
                    <v-icon start>mdi-chart-line</v-icon>
                    Comprehensive
                  </v-chip>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Right side - Registration Form -->
          <v-col cols="12" lg="4" xl="3" class="d-flex align-center justify-center login-section">
            <div class="pa-8 login-content" style="max-width: 500px; width: 100%">
              <!-- Mobile Logo -->
              <div class="text-center mb-6 hidden-lg-and-up">
                <img src="/cct-logo.png" alt="CCT Logo" class="mobile-logo mb-4" />
                <h1 class="text-h4 font-weight-bold text-white mb-2">CCT HRMS</h1>
              </div>

              <div class="text-center mb-8">
                <h2 class="text-h4 font-weight-medium mb-2 text-white">Create Student Account</h2>
                <p class="text-body-1 text-white opacity-80">Sign up to get started</p>
              </div>

              <v-form @submit.prevent="handleRegistration" ref="registrationForm">
                <v-text-field
                  v-model="firstName"
                  label="First Name"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-outline"
                  :rules="nameRules"
                  class="mb-4 white-field"
                  color="primary"
                  rounded="lg"
                  required
                />
                <v-text-field
                  v-model="middleName"
                  label="Middle Name"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-outline"
                  class="mb-4 white-field"
                  color="primary"
                  rounded="lg"
                />
                <v-text-field
                  v-model="lastName"
                  label="Last Name"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-outline"
                  :rules="nameRules"
                  class="mb-4 white-field"
                  color="primary"
                  rounded="lg"
                  required
                />
                <v-text-field
                  v-model="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="emailRules"
                  class="mb-4 white-field"
                  color="primary"
                  rounded="lg"
                  required
                />
                <v-text-field
                  v-model="studentId"
                  label="Student ID"
                  variant="outlined"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  :rules="studentIdRules"
                  class="mb-4 white-field"
                  color="primary"
                  rounded="lg"
                  required
                />
                <v-select
                  v-model="sex"
                  label="Sex"
                  :items="sexOptions"
                  variant="outlined"
                  prepend-inner-icon="mdi-gender-male-female"
                  :rules="sexRules"
                  class="mb-4 white-field"
                  color="primary"
                  rounded="lg"
                  required
                />
                <v-select
                  v-model="department"
                  label="Department"
                  :items="departmentOptions"
                  variant="outlined"
                  prepend-inner-icon="mdi-school-outline"
                  :rules="departmentRules"
                  class="mb-4 white-field"
                  color="primary"
                  rounded="lg"
                  required
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="passwordRules"
                  class="mb-6 white-field"
                  color="primary"
                  rounded="lg"
                  required
                />

                <v-btn
                  type="submit"
                  color="secondary"
                  size="large"
                  block
                  :loading="loading"
                  :disabled="loading"
                  class="mb-4 login-btn"
                >
                  <template v-slot:loader>
                    <v-progress-circular indeterminate size="24"></v-progress-circular>
                  </template>
                  Create Account
                </v-btn>
              </v-form>

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mt-4"
                closable
                @click:close="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>

              <v-snackbar v-model="showSuccessSnackbar" :timeout="2000" color="white" top>
                <span class="black--text">{{ successMessage }}</span>
              </v-snackbar>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "@/utils/useApi";

const router = useRouter();
const registrationForm = ref();

const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const email = ref("");
const studentId = ref("");
const sex = ref("");
const department = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showSuccessSnackbar = ref(false);

const nameRules = [(v: string) => !!v || "Name is required"];
const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];
const studentIdRules = [(v: string) => !!v || "Student ID is required"];
const sexRules = [(v: string) => !!v || "Sex is required"];
const departmentRules = [(v: string) => !!v || "Department is required"];

const sexOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
];

const departmentOptions = [
  "Bachelor of Science in Computer Science",
  "Bachelor of Science in Tourism Management",
  "Bachelor of Elementary Education",
  "Bachelor of Secondary Education",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Hospitality Management",
  "Bachelor of Science in Criminology",
  "Bachelor of Arts in Psychology"
];
const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 8 || "Password must be at least 8 characters",
];

const api = useApi();

const getStudentRoleId = async () => {
  try {
    const { data } = await api("/roles?filter[name][_eq]=student").get();
    if (!data.value) {
      return null;
    }
    const response = data.value;
    return response.data?.[0]?.id;
  } catch (error) {
    console.error("Error fetching student role:", error);
    return null;
  }
};

const handleRegistration = async () => {
  console.log("handleRegistration started");
  const form = registrationForm.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  loading.value = true;
  console.log("loading set to true");
  errorMessage.value = "";
  successMessage.value = "";

  try {
    console.log("Fetching student role ID");
    const studentRoleId = await getStudentRoleId();
    console.log("Student role ID:", studentRoleId);
    if (!studentRoleId) {
      errorMessage.value = "Could not find student role. Please contact an administrator.";
      loading.value = false;
      console.log("loading set to false due to missing student role ID");
      return;
    }

    console.log("Creating user");
    const { data, error } = await api("/users").post({
      first_name: firstName.value,
      middle_name: middleName.value,
      last_name: lastName.value,
      email: email.value,
      student_id: studentId.value,
      sex: sex.value,
      department: department.value,
      password: password.value,
      role: studentRoleId,
    });

    console.log("API response - data:", data.value);
    console.log("API response - error:", error.value);

    if (error.value) {
      throw new Error(
        error.value?.data?.errors?.[0]?.message || "Registration failed. Please try again.",
      );
    }

    if (data.value) {
      successMessage.value = "Account created successfully! Redirecting to login...";
      showSuccessSnackbar.value = true;
      console.log("Success message set:", successMessage.value);
      setTimeout(() => {
        console.log("setTimeout callback started");
        loading.value = false;
        console.log("loading set to false in setTimeout");
        router.push("/");
        console.log("Redirecting to login");
      }, 2000);
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    errorMessage.value = error.message || "Registration failed. Please try again.";
    loading.value = false;
    console.log("loading set to false in catch block");
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.branding-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  position: relative;
  border-right: 1px solid #e0e0e0;
}

.branding-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23175833" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="%23175833" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="%23175833" opacity="0.02"/><circle cx="10" cy="60" r="0.5" fill="%23175833" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.cct-logo {
  width: 220px;
  height: 220px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.mobile-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.logo-container {
  position: relative;
}

.max-width {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.feature-highlights {
  margin-top: 2rem;
}

.login-section {
  background: linear-gradient(135deg, #175833 0%, #1e6b3f 100%);
  min-height: 100vh;
}

.login-content {
  background: transparent;
}

.login-btn {
  background: #eff316 !important;
  color: #175833 !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 243, 22, 0.3);
  transition: all 0.3s ease;
  background: #e8ec14 !important;
}

/* Mobile Responsiveness */
@media (max-width: 1263px) {
  .branding-section {
    display: none;
  }

  .login-section {
    background: linear-gradient(135deg, #175833 0%, #1e6b3f 100%);
    color: white;
  }

  .login-content {
    margin: 1rem;
  }
}

@media (max-width: 768px) {
  .login-content {
    margin: 0.5rem;
    padding: 1.5rem !important;
  }

  .mobile-logo {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .login-content {
    margin: 0.25rem;
    padding: 1rem !important;
  }
}

/* Enhanced form styling */
:deep(.v-field--outlined) {
  border-radius: 12px;
}

:deep(.v-field--outlined.v-field--focused .v-field__outline) {
  border-color: #175833;
  border-width: 2px;
}

:deep(.white-field .v-field) {
  background-color: white !important;
}

:deep(.white-field .v-field__input) {
  color: #175833 !important;
}

:deep(.white-field .v-field__field) {
  background-color: white !important;
}

:deep(.white-field .v-label) {
  color: #757575 !important;
}

:deep(.white-field .v-field--focused .v-label) {
  color: #175833 !important;
}

:deep(.white-field .v-icon) {
  color: #175833 !important;
}

:deep(.v-chip) {
  font-weight: 600;
  border-radius: 20px;
}

:deep(.v-chip--color-secondary) {
  background-color: #eff316 !important;
  color: #175833 !important;
}

/* Animation effects */
.feature-highlights .v-chip {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.feature-highlights .v-chip:nth-child(1) {
  animation-delay: 0.1s;
}

.feature-highlights .v-chip:nth-child(2) {
  animation-delay: 0.2s;
}

.feature-highlights .v-chip:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-container {
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
