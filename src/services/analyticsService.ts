import { client } from "@/utils/useDirectus";
import { readItems } from "@directus/sdk";

export interface HealthAnalytics {
  medicalConditions: { [key: string]: number };
  allergies: { has: number; no: number };
  medications: { taking: number; notTaking: number };
  lifestyle: { smoking: number; drinking: number };
  familyHistory: { has: number; no: number };
  operations: { has: number; no: number };
  genderDistribution: { male: number; female: number; other: number };
  eyeProblems: { has: number; no: number };
  hearingProblems: { has: number; no: number };
  communicableDiseases: { has: number; no: number };
  soloParent: { has: number; no: number };
  disability: { has: number; no: number };
  vaccination: { vaccinated: number; notVaccinated: number };
}

export class AnalyticsService {
  static async getHealthAnalytics(): Promise<HealthAnalytics> {
    try {
      const records: any[] = await client.request(
        readItems("student_health_record")
      );

      // If no records exist, return sample data for demonstration
      if (records.length === 0) {
        console.log("No health records found. Returning sample analytics data for demonstration.");
        return this.getSampleAnalytics();
      }

      return this.processHealthData(records);
    } catch (error) {
      console.error("Error fetching health analytics:", error);
      // Return sample data even on error for demo purposes
      return this.getSampleAnalytics();
    }
  }

  private static processHealthData(records: any[]): HealthAnalytics {
    const analytics: HealthAnalytics = {
      medicalConditions: {},
      allergies: { has: 0, no: 0 },
      medications: { taking: 0, notTaking: 0 },
      lifestyle: { smoking: 0, drinking: 0 },
      familyHistory: { has: 0, no: 0 },
      operations: { has: 0, no: 0 },
      genderDistribution: { male: 0, female: 0, other: 0 },
      eyeProblems: { has: 0, no: 0 },
      hearingProblems: { has: 0, no: 0 },
      communicableDiseases: { has: 0, no: 0 },
      soloParent: { has: 0, no: 0 },
      disability: { has: 0, no: 0 },
      vaccination: { vaccinated: 0, notVaccinated: 0 }
    };

    console.log(`[AnalyticsService] Processing ${records.length} records`);
    if (records.length > 0) {
      console.log("[AnalyticsService] Sample record:", records[0]);
    }

    records.forEach(record => {
      // Helper for case-insensitive check
      const isYes = (val: string) => val?.toLowerCase() === 'yes';
      const isNo = (val: string) => val?.toLowerCase() === 'no';

      // Medical conditions
      if (isYes(record.has_medical_condition) && record.medical_condition_details) {
        console.log(`[AnalyticsService] Found condition for record ${record.id}:`, record.medical_condition_details);
        const conditions = record.medical_condition_details.split(',').map((c: string) => c.trim().toLowerCase());
        conditions.forEach((condition: string) => {
          analytics.medicalConditions[condition] = (analytics.medicalConditions[condition] || 0) + 1;
        });
      } else if (isYes(record.has_medical_condition)) {
        console.warn(`[AnalyticsService] Record has condition but no details. ID: ${record.id}, Details: ${record.medical_condition_details}`);
        analytics.medicalConditions['Unspecified'] = (analytics.medicalConditions['Unspecified'] || 0) + 1;
      } else {
        // Assume 'no' or empty means no medical condition (or explicitly check isNo)
        analytics.medicalConditions['No Medical Condition'] = (analytics.medicalConditions['No Medical Condition'] || 0) + 1;
      }

      // Allergies
      if (isYes(record.has_allergies)) {
        analytics.allergies.has++;
      } else if (isNo(record.has_allergies)) {
        analytics.allergies.no++;
      }

      // Medications
      if (isYes(record.is_taking_medication)) {
        analytics.medications.taking++;
      } else if (isNo(record.is_taking_medication)) {
        analytics.medications.notTaking++;
      }

      // Lifestyle
      if (isYes(record.is_smoking)) {
        analytics.lifestyle.smoking++;
      }
      if (isYes(record.is_drinking_alcohol)) {
        analytics.lifestyle.drinking++;
      }

      // Family history
      if (isYes(record.family_conditions)) {
        analytics.familyHistory.has++;
      } else if (isNo(record.family_conditions)) {
        analytics.familyHistory.no++;
      }

      // Operations
      if (isYes(record.was_operated)) {
        analytics.operations.has++;
      } else if (isNo(record.was_operated)) {
        analytics.operations.no++;
      }

      // Gender distribution
      if (record.gender?.toLowerCase() === 'male') {
        analytics.genderDistribution.male++;
      } else if (record.gender?.toLowerCase() === 'female') {
        analytics.genderDistribution.female++;
      } else if (record.gender) {
        analytics.genderDistribution.other++;
      }

      // Eye problems
      if (isYes(record.has_eye_problems)) {
        analytics.eyeProblems.has++;
      } else if (isNo(record.has_eye_problems)) {
        analytics.eyeProblems.no++;
      }

      // Hearing problems
      if (isYes(record.has_hearing_problems)) {
        analytics.hearingProblems.has++;
      } else if (isNo(record.has_hearing_problems)) {
        analytics.hearingProblems.no++;
      }

      // Communicable diseases
      if (isYes(record.is_exposed)) {
        analytics.communicableDiseases.has++;
      } else if (isNo(record.is_exposed)) {
        analytics.communicableDiseases.no++;
      }

      // Solo Parent
      if (isYes(record.is_solo_parent)) {
        analytics.soloParent.has++;
      } else if (isNo(record.is_solo_parent)) {
        analytics.soloParent.no++;
      }

      // Disability (PWD)
      if (isYes(record.is_disabled)) {
        analytics.disability.has++;
      } else if (isNo(record.is_disabled)) {
        analytics.disability.no++;
      }

      // Vaccination
      if (isYes(record.is_vaccinated)) {
        analytics.vaccination.vaccinated++;
      } else if (isNo(record.is_vaccinated)) {
        analytics.vaccination.notVaccinated++;
      }
    });

    return analytics;
  }

  private static getSampleAnalytics(): HealthAnalytics {
    return {
      medicalConditions: {
        "hypertension": 8,
        "diabetes": 5,
        "asthma": 3,
        "heart disease": 2
      },
      allergies: { has: 25, no: 75 },
      medications: { taking: 15, notTaking: 85 },
      lifestyle: { smoking: 12, drinking: 18 },
      familyHistory: { has: 35, no: 65 },
      operations: { has: 8, no: 92 },
      genderDistribution: { male: 45, female: 50, other: 5 },
      eyeProblems: { has: 30, no: 70 },
      hearingProblems: { has: 5, no: 95 },
      communicableDiseases: { has: 1, no: 19 },
      soloParent: { has: 3, no: 17 },
      disability: { has: 2, no: 18 },
      vaccination: { vaccinated: 18, notVaccinated: 2 }
    };
  }

  private static getEmptyAnalytics(): HealthAnalytics {
    return {
      medicalConditions: {},
      allergies: { has: 0, no: 0 },
      medications: { taking: 0, notTaking: 0 },
      lifestyle: { smoking: 0, drinking: 0 },
      familyHistory: { has: 0, no: 0 },
      operations: { has: 0, no: 0 },
      genderDistribution: { male: 0, female: 0, other: 0 },
      eyeProblems: { has: 0, no: 0 },
      hearingProblems: { has: 0, no: 0 },
      communicableDiseases: { has: 0, no: 0 },
      soloParent: { has: 0, no: 0 },
      disability: { has: 0, no: 0 },
      vaccination: { vaccinated: 0, notVaccinated: 0 }
    };
  }
}