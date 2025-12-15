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
          active
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
        <div class="mb-6">
          <h1 class="text-h4 font-weight-medium">Health Records Management</h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-0">
            View and manage all student health records
          </p>
        </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-account-heart</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ totalRecords }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Total Records</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="warning" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-alert-circle</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ recordsWithAllergies }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">With Allergies</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="error" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-medical-bag</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ recordsWithConditions }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Medical Conditions</p>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="info" size="56" class="mr-4">
              <v-icon color="white" size="28">mdi-pill</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h5 font-weight-bold">{{ recordsOnMedication }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">On Medication</p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card elevation="2">
      <v-card-title class="d-flex align-center justify-between">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-account-heart</v-icon>
          Student Health Records
        </div>
        <div class="d-flex align-center gap-2">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search records..."
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
            @click="$router.push('/create-health-record')"
          >
            New Health Record
          </v-btn>
        </div>
      </v-card-title>
      <v-divider />

      <v-data-table
        :headers="headers"
        :items="filteredRecords"
        :loading="loading"
        :search="search"
        class="elevation-0 health-records-table"
        :items-per-page="10"
      >
        <template v-slot:item.full_name="{ item }">
          <div class="d-flex align-center">
            <v-avatar :color="item.gender === 'male' ? 'blue' : 'pink'" size="32" class="mr-3">
              <v-icon color="white" size="small">
                {{ item.gender === 'male' ? 'mdi-gender-male' : 'mdi-gender-female' }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.first_name }} {{ item.last_name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.student_no }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.birthdate="{ item }">
          <div>
            {{ formatDate(item.birthdate) }}
            <div class="text-caption text-medium-emphasis">
              Age: {{ calculateAge(item.birthdate) }}
            </div>
          </div>
        </template>

        <template v-slot:item.contact_no="{ item }">
          <v-chip color="info" size="small" variant="outlined">
            {{ item.contact_no }}
          </v-chip>
        </template>

        <template v-slot:item.health_status="{ item }">
          <div class="d-flex flex-column gap-1">
            <v-chip
              v-if="item.has_allergies === 'yes'"
              color="success"
              variant="flat"
              size="small"
              label
            >
              Allergies
            </v-chip>
            <v-chip
              v-if="item.has_medical_condition === 'yes'"
              color="success"
              variant="flat"
              size="small"
              label
            >
              Medical Condition
            </v-chip>
            <v-chip
              v-if="item.is_taking_medication === 'yes'"
              color="success"
              variant="flat"
              size="small"
              label
            >
              On Medication
            </v-chip>
            <v-chip
              v-if="!hasHealthIssues(item)"
              color="success"
              variant="flat"
              size="small"
              label
            >
              Healthy
            </v-chip>
          </div>
        </template>

        <template v-slot:item.emergency_contact="{ item }">
          <div>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.relationship }}</div>
            <div class="text-caption">{{ item.contact }}</div>
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
              @click="editRecord(item)"
            >
              <v-icon size="small">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="error"
              @click="deleteRecord(item)"
            >
              <v-icon size="small">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="text-center py-8">
            <v-icon size="64" color="grey" class="mb-4">
              mdi-account-remove
            </v-icon>
            <h3 class="text-h6 mb-2">No health records found</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Get started by creating your first health record
            </p>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="$router.push('/create-health-record')"
            >
              Create Health Record
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Details/Edit Dialog -->
    <v-dialog v-model="detailsDialog" max-width="1000" persistent>
      <v-card v-if="selectedRecord">
        <v-card-title class="d-flex align-center justify-space-between bg-primary text-white pa-4">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-account-heart</v-icon>
            {{ isEditing ? 'Edit Health Record' : 'Health Record Details' }}
          </div>
          <v-btn icon variant="text" color="white" @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6" style="max-height: 80vh; overflow-y: auto;">
          <v-form ref="editForm" @submit.prevent="saveChanges">
            <!-- Action Buttons for Edit Mode -->
            <div class="d-flex justify-end mb-4 gap-2">
              <v-btn
                v-if="!isEditing"
                color="primary"
                prepend-icon="mdi-pencil"
                @click="startEditing"
              >
                Edit Record
              </v-btn>
              <template v-else>
                <v-btn
                  color="error"
                  variant="outlined"
                  prepend-icon="mdi-close"
                  @click="cancelEditing"
                  class="mr-2"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="success"
                  prepend-icon="mdi-content-save"
                  @click="saveChanges"
                  :loading="saving"
                >
                  Save Changes
                </v-btn>
              </template>
            </div>

            <v-row>
              <!-- Personal Information -->
              <v-col cols="12">
                <h4 class="text-h6 mb-3 text-primary">Personal Information</h4>
                <v-divider class="mb-4" />
              </v-col>
              
              <v-col cols="12" md="4">
                <v-text-field v-if="isEditing" v-model="editData.first_name" label="First Name" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>First Name:</strong><br/>{{ selectedRecord.first_name }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-if="isEditing" v-model="editData.middle_name" label="Middle Name" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Middle Name:</strong><br/>{{ selectedRecord.middle_name || '-' }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-if="isEditing" v-model="editData.last_name" label="Last Name" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Last Name:</strong><br/>{{ selectedRecord.last_name }}</div>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-if="isEditing" v-model="editData.student_no" label="Student Number" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Student Number:</strong><br/>{{ selectedRecord.student_no }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-if="isEditing" v-model="editData.birthdate" label="Birth Date" type="date" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Birth Date:</strong><br/>{{ formatDate(selectedRecord.birthdate) }} (Age: {{ calculateAge(selectedRecord.birthdate) }})</div>
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-if="isEditing" v-model="editData.gender" label="Gender" :items="['male', 'female', 'prefer_not_to_say']" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Gender:</strong><br/>{{ selectedRecord.gender }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-if="isEditing" v-model="editData.civil_status" label="Civil Status" :items="['single', 'married', 'widowed', 'other']" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Civil Status:</strong><br/>{{ selectedRecord.civil_status }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-if="isEditing" v-model="editData.contact_no" label="Contact Number" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Contact Number:</strong><br/>{{ selectedRecord.contact_no }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Are you a solo parent?</label>
                  <v-radio-group v-model="editData.is_solo_parent" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <div v-if="editData.is_solo_parent === 'yes'" class="pl-4 border-s-md mt-2">
                    <v-text-field v-model="editData.solo_parent_children" label="How many children do you have?" type="number" variant="outlined" density="compact" class="mb-2" />
                    <v-text-field v-model="editData.solo_parent_details" label="If yes, please specify" variant="outlined" density="compact" />
                  </div>
                </div>
                <div v-else class="mb-3">
                  <strong>Are you a solo parent?</strong>
                  <v-chip :color="selectedRecord.is_solo_parent === 'yes' ? 'warning' : 'grey'" size="small" class="ml-2">{{ selectedRecord.is_solo_parent === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.is_solo_parent === 'yes'" class="text-caption mt-1 ml-4">
                    Children: {{ selectedRecord.solo_parent_children }}<br>
                    Details: {{ selectedRecord.solo_parent_details }}
                  </div>
                </div>
              </v-col>

              <!-- Medical History -->
              <v-col cols="12" class="mt-4">
                <h4 class="text-h6 mb-3 text-primary">Medical History</h4>
                <v-divider class="mb-4" />
              </v-col>

              
              <!-- Medical History -->
              <v-col cols="12" class="mt-4">
                <h4 class="text-h6 mb-3 text-primary">Medical History</h4>
                <v-divider class="mb-4" />
              </v-col>

              <!-- Vaccination -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Have you been immunized or vaccinated in the past 12 months?</label>
                  <v-radio-group v-model="editData.is_vaccinated" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                </div>
                <div v-else class="mb-3">
                  <strong>Have you been immunized or vaccinated in the past 12 months?</strong>
                  <v-chip :color="selectedRecord.is_vaccinated === 'yes' ? 'success' : 'grey'" size="small" class="ml-2">{{ selectedRecord.is_vaccinated === 'yes' ? 'Yes' : 'No' }}</v-chip>
                </div>
              </v-col>

              <!-- Disability -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Are you a person with a disability (PWD)?</label>
                  <v-radio-group v-model="editData.is_disabled" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.is_disabled === 'yes'" v-model="editData.disability_details" label="If yes, please specify" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Are you a person with a disability (PWD)?</strong>
                  <v-chip :color="selectedRecord.is_disabled === 'yes' ? 'warning' : 'grey'" size="small" class="ml-2">{{ selectedRecord.is_disabled === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.is_disabled === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.disability_details }}</div>
                </div>
              </v-col>
              
              <!-- Allergies -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Do you have any allergies to medication, food, and other substances?</label>
                  <v-radio-group v-model="editData.has_allergies" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.has_allergies === 'yes'" v-model="editData.allergies_details" label="Please specify your allergies" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Do you have any allergies to medication, food, and other substances?</strong>
                  <v-chip :color="selectedRecord.has_allergies === 'yes' ? 'warning' : 'success'" size="small" class="ml-2">{{ selectedRecord.has_allergies === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.has_allergies === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.allergies_details }}</div>
                </div>
              </v-col>

              <!-- Medical Conditions -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Do you have an ongoing medical condition (i.e. diabetes, heart disease, asthma)?</label>
                  <v-radio-group v-model="editData.has_medical_condition" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.has_medical_condition === 'yes'" v-model="editData.medical_condition_details" label="Please specify your medical condition(s)" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Do you have an ongoing medical condition (i.e. diabetes, heart disease, asthma)?</strong>
                  <v-chip :color="selectedRecord.has_medical_condition === 'yes' ? 'error' : 'success'" size="small" class="ml-2">{{ selectedRecord.has_medical_condition === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.has_medical_condition === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.medical_condition_details }}</div>
                </div>
              </v-col>

              <!-- Medication -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Are you currently taking any medication aside from multivitamins?</label>
                  <v-radio-group v-model="editData.is_taking_medication" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.is_taking_medication === 'yes'" v-model="editData.medication_details" label="Please specify medications and dosage" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Are you currently taking any medication aside from multivitamins?</strong>
                  <v-chip :color="selectedRecord.is_taking_medication === 'yes' ? 'info' : 'grey'" size="small" class="ml-2">{{ selectedRecord.is_taking_medication === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.is_taking_medication === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.medication_details }}</div>
                </div>
              </v-col>

              <!-- Family Conditions -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Does anyone in your family have health conditions? (Hypertension, Tuberculosis, Cancer, Diabetes, Depression, Stroke, others)</label>
                  <v-radio-group v-model="editData.family_conditions" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.family_conditions === 'yes'" v-model="editData.family_conditions_details" label="Please specify family health conditions" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Does anyone in your family have health conditions? (Hypertension, Tuberculosis, Cancer, Diabetes, Depression, Stroke, others)</strong>
                  <v-chip :color="selectedRecord.family_conditions === 'yes' ? 'warning' : 'success'" size="small" class="ml-2">{{ selectedRecord.family_conditions === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.family_conditions === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.family_conditions_details }}</div>
                </div>
              </v-col>

              <!-- Operations/Hospitalization -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Have you had any medical illness or operation in the past 12 months?</label>
                  <v-radio-group v-model="editData.was_operated" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.was_operated === 'yes'" v-model="editData.operation_details" label="Please specify the illness or operation" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Have you had any medical illness or operation in the past 12 months?</strong>
                  <v-chip :color="selectedRecord.was_operated === 'yes' ? 'warning' : 'success'" size="small" class="ml-2">{{ selectedRecord.was_operated === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.was_operated === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.operation_details }}</div>
                </div>
              </v-col>

              <!-- Smoking -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Do you smoke cigarettes/E-cigarettes?</label>
                  <v-radio-group v-model="editData.is_smoking" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.is_smoking === 'yes'" v-model="editData.smoking_details" label="How frequently do you smoke?" variant="outlined" density="compact" />
                </div>
                 <div v-else class="mb-3">
                  <strong>Do you smoke cigarettes/E-cigarettes?</strong>
                  <v-chip :color="selectedRecord.is_smoking === 'yes' ? 'warning' : 'success'" size="small" class="ml-2">{{ selectedRecord.is_smoking === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.is_smoking === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.smoking_details }}</div>
                </div>
              </v-col>

              <!-- Alcohol -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Do you drink alcoholic beverages?</label>
                  <v-radio-group v-model="editData.is_drinking_alcohol" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.is_drinking_alcohol === 'yes'" v-model="editData.alcohol_details" label="How frequently do you drink?" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Do you drink alcoholic beverages?</strong>
                  <v-chip :color="selectedRecord.is_drinking_alcohol === 'yes' ? 'warning' : 'success'" size="small" class="ml-2">{{ selectedRecord.is_drinking_alcohol === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.is_drinking_alcohol === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.alcohol_details }}</div>
                </div>
              </v-col>

              <!-- Eye Problems -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Do you have eyesight problems / Wear eyeglasses or contact lenses?</label>
                  <v-radio-group v-model="editData.has_eye_problems" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.has_eye_problems === 'yes'" v-model="editData.eye_problems_details" label="Please specify your eye condition" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Do you have eyesight problems / Wear eyeglasses or contact lenses?</strong>
                  <v-chip :color="selectedRecord.has_eye_problems === 'yes' ? 'warning' : 'success'" size="small" class="ml-2">{{ selectedRecord.has_eye_problems === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.has_eye_problems === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.eye_problems_details }}</div>
                </div>
              </v-col>

              <!-- Hearing Problems -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Do you have hearing problems / Ear infections?</label>
                  <v-radio-group v-model="editData.has_hearing_problems" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.has_hearing_problems === 'yes'" v-model="editData.hearing_problems_details" label="Please specify your hearing condition" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Do you have hearing problems / Ear infections?</strong>
                  <v-chip :color="selectedRecord.has_hearing_problems === 'yes' ? 'warning' : 'success'" size="small" class="ml-2">{{ selectedRecord.has_hearing_problems === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.has_hearing_problems === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.hearing_problems_details }}</div>
                </div>
              </v-col>

              <!-- Exposure to Communicable Diseases -->
              <v-col cols="12" md="6">
                <div v-if="isEditing">
                  <label class="font-weight-medium mb-2 d-block">Have you been exposed to any communicable disease (chickenpox, TB, etc.)?</label>
                  <v-radio-group v-model="editData.is_exposed" inline density="compact">
                    <v-radio label="Yes" value="yes" color="primary"></v-radio>
                    <v-radio label="No" value="no" color="primary"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="editData.is_exposed === 'yes'" v-model="editData.exposure_details" label="Please specify the disease and exposure details" variant="outlined" density="compact" />
                </div>
                <div v-else class="mb-3">
                  <strong>Have you been exposed to any communicable disease (chickenpox, TB, etc.)?</strong>
                  <v-chip :color="selectedRecord.is_exposed === 'yes' ? 'warning' : 'success'" size="small" class="ml-2">{{ selectedRecord.is_exposed === 'yes' ? 'Yes' : 'No' }}</v-chip>
                  <div v-if="selectedRecord.is_exposed === 'yes'" class="text-caption mt-1 ml-4">Details: {{ selectedRecord.exposure_details }}</div>
                </div>
              </v-col>

              <!-- Emergency Contact -->
              <v-col cols="12" class="mt-4">
                <h4 class="text-h6 mb-3 text-primary">Emergency Contact</h4>
                <v-divider class="mb-4" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-if="isEditing" v-model="editData.name" label="Contact Name" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Contact Name:</strong><br/>{{ selectedRecord.name }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-if="isEditing" v-model="editData.relationship" label="Relationship" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Relationship:</strong><br/>{{ selectedRecord.relationship }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-if="isEditing" v-model="editData.contact" label="Contact Number" variant="outlined" density="compact" />
                <div v-else class="mb-3"><strong>Contact Number:</strong><br/>{{ selectedRecord.contact }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea v-if="isEditing" v-model="editData.address" label="Address" variant="outlined" density="compact" rows="2" />
                <div v-else class="mb-3"><strong>Address:</strong><br/>{{ selectedRecord.address }}</div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuth } from '@/utils/useAuth'
import { getHealthRecords, updateHealthRecord } from '@/utils/useDirectus'

const router = useRouter()
const theme = useTheme()
const { logout: authLogout, userData } = useAuth()

const drawer = ref(false)
const isDark = computed(() => theme.current.value.dark)
const logoutLoading = ref(false)
const loading = ref(false)
const search = ref('')
const detailsDialog = ref(false)
const selectedRecord = ref<any>(null)
const isEditing = ref(false)
const editData = ref<any>({})
const saving = ref(false)

const records = ref<any[]>([])

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
  { title: 'Student', key: 'full_name', sortable: true },
  { title: 'Birth Date', key: 'birthdate', sortable: true },
  { title: 'Contact', key: 'contact_no', sortable: true },
  { title: 'Health Status', key: 'health_status', sortable: false },
  { title: 'Emergency Contact', key: 'emergency_contact', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

// Computed statistics
const totalRecords = computed(() => records.value.length)

const recordsWithAllergies = computed(() =>
  records.value.filter(record => record.has_allergies === 'yes').length
)

const recordsWithConditions = computed(() =>
  records.value.filter(record => record.has_medical_condition === 'yes').length
)

const recordsOnMedication = computed(() =>
  records.value.filter(record => record.is_taking_medication === 'yes').length
)

const filteredRecords = computed(() => {
  if (!search.value) return records.value

  const searchLower = search.value.toLowerCase()
  return records.value.filter(record =>
    record.first_name?.toLowerCase().includes(searchLower) ||
    record.last_name?.toLowerCase().includes(searchLower) ||
    record.student_no?.toLowerCase().includes(searchLower) ||
    record.contact_no?.toLowerCase().includes(searchLower)
  )
})

const fetchRecords = async () => {
  loading.value = true
  try {
    const data = await getHealthRecords()
    records.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching health records:', error)
    alert('Error loading health records. Please try again.')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchRecords()
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

const calculateAge = (birthDate: string) => {
  if (!birthDate) return 'N/A'
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const hasHealthIssues = (record: any) => {
  return record.has_allergies === 'yes' ||
         record.has_medical_condition === 'yes' ||
         record.is_taking_medication === 'yes'
}

const viewDetails = (record: any) => {
  selectedRecord.value = record
  isEditing.value = false
  detailsDialog.value = true
}

const startEditing = () => {
  editData.value = JSON.parse(JSON.stringify(selectedRecord.value))
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editData.value = {}
}

const saveChanges = async () => {
  if (!editData.value.id) return

  saving.value = true
  try {
    await updateHealthRecord(editData.value.id, editData.value)
    
    // Update local record
    selectedRecord.value = { ...editData.value }
    const index = records.value.findIndex(r => r.id === editData.value.id)
    if (index !== -1) {
      records.value[index] = { ...editData.value }
    }
    
    isEditing.value = false
    alert('Health record updated successfully')
  } catch (error) {
    console.error('Error updating record:', error)
    alert('Failed to update health record')
  } finally {
    saving.value = false
  }
}

const editRecord = (record: any) => {
  viewDetails(record)
  startEditing()
}

const deleteRecord = async (record: any) => {
  if (confirm('Are you sure you want to delete this health record?')) {
    try {
      // Assuming deleteHealthRecord exists or using generic deleteItem if exposed
      // For now, let's assume we need to implement it or use what's available
      // The previous code had a TODO. I'll leave it as TODO or implement if requested.
      // But I should update the TODO message at least.
      alert('Delete functionality will be implemented in the next update.') 
    } catch (e) {
       console.error(e)
    }
  }
}

onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-1px);
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

/* Health Records Table Styling */
.health-records-table {
  font-size: 1rem !important;
}

:deep(.health-records-table .v-data-table__td) {
  font-size: 1rem !important;
  padding: 16px !important;
}

:deep(.health-records-table .v-data-table__th) {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  padding: 16px !important;
}

:deep(.health-records-table .v-chip) {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
}

:deep(.health-records-table .v-avatar) {
  font-size: 1rem !important;
}

:deep(.health-records-table .text-caption) {
  font-size: 0.875rem !important;
}
</style>
