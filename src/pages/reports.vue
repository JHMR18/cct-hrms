<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="2">
      <v-toolbar-title class="font-weight-medium ml-4">
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

    <v-navigation-drawer permanent>
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
          @click="$router.push('/announcements')"
        />
        <v-list-item 
          prepend-icon="mdi-chart-line" 
          title="Reports" 
          value="reports"
          active 
        />
        <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <div class="mb-6">
          <h1 class="text-h4 font-weight-medium">Reports & Exports</h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-0">
            Generate, filter, and download reports for health records and clinic activities
          </p>
        </div>

        <v-row>
          <!-- Report Generator Card -->
          <v-col cols="12">
            <v-card elevation="2" class="mb-6">
              <v-card-title class="d-flex align-center py-3 px-4 bg-grey-lighten-4">
                <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
                Report Generator
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-4">
                <v-row align="end">
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="selectedReportType"
                      :items="reportTypes"
                      item-title="title"
                      item-value="value"
                      label="Select Report Type"
                      variant="outlined"
                      prepend-inner-icon="mdi-file-document-outline"
                      hide-details="auto"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="startDate"
                      type="date"
                      label="Start Date"
                      variant="outlined"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model="endDate"
                      type="date"
                      label="End Date"
                      variant="outlined"
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-btn
                      color="primary"
                      block
                      height="56"
                      prepend-icon="mdi-magnify"
                      @click="generateReport"
                      :loading="loading"
                      :disabled="!isValidForm"
                    >
                      Generate
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Results Table -->
        <v-slide-y-transition>
          <v-row v-if="showResults">
            <v-col cols="12">
              <v-card elevation="2">
                <v-card-title class="d-flex align-center justify-space-between py-3 px-4">
                  <div class="d-flex align-center">
                    <v-icon color="secondary" class="mr-2">mdi-table</v-icon>
                    Report Preview
                    <v-chip class="ml-3" size="small" color="grey-lighten-2">
                      {{ tableData.length }} records found
                    </v-chip>
                  </div>
                  <v-btn
                    color="success"
                    prepend-icon="mdi-download"
                    @click="exportFilteredData"
                    :disabled="tableData.length === 0"
                  >
                    Export CSV
                  </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                
                <v-data-table
                  :headers="tableHeaders"
                  :items="tableData"
                  :loading="loading"
                  class="elevation-0"
                  density="compact"
                >
                  <template v-slot:item.date_created="{ item }">
                    {{ formatDate(item.date_created) }}
                  </template>
                  <template v-slot:item.birthdate="{ item }">
                    {{ formatDate(item.birthdate) }}
                  </template>
                  <template v-slot:item.date_of_visit="{ item }">
                    {{ formatDate(item.date_of_visit) }}
                  </template>
                  <template v-slot:item.date_of_examination="{ item }">
                    {{ formatDate(item.date_of_examination) }}
                  </template>
                  
                  <template v-slot:no-data>
                    <div class="text-center py-6">
                      <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-database-off</v-icon>
                      <p class="text-body-1 text-grey">No records found for the selected criteria</p>
                    </div>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-slide-y-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuth } from '@/utils/useAuth'
import { getHealthRecords, getDailyVisits, getAnnualAssessments, getUsers } from '@/utils/useDirectus'

const router = useRouter()
const theme = useTheme()
const { logout: authLogout, userData } = useAuth()

const drawer = ref(false)
const isDark = computed(() => theme.current.value.dark)
const logoutLoading = ref(false)
const loading = ref(false)
const showResults = ref(false)

// Filter State
const selectedReportType = ref<string | null>(null)
const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)
const tableData = ref<any[]>([])

const reportTypes = [
  { title: 'Health Records', value: 'health_records' },
  { title: 'Daily Visits', value: 'daily_visits' },
  { title: 'Annual Assessments', value: 'annual_assessments' }
]

const isValidForm = computed(() => {
  return !!selectedReportType.value
})

const tableHeaders = computed(() => {
  switch (selectedReportType.value) {
    case 'health_records':
      return [
        { title: 'Student No', key: 'student_no' },
        { title: 'First Name', key: 'first_name' },
        { title: 'Last Name', key: 'last_name' },
        { title: 'Department', key: 'department' },
        { title: 'Record Created', key: 'date_created' }
      ]
    case 'daily_visits':
      return [
        { title: 'Date', key: 'date_of_visit' },
        { title: 'Time', key: 'time_of_visit' },
        { title: 'Patient Name', key: 'name' },
        { title: 'Department', key: 'department' },
        { title: 'Complaint', key: 'chief_complaint' },
        { title: 'Treatment', key: 'treatment' }
      ]
    case 'annual_assessments':
      return [
        { title: 'Student No', key: 'student_no' },
        { title: 'Student Name', key: 'student_name' },
        { title: 'School Year', key: 'school_year' },
        { title: 'Exam Date', key: 'date_of_examination' },
        { title: 'Fit for Class', key: 'is_fit_for_class' },
        { title: 'BMI', key: 'bmi' },
        { title: 'Examiner', key: 'name_of_examiner' }
      ]
    default:
      return []
  }
})

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

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const generateReport = async () => {
  if (!selectedReportType.value) return

  loading.value = true
  showResults.value = true
  tableData.value = []

  try {
    let data : any[] = []
    
    // Fetch Data
    if (selectedReportType.value === 'health_records') {
      data = await getHealthRecords()
      if (!Array.isArray(data)) data = []
      
      // Fetch User Details for Department
      const studentIds = [...new Set(data.map((item: any) => item.student_id).filter((id: any) => typeof id === 'string'))]
      
      if (studentIds.length > 0) {
        try {
          // Directus `readUsers` filter syntax
          const users = await getUsers({
            filter: {
              id: { _in: studentIds }
            },
            fields: ['id', 'department']
          })
          
          if (Array.isArray(users)) {
            const userMap = new Map(users.map((u: any) => [u.id, u.department]))
            
            data = data.map(item => ({
              ...item,
              department: item.department || userMap.get(item.student_id) || 'N/A'
            }))
          }
        } catch (err) {
          console.error("Failed to fetch user details for department mapping", err)
        }
      }

      // Filter Health Records
      if (startDate.value || endDate.value) {
        data = data.filter(item => {
           const itemDateStr = item.date_created
           if (!itemDateStr) return true
           
           const itemDate = new Date(itemDateStr)
           const start = startDate.value ? new Date(startDate.value) : null
           const end = endDate.value ? new Date(endDate.value) : null
           
           if (start) start.setHours(0,0,0,0)
           if (end) end.setHours(23,59,59,999)
           
           if (start && itemDate < start) return false
           if (end && itemDate > end) return false
           return true
        })
      }

    } else if (selectedReportType.value === 'daily_visits') {
      data = await getDailyVisits()
      if (!Array.isArray(data)) data = []

      // Filter Daily Visits
      if (startDate.value || endDate.value) {
        data = data.filter(item => {
          const itemDateStr = item.date_of_visit
          if (!itemDateStr) return false
          
          if (startDate.value && itemDateStr < startDate.value) return false
          if (endDate.value && itemDateStr > endDate.value) return false
          
          return true
        })
      }

    } else if (selectedReportType.value === 'annual_assessments') {
      data = await getAnnualAssessments()
      if (!Array.isArray(data)) data = []

      // Fetch User Details for Student Name/No
      const studentIds = [...new Set(data.map((item: any) => item.student_id).filter((id: any) => typeof id === 'string'))]
      
      if (studentIds.length > 0) {
        try {
          const users = await getUsers({
            filter: {
              id: { _in: studentIds }
            },
            fields: ['id', 'first_name', 'last_name', 'student_id']
          })
          
          if (Array.isArray(users)) {
            console.log('Fetched Users for Assessment:', users)
            const userMap = new Map(users.map((u: any) => [u.id, u]))
            
            data = data.map(item => {
              const user = userMap.get(item.student_id)
              return {
                ...item,
                // user.student_id is the Student Number property on the user object
                student_no: user?.student_id || 'N/A',
                student_name: user ? `${user.first_name} ${user.last_name}` : 'Unknown'
              }
            })
          }
        } catch (err) {
            console.error('Failed to fetch user details for annual assessments', err)
        }
      }

      // Filter Annual Assessments
      if (startDate.value || endDate.value) {
         data = data.filter(item => {
          const itemDateStr = item.date_of_examination
          if (!itemDateStr) return false
          
          if (startDate.value && itemDateStr < startDate.value) return false
          if (endDate.value && itemDateStr > endDate.value) return false
          
          return true
        })
      }
    }

    tableData.value = data

  } catch (error) {
    console.error('Error generating report:', error)
    alert('Failed to generate report')
  } finally {
    loading.value = false
  }
}

const exportFilteredData = () => {
  if (!tableData.value || !tableData.value.length) {
    alert('No data to export')
    return
  }
  
  const filename = `${selectedReportType.value}_report_${new Date().toISOString().split('T')[0]}`
  
  // Pass the current headers to the download function
  downloadCSV(tableData.value, filename, tableHeaders.value)
}

const downloadCSV = (data: any[], filename: string, headers: any[]) => {
  // Use headers to define the exact columns and order for the CSV
  const csvContent = [
    headers.map(h => h.title).join(','), // CSV Header row based on display titles
    ...data.map(row => 
      headers.map(h => {
        let val = row[h.key] ?? ''
        
        // Format date fields
        if (['date_created', 'birthdate', 'date_of_visit', 'date_of_examination'].includes(h.key) && val) {
          val = new Date(val).toLocaleDateString()
        }

        const stringVal = String(val).replace(/"/g, '""')
        return /[,\n"]/.test(stringVal) ? `"${stringVal}"` : stringVal
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
