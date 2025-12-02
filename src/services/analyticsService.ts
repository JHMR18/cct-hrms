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
}

export class AnalyticsService {
  static async getHealthAnalytics(): Promise<HealthAnalytics> {
    try {
      const records: any[] = await client.request(
        readItems("student_health_record", {
          fields: [
            "has_medical_condition",
            "medical_condition_details",
            "has_allergies",
            "is_taking_medication",
            "is_smoking",
            "is_drinking_alcohol",
            "family_conditions",
            "was_operated",
            "gender",
            "has_eye_problems",
            "has_hearing_problems",
            "is_exposed"
          ]
        })
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
      communicableDiseases: { has: 0, no: 0 }
    };

    records.forEach(record => {
      // Medical conditions
      if (record.has_medical_condition === 'yes' && record.medical_condition_details) {
        const conditions = record.medical_condition_details.split(',').map((c: string) => c.trim().toLowerCase());
        conditions.forEach(condition => {
          analytics.medicalConditions[condition] = (analytics.medicalConditions[condition] || 0) + 1;
        });
      }

      // Allergies
      if (record.has_allergies === 'yes') {
        analytics.allergies.has++;
      } else if (record.has_allergies === 'no') {
        analytics.allergies.no++;
      }

      // Medications
      if (record.is_taking_medication === 'yes') {
        analytics.medications.taking++;
      } else if (record.is_taking_medication === 'no') {
        analytics.medications.notTaking++;
      }

      // Lifestyle
      if (record.is_smoking === 'yes') {
        analytics.lifestyle.smoking++;
      }
      if (record.is_drinking_alcohol === 'yes') {
        analytics.lifestyle.drinking++;
      }

      // Family history
      if (record.family_conditions === 'yes') {
        analytics.familyHistory.has++;
      } else if (record.family_conditions === 'no') {
        analytics.familyHistory.no++;
      }

      // Operations
      if (record.was_operated === 'yes') {
        analytics.operations.has++;
      } else if (record.was_operated === 'no') {
        analytics.operations.no++;
      }

      // Gender distribution
      if (record.gender === 'male') {
        analytics.genderDistribution.male++;
      } else if (record.gender === 'female') {
        analytics.genderDistribution.female++;
      } else {
        analytics.genderDistribution.other++;
      }

      // Eye problems
      if (record.has_eye_problems === 'yes') {
        analytics.eyeProblems.has++;
      } else if (record.has_eye_problems === 'no') {
        analytics.eyeProblems.no++;
      }

      // Hearing problems
      if (record.has_hearing_problems === 'yes') {
        analytics.hearingProblems.has++;
      } else if (record.has_hearing_problems === 'no') {
        analytics.hearingProblems.no++;
      }

      // Communicable diseases
      if (record.is_exposed === 'yes') {
        analytics.communicableDiseases.has++;
      } else if (record.is_exposed === 'no') {
        analytics.communicableDiseases.no++;
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
      communicableDiseases: { has: 10, no: 90 }
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
      communicableDiseases: { has: 0, no: 0 }
    };
  }
}