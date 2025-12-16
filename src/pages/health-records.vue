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
        <v-list-item 
          prepend-icon="mdi-chart-line" 
          title="Reports" 
          value="reports" 
          @click="$router.push('/reports')"
        />
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
            <!-- Action Buttons -->
            <div class="d-flex justify-end mb-6 gap-2 sticky-header">
              <v-btn
                v-if="!isEditing"
                color="primary"
                prepend-icon="mdi-pencil"
                @click="startEditing"
                variant="flat"
              >
                Edit Record
              </v-btn>
              <template v-else>
                <v-btn
                  color="error"
                  variant="text"
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
                  variant="flat"
                >
                  Save Changes
                </v-btn>
              </template>
            </div>

            <v-row>
              <!-- SECTION 1: Personal Information -->
              <v-col cols="12">
                <v-card variant="outlined" class="mb-4 rounded-lg border-opacity-50" :color="isEditing ? 'primary' : ''">
                  <v-card-item>
                    <template v-slot:prepend>
                      <v-icon color="primary" class="mr-2">mdi-account-details</v-icon>
                    </template>
                    <v-card-title class="text-h6 text-primary font-weight-bold">Personal Information</v-card-title>
                  </v-card-item>
                  <v-divider></v-divider>
                  <v-card-text class="pt-4">
                    <v-row>
                      <!-- Name Fields -->
                      <v-col cols="12" md="4">
                        <v-text-field v-if="isEditing" v-model="editData.first_name" label="First Name" variant="outlined" density="compact" hide-details="auto" class="mb-2" />
                        <div v-else class="info-block">
                          <span class="label">First Name</span>
                          <span class="value">{{ selectedRecord.first_name }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-if="isEditing" v-model="editData.middle_name" label="Middle Name" variant="outlined" density="compact" hide-details="auto" class="mb-2" />
                        <div v-else class="info-block">
                          <span class="label">Middle Name</span>
                          <span class="value">{{ selectedRecord.middle_name || '-' }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-if="isEditing" v-model="editData.last_name" label="Last Name" variant="outlined" density="compact" hide-details="auto" class="mb-2" />
                        <div v-else class="info-block">
                          <span class="label">Last Name</span>
                          <span class="value">{{ selectedRecord.last_name }}</span>
                        </div>
                      </v-col>

                      <!-- Student Info -->
                      <v-col cols="12" md="4">
                        <v-text-field v-if="isEditing" v-model="editData.student_no" label="Student Number" variant="outlined" density="compact" hide-details="auto" class="mb-2" />
                        <div v-else class="info-block">
                          <span class="label">Student Number</span>
                          <span class="value font-weight-medium">{{ selectedRecord.student_no }}</span>
                        </div>
                      </v-col>
                      
                       <v-col cols="12" md="4">
                        <v-select v-if="isEditing" v-model="editData.gender" label="Gender" :items="['male', 'female', 'prefer_not_to_say']" variant="outlined" density="compact" hide-details="auto" class="mb-2" />
                        <div v-else class="info-block">
                          <span class="label">Gender</span>
                          <span class="value text-capitalize">{{ selectedRecord.gender }}</span>
                        </div>
                      </v-col>
                      
                       <v-col cols="12" md="4">
                        <v-select v-if="isEditing" v-model="editData.civil_status" label="Civil Status" :items="['single', 'married', 'widowed', 'other']" variant="outlined" density="compact" hide-details="auto" class="mb-2" />
                        <div v-else class="info-block">
                          <span class="label">Civil Status</span>
                          <span class="value text-capitalize">{{ selectedRecord.civil_status }}</span>
                        </div>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field v-if="isEditing" v-model="editData.birthdate" label="Birth Date" type="date" variant="outlined" density="compact" hide-details="auto" class="mb-2" />
                        <div v-else class="info-block">
                          <span class="label">Birth Date</span>
                          <span class="value">{{ formatDate(selectedRecord.birthdate) }} <small class="text-medium-emphasis">(Age: {{ calculateAge(selectedRecord.birthdate) }})</small></span>
                        </div>
                      </v-col>
                      
                      <v-col cols="12" md="4">
                        <v-text-field v-if="isEditing" v-model="editData.contact_no" label="Contact Number" variant="outlined" density="compact" hide-details="auto" class="mb-2" />
                        <div v-else class="info-block">
                          <span class="label">Contact Number</span>
                          <span class="value">{{ selectedRecord.contact_no }}</span>
                        </div>
                      </v-col>
                      
                       <!-- Solo Parent Status -->
                      <v-col cols="12" md="4">
                        <div v-if="isEditing">
                           <v-checkbox v-model="editData.is_solo_parent" label="Solo Parent?" true-value="yes" false-value="no" density="compact" hide-details color="primary"></v-checkbox>
                            <div v-if="editData.is_solo_parent === 'yes'" class="pl-4 border-s-md mt-2">
                               <v-text-field v-model="editData.solo_parent_children" label="Number of children" type="number" variant="outlined" density="compact" class="mb-2" hide-details="auto"/>
                               <v-text-field v-model="editData.solo_parent_details" label="Details" variant="outlined" density="compact" hide-details="auto"/>
                            </div>
                        </div>
                        <div v-else class="info-block">
                          <span class="label">Solo Parent</span>
                          <div class="d-flex align-center mt-1">
                             <v-chip :color="selectedRecord.is_solo_parent === 'yes' ? 'warning' : 'grey-lighten-2'" size="small" variant="flat" label>
                                {{ selectedRecord.is_solo_parent === 'yes' ? 'Yes' : 'No' }}
                            </v-chip>
                             <div v-if="selectedRecord.is_solo_parent === 'yes'" class="ml-3 text-caption">
                                <strong>{{ selectedRecord.solo_parent_children }} Children</strong> • {{ selectedRecord.solo_parent_details }}
                             </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- SECTION 2: Medical History & Conditions -->
              <v-col cols="12">
                 <v-card variant="outlined" class="mb-4 rounded-lg border-opacity-50" :color="isEditing ? 'error' : ''">
                  <v-card-item>
                    <template v-slot:prepend>
                      <v-icon color="error" class="mr-2">mdi-medical-bag</v-icon>
                    </template>
                    <v-card-title class="text-h6 text-error font-weight-bold">Medical History</v-card-title>
                  </v-card-item>
                  <v-divider></v-divider>
                  <v-card-text class="pt-4">
                    <v-row>
                        <!-- Helper component for Q&A pairs to reduce code duplication could be nice, but keeping it simple inline -->
                        
                        <!-- Vaccination -->
                         <v-col cols="12" md="6">
                            <div class="condition-item">
                                <div class="condition-header mb-1">Immunized/Vaccinated (last 12 mos)</div>
                                <div v-if="isEditing">
                                   <v-radio-group v-model="editData.is_vaccinated" inline density="compact" hide-details>
                                      <v-radio label="Yes" value="yes" color="success"></v-radio>
                                      <v-radio label="No" value="no" color="grey"></v-radio>
                                   </v-radio-group>
                                </div>
                                <div v-else>
                                    <v-chip :color="selectedRecord.is_vaccinated === 'yes' ? 'success' : 'grey-lighten-2'" label size="small">
                                         {{ selectedRecord.is_vaccinated === 'yes' ? 'Yes' : 'No' }}
                                    </v-chip>
                                </div>
                            </div>
                        </v-col>

                        <!-- PWD -->
                        <v-col cols="12" md="6">
                            <div class="condition-item">
                                <div class="condition-header mb-1">Person with Disability (PWD)</div>
                                <div v-if="isEditing">
                                    <v-radio-group v-model="editData.is_disabled" inline density="compact" hide-details>
                                      <v-radio label="Yes" value="yes" color="warning"></v-radio>
                                      <v-radio label="No" value="no" color="grey"></v-radio>
                                   </v-radio-group>
                                   <v-text-field v-if="editData.is_disabled === 'yes'" v-model="editData.disability_details" label="Specify Disability" variant="outlined" density="compact" class="mt-2" hide-details="auto"/>
                                </div>
                                <div v-else>
                                    <div class="d-flex align-start">
                                        <v-chip :color="selectedRecord.is_disabled === 'yes' ? 'warning' : 'grey-lighten-2'" label size="small" class="mr-2">
                                             {{ selectedRecord.is_disabled === 'yes' ? 'Yes' : 'No' }}
                                        </v-chip>
                                        <div v-if="selectedRecord.is_disabled === 'yes'" class="detail-box warning-box">
                                            {{ selectedRecord.disability_details }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12"><v-divider class="my-2 dashed"></v-divider></v-col>

                        <!-- Allergies -->
                         <v-col cols="12" md="6">
                            <div class="condition-item">
                                <div class="condition-header mb-1">Allergies</div>
                                <div v-if="isEditing">
                                    <v-radio-group v-model="editData.has_allergies" inline density="compact" hide-details>
                                      <v-radio label="Yes" value="yes" color="error"></v-radio>
                                      <v-radio label="No" value="no" color="success"></v-radio>
                                   </v-radio-group>
                                   <v-textarea v-if="editData.has_allergies === 'yes'" v-model="editData.allergies_details" label="Specify Allergies" variant="outlined" density="compact" rows="2" class="mt-2" hide-details="auto"/>
                                </div>
                                <div v-else>
                                    <div class="d-flex align-start flex-column">
                                        <v-chip :color="selectedRecord.has_allergies === 'yes' ? 'error' : 'success'" label size="small" class="mb-2">
                                             {{ selectedRecord.has_allergies === 'yes' ? 'Yes' : 'No' }}
                                        </v-chip>
                                        <div v-if="selectedRecord.has_allergies === 'yes'" class="detail-box error-box w-100">
                                            <v-icon size="small" color="error" class="mr-1">mdi-alert-circle-outline</v-icon>
                                            {{ selectedRecord.allergies_details }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>

                        <!-- Medical Condition -->
                        <v-col cols="12" md="6">
                            <div class="condition-item">
                                <div class="condition-header mb-1">Ongoing Medical Condition</div>
                                <div v-if="isEditing">
                                    <v-radio-group v-model="editData.has_medical_condition" inline density="compact" hide-details>
                                      <v-radio label="Yes" value="yes" color="error"></v-radio>
                                      <v-radio label="No" value="no" color="success"></v-radio>
                                   </v-radio-group>
                                   <v-textarea v-if="editData.has_medical_condition === 'yes'" v-model="editData.medical_condition_details" label="Specify Condition(s)" variant="outlined" density="compact" rows="2" class="mt-2" hide-details="auto"/>
                                </div>
                                <div v-else>
                                    <div class="d-flex align-start flex-column">
                                        <v-chip :color="selectedRecord.has_medical_condition === 'yes' ? 'error' : 'success'" label size="small" class="mb-2">
                                             {{ selectedRecord.has_medical_condition === 'yes' ? 'Yes' : 'No' }}
                                        </v-chip>
                                        <div v-if="selectedRecord.has_medical_condition === 'yes'" class="detail-box error-box w-100">
                                            <v-icon size="small" color="error" class="mr-1">mdi-doctor</v-icon>
                                            {{ selectedRecord.medical_condition_details }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12"><v-divider class="my-2 dashed"></v-divider></v-col>

                        <!-- Medication -->
                        <v-col cols="12" md="6">
                            <div class="condition-item">
                                <div class="condition-header mb-1">Taking Medication</div>
                                <div v-if="isEditing">
                                    <v-radio-group v-model="editData.is_taking_medication" inline density="compact" hide-details>
                                      <v-radio label="Yes" value="yes" color="info"></v-radio>
                                      <v-radio label="No" value="no" color="grey"></v-radio>
                                   </v-radio-group>
                                   <v-textarea v-if="editData.is_taking_medication === 'yes'" v-model="editData.medication_details" label="Medication & Dosage" variant="outlined" density="compact" rows="2" class="mt-2" hide-details="auto"/>
                                </div>
                                <div v-else>
                                    <div class="d-flex align-start flex-column">
                                        <v-chip :color="selectedRecord.is_taking_medication === 'yes' ? 'info' : 'grey-lighten-2'" label size="small" class="mb-2">
                                             {{ selectedRecord.is_taking_medication === 'yes' ? 'Yes' : 'No' }}
                                        </v-chip>
                                        <div v-if="selectedRecord.is_taking_medication === 'yes'" class="detail-box info-box w-100">
                                            <v-icon size="small" color="info" class="mr-1">mdi-pill</v-icon>
                                            {{ selectedRecord.medication_details }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>

                         <!-- Operations -->
                        <v-col cols="12" md="6">
                            <div class="condition-item">
                                <div class="condition-header mb-1">Past Operation/Illness (12 mos)</div>
                                <div v-if="isEditing">
                                    <v-radio-group v-model="editData.was_operated" inline density="compact" hide-details>
                                      <v-radio label="Yes" value="yes" color="warning"></v-radio>
                                      <v-radio label="No" value="no" color="success"></v-radio>
                                   </v-radio-group>
                                   <v-textarea v-if="editData.was_operated === 'yes'" v-model="editData.operation_details" label="Details" variant="outlined" density="compact" rows="2" class="mt-2" hide-details="auto"/>
                                </div>
                                <div v-else>
                                     <div class="d-flex align-start flex-column">
                                        <v-chip :color="selectedRecord.was_operated === 'yes' ? 'warning' : 'success'" label size="small" class="mb-2">
                                             {{ selectedRecord.was_operated === 'yes' ? 'Yes' : 'No' }}
                                        </v-chip>
                                        <div v-if="selectedRecord.was_operated === 'yes'" class="detail-box warning-box w-100">
                                            {{ selectedRecord.operation_details }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>

                         <v-col cols="12"><v-divider class="my-2 dashed"></v-divider></v-col>

                        <!-- Family History -->
                        <v-col cols="12">
                             <div class="condition-item">
                                <div class="condition-header mb-1">Family Health History</div>
                                <div class="text-caption text-medium-emphasis mb-2">Hypertension, Tuberculosis, Cancer, Diabetes, Depression, Stroke, etc.</div>
                                <div v-if="isEditing">
                                    <v-radio-group v-model="editData.family_conditions" inline density="compact" hide-details>
                                      <v-radio label="Yes" value="yes" color="warning"></v-radio>
                                      <v-radio label="No" value="no" color="success"></v-radio>
                                   </v-radio-group>
                                   <v-textarea v-if="editData.family_conditions === 'yes'" v-model="editData.family_conditions_details" label="Specify Family Conditions" variant="outlined" density="compact" rows="2" class="mt-2" hide-details="auto"/>
                                </div>
                                <div v-else>
                                     <div class="d-flex align-start flex-column">
                                        <v-chip :color="selectedRecord.family_conditions === 'yes' ? 'warning' : 'success'" label size="small" class="mb-2">
                                             {{ selectedRecord.family_conditions === 'yes' ? 'Yes' : 'No' }}
                                        </v-chip>
                                        <div v-if="selectedRecord.family_conditions === 'yes'" class="detail-box warning-box w-100">
                                            <v-icon size="small" color="warning" class="mr-1">mdi-account-group</v-icon>
                                            {{ selectedRecord.family_conditions_details }}
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- SECTION 3: Lifestyle & Sensory -->
               <v-col cols="12" md="6">
                <v-card variant="outlined" class="mb-4 rounded-lg border-opacity-50 h-100" :color="isEditing ? 'info' : ''">
                  <v-card-item>
                    <template v-slot:prepend>
                      <v-icon color="info" class="mr-2">mdi-human-handsup</v-icon>
                    </template>
                    <v-card-title class="text-h6 text-info font-weight-bold">Lifestyle</v-card-title>
                  </v-card-item>
                  <v-divider></v-divider>
                  <v-card-text class="pt-4">
                     <!-- Smoking -->
                     <div class="condition-item mb-4">
                        <div class="condition-header">Smoking</div>
                         <div v-if="isEditing">
                            <v-radio-group v-model="editData.is_smoking" inline density="compact" hide-details>
                                <v-radio label="Yes" value="yes" color="warning"></v-radio>
                                <v-radio label="No" value="no" color="success"></v-radio>
                            </v-radio-group>
                            <v-text-field v-if="editData.is_smoking === 'yes'" v-model="editData.smoking_details" label="Frequency" variant="outlined" density="compact" class="mt-2" hide-details="auto"/>
                        </div>
                        <div v-else>
                           <v-chip :color="selectedRecord.is_smoking === 'yes' ? 'warning' : 'success'" label size="small" class="mr-2">
                                {{ selectedRecord.is_smoking === 'yes' ? 'Yes' : 'No' }}
                           </v-chip>
                           <span v-if="selectedRecord.is_smoking === 'yes'" class="text-body-2">{{ selectedRecord.smoking_details }}</span>
                        </div>
                     </div>

                     <!-- Alcohol -->
                     <div class="condition-item">
                        <div class="condition-header">Alcohol</div>
                         <div v-if="isEditing">
                            <v-radio-group v-model="editData.is_drinking_alcohol" inline density="compact" hide-details>
                                <v-radio label="Yes" value="yes" color="warning"></v-radio>
                                <v-radio label="No" value="no" color="success"></v-radio>
                            </v-radio-group>
                            <v-text-field v-if="editData.is_drinking_alcohol === 'yes'" v-model="editData.alcohol_details" label="Frequency" variant="outlined" density="compact" class="mt-2" hide-details="auto"/>
                        </div>
                        <div v-else>
                           <v-chip :color="selectedRecord.is_drinking_alcohol === 'yes' ? 'warning' : 'success'" label size="small" class="mr-2">
                                {{ selectedRecord.is_drinking_alcohol === 'yes' ? 'Yes' : 'No' }}
                           </v-chip>
                           <span v-if="selectedRecord.is_drinking_alcohol === 'yes'" class="text-body-2">{{ selectedRecord.alcohol_details }}</span>
                        </div>
                     </div>
                  </v-card-text>
                </v-card>
               </v-col>

               <v-col cols="12" md="6">
                <v-card variant="outlined" class="mb-4 rounded-lg border-opacity-50 h-100" :color="isEditing ? 'purple' : ''">
                  <v-card-item>
                    <template v-slot:prepend>
                      <v-icon color="purple" class="mr-2">mdi-eye-outline</v-icon>
                    </template>
                    <v-card-title class="text-h6 text-purple font-weight-bold">Sensory & Other</v-card-title>
                  </v-card-item>
                  <v-divider></v-divider>
                  <v-card-text class="pt-4">
                     <!-- Eye Problems -->
                     <div class="condition-item mb-4">
                        <div class="condition-header">Eye Problems</div>
                         <div v-if="isEditing">
                            <v-radio-group v-model="editData.has_eye_problems" inline density="compact" hide-details>
                                <v-radio label="Yes" value="yes" color="warning"></v-radio>
                                <v-radio label="No" value="no" color="success"></v-radio>
                            </v-radio-group>
                            <v-text-field v-if="editData.has_eye_problems === 'yes'" v-model="editData.eye_problems_details" label="Details" variant="outlined" density="compact" class="mt-2" hide-details="auto"/>
                        </div>
                        <div v-else>
                           <v-chip :color="selectedRecord.has_eye_problems === 'yes' ? 'warning' : 'success'" label size="small" class="mr-2">
                                {{ selectedRecord.has_eye_problems === 'yes' ? 'Yes' : 'No' }}
                           </v-chip>
                           <span v-if="selectedRecord.has_eye_problems === 'yes'" class="text-body-2">{{ selectedRecord.eye_problems_details }}</span>
                        </div>
                     </div>

                     <!-- Hearing Problems -->
                     <div class="condition-item mb-4">
                        <div class="condition-header">Hearing Problems</div>
                         <div v-if="isEditing">
                            <v-radio-group v-model="editData.has_hearing_problems" inline density="compact" hide-details>
                                <v-radio label="Yes" value="yes" color="warning"></v-radio>
                                <v-radio label="No" value="no" color="success"></v-radio>
                            </v-radio-group>
                            <v-text-field v-if="editData.has_hearing_problems === 'yes'" v-model="editData.hearing_problems_details" label="Details" variant="outlined" density="compact" class="mt-2" hide-details="auto"/>
                        </div>
                        <div v-else>
                           <v-chip :color="selectedRecord.has_hearing_problems === 'yes' ? 'warning' : 'success'" label size="small" class="mr-2">
                                {{ selectedRecord.has_hearing_problems === 'yes' ? 'Yes' : 'No' }}
                           </v-chip>
                           <span v-if="selectedRecord.has_hearing_problems === 'yes'" class="text-body-2">{{ selectedRecord.hearing_problems_details }}</span>
                        </div>
                     </div>

                     <!-- Exposure -->
                     <div class="condition-item">
                        <div class="condition-header">Disease Exposure</div>
                         <div v-if="isEditing">
                            <v-radio-group v-model="editData.is_exposed" inline density="compact" hide-details>
                                <v-radio label="Yes" value="yes" color="warning"></v-radio>
                                <v-radio label="No" value="no" color="success"></v-radio>
                            </v-radio-group>
                            <v-text-field v-if="editData.is_exposed === 'yes'" v-model="editData.exposure_details" label="Details" variant="outlined" density="compact" class="mt-2" hide-details="auto"/>
                        </div>
                        <div v-else>
                           <v-chip :color="selectedRecord.is_exposed === 'yes' ? 'warning' : 'success'" label size="small" class="mr-2">
                                {{ selectedRecord.is_exposed === 'yes' ? 'Yes' : 'No' }}
                           </v-chip>
                           <span v-if="selectedRecord.is_exposed === 'yes'" class="text-body-2">{{ selectedRecord.exposure_details }}</span>
                        </div>
                     </div>
                  </v-card-text>
                </v-card>
               </v-col>

               <!-- SECTION 4: Emergency Contact -->
              <v-col cols="12">
                <v-card variant="outlined" class="rounded-lg border-opacity-50" :color="isEditing ? 'orange' : ''">
                  <v-card-item>
                    <template v-slot:prepend>
                      <v-icon color="orange-darken-2" class="mr-2">mdi-phone-alert</v-icon>
                    </template>
                    <v-card-title class="text-h6 text-orange-darken-2 font-weight-bold">Emergency Contact</v-card-title>
                  </v-card-item>
                  <v-divider></v-divider>
                  <v-card-text class="pt-4">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field v-if="isEditing" v-model="editData.name" label="Contact Name" variant="outlined" density="compact" hide-details="auto" />
                        <div v-else class="info-block">
                          <span class="label">Contact Name</span>
                          <span class="value font-weight-medium">{{ selectedRecord.name }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-if="isEditing" v-model="editData.relationship" label="Relationship" variant="outlined" density="compact" hide-details="auto" />
                        <div v-else class="info-block">
                          <span class="label">Relationship</span>
                          <span class="value">{{ selectedRecord.relationship }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field v-if="isEditing" v-model="editData.contact" label="Contact Number" variant="outlined" density="compact" hide-details="auto" />
                        <div v-else class="info-block">
                          <span class="label">Contact Number</span>
                          <span class="value">{{ selectedRecord.contact }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea v-if="isEditing" v-model="editData.address" label="Address" variant="outlined" density="compact" rows="2" hide-details="auto" />
                        <div v-else class="info-block">
                          <span class="label">Address</span>
                          <span class="value">{{ selectedRecord.address }}</span>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
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
  /* Info Blocks */
  .info-block {
    display: flex;
    flex-direction: column;
  }
  
  .info-block .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin-bottom: 2px;
  }
  
  .info-block .value {
    font-size: 0.95rem;
    color: rgba(var(--v-theme-on-surface), 0.9);
    line-height: 1.4;
  }

  /* Condition Items */
  .condition-header {
    font-size: 0.85rem;
    font-weight: 500;
    color: rgba(var(--v-theme-on-surface), 0.85);
  }

  /* Detail Boxes */
  .detail-box {
    margin-top: 4px;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.875rem;
    background-color: rgba(var(--v-theme-surface-variant), 0.1);
    display: flex;
    align-items: center;
  }
  
  .detail-box.warning-box {
    background-color: rgba(var(--v-theme-warning), 0.1);
    color: rgb(var(--v-theme-warning));
    border: 1px solid rgba(var(--v-theme-warning), 0.2);
  }

  .detail-box.error-box {
    background-color: rgba(var(--v-theme-error), 0.1);
    color: rgb(var(--v-theme-error));
    border: 1px solid rgba(var(--v-theme-error), 0.2);
  }
  
  .detail-box.info-box {
    background-color: rgba(var(--v-theme-info), 0.1);
    color: rgb(var(--v-theme-info));
    border: 1px solid rgba(var(--v-theme-info), 0.2);
  }

  /* Dashed Divider */
  .v-divider.dashed {
    border-style: dashed !important;
    opacity: 0.4;
  }
</style>
