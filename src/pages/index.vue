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

          <!-- Right side - Login Form -->
          <v-col cols="12" lg="4" xl="3" class="d-flex align-center justify-center login-section">
            <div class="pa-8 login-content" style="max-width: 500px; width: 100%">
              <!-- Mobile Logo -->
              <div class="text-center mb-6 hidden-lg-and-up">
                <img src="/cct-logo.png" alt="CCT Logo" class="mobile-logo mb-4" />
                <h1 class="text-h4 font-weight-bold text-white mb-2">CCT HRMS</h1>
              </div>

              <div class="text-center mb-8">
                <h2 class="text-h4 font-weight-medium mb-2 text-white">Welcome Back</h2>
                <p class="text-body-1 text-white opacity-80">Sign in to your account to continue</p>
              </div>

              <!-- Login Type Selection -->
              <div class="mb-6">
                <v-btn-toggle
                  v-model="loginType"
                  color="secondary"
                  variant="outlined"
                  divided
                  class="w-100 login-type-toggle"
                >
                  <v-btn value="admin" class="flex-grow-1">
                    <v-icon start>mdi-account-supervisor</v-icon>
                    Login as Admin
                  </v-btn>
                  <v-btn value="student" class="flex-grow-1">
                    <v-icon start>mdi-account-school</v-icon>
                    Login as Student
                  </v-btn>
                </v-btn-toggle>
              </div>

              <v-form @submit.prevent="handleLogin" ref="loginForm">
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
                  class="mb-4 login-btn"
                  @click="requestLogin"
                >
                  Sign In
                </v-btn>

                <div class="text-center">
                  <v-btn variant="text" color="secondary" size="small"> Forgot Password? </v-btn>
                </div>
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
import { useAuth } from "@/utils/useAuth";
import { validateUserRole } from "@/utils/useDirectus";

const router = useRouter();
const loginForm = ref();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const loginType = ref("admin"); // Default to admin login

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6 || "Password must be at least 6 characters",
];

const { login, logout } = useAuth();

const handleLogin = async () => {
  const form = loginForm.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    // Attempt login
    const loginResult = await login(email.value, password.value);
    
    // If login type is student, validate role before proceeding
    if (loginType.value === "student") {
      // Check if user data exists in session storage
      const storedUserData = sessionStorage.getItem("userData");
      if (!storedUserData) {
        await logout();
        errorMessage.value = "User data not found. Please log in again.";
        return;
      }
      
      let userData;
      try {
        userData = JSON.parse(storedUserData);
      } catch (e) {
        await logout();
        errorMessage.value = "User data not found. Please log in again.";
        return;
      }
      
      // Validate user role
      if (!userData.role) {
        await logout();
        errorMessage.value = "Access denied. This account is not registered as a student.";
        return;
      }
      
      const { isValid, roleName } = await validateUserRole(userData.role);
      
      if (!isValid) {
        await logout();
        errorMessage.value = roleName 
          ? "Access denied. This account is not registered as a student."
          : "Access denied. Unable to verify account permissions.";
        return;
      }
      
      // Navigate to student dashboard
      await router.push("/student/dashboard");
    } else {
      // Admin login - validate role before proceeding
      const storedUserData = sessionStorage.getItem("userData");
      if (!storedUserData) {
        await logout();
        errorMessage.value = "User data not found. Please log in again.";
        return;
      }
      
      let userData;
      try {
        userData = JSON.parse(storedUserData);
      } catch (e) {
        await logout();
        errorMessage.value = "User data not found. Please log in again.";
        return;
      }
      
      // Validate user role for admin login
      if (userData.role) {
        const { isValid, roleName } = await validateUserRole(userData.role);
        
        // For admin login, reject if user has student role
        if (isValid) { // isValid means it's a student role
          await logout();
          errorMessage.value = "Access denied. Student accounts must use 'Login as Student' option.";
          return;
        }
      }
      
      // Navigate to admin dashboard
      await router.push("/home");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    errorMessage.value =
      error?.message || "Login failed. Please check your credentials and try again.";
    
    // Clear session data on login failure
    await logout();
  } finally {
    loading.value = false;
  }
};

const requestLogin = handleLogin;
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

/* Login type toggle styling */
.login-type-toggle {
  margin-bottom: 1rem;
}

:deep(.login-type-toggle .v-btn) {
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  text-transform: none;
  font-weight: 500;
}

:deep(.login-type-toggle .v-btn--active) {
  background-color: #eff316 !important;
  color: #175833 !important;
  border-color: #eff316 !important;
}

:deep(.login-type-toggle .v-btn:not(.v-btn--active):hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
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
