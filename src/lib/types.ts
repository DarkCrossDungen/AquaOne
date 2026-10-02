export type SpectralMode = 'rgb' | 'ndwi' | 'chlorophyll' | 'turbidity' | 'thermal';

export interface DownstreamPOI {
  id: string;
  name: string;
  type: 'drinking_intake' | 'public_beach' | 'kayak_park' | 'nature_reserve';
  distanceKm: number;
  etaHours: number;
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  healthAdvisory: string;
  icd10Code: string;
  diseaseDescription: string;
}

export interface PlumeDetection {
  id: string;
  detectedAt: string;
  satellite: string; // e.g., 'Sentinel-2B'
  orbitPass: string;
  lat: number;
  lng: number;
  areaSqMeters: number;
  flowVelocityKmH: number;
  primaryPollutant: string;
  severity: 'CRITICAL' | 'WARNING' | 'ELEVATED';
  confidenceScore: number; // e.g., 94.6%
  wqiEquivalent: number;
  chlorophyllConcentrationMgM3: number;
  turbidityNtu: number;
}

export interface PilotBasin {
  id: string;
  name: string;
  riverName: string;
  country: string;
  flag: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  description: string;
  watershedType: string;
  historicalBaselineDate: string;
  recentPassDate: string;
  plume: PlumeDetection;
  downstreamPOIs: DownstreamPOI[];
  spectralStats: {
    ndwiMean: number;
    chlorophyllMean: number;
    turbidityNtu: number;
    dissolvedOxygenMgL: number; // Dissolved Oxygen (mg/L) - Normal: 7-11 mg/L, Hypoxia: < 4 mg/L
    surfaceTempC: number;
    anomalousPixels: number;
  };
  whoRegistryStatus: {
    isRegisteredAsNonPotable: boolean;
    registryReference: string;
    lastReportedNotice: string;
    escalationRequired: boolean;
    whoDrinkingRequirementX: {
      chlorophyllMaxUgL: number; // e.g., 10.0 µg/L
      dissolvedOxygenMinMgL: number; // e.g., 5.0 mg/L
      turbidityMaxNtu: number; // e.g., 5.0 NTU
      minimumDischargeM3s: number; // e.g., 12.0 m3/s
    };
  };
}

export interface FhirObservation {
  resourceType: 'Observation';
  id: string;
  status: 'final';
  category: [
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/observation-category';
          code: 'exam';
          display: 'Exam';
        }
      ];
    }
  ];
  code: {
    coding: [
      {
        system: 'http://loinc.org';
        code: string;
        display: string;
      }
    ];
    text: string;
  };
  effectiveDateTime: string;
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  interpretation?: [
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation';
          code: 'A' | 'H' | 'N';
          display: string;
        }
      ];
    }
  ];
  note?: [{ text: string }];
}

export interface FhirRiskAssessment {
  resourceType: 'RiskAssessment';
  id: string;
  status: 'final';
  subject: {
    display: string;
  };
  occurrenceDateTime: string;
  condition: {
    coding: [
      {
        system: 'http://hl7.org/fhir/sid/icd-10';
        code: string;
        display: string;
      }
    ];
    text: string;
  };
  prediction: [
    {
      outcome: {
        text: string;
      };
      probabilityDecimal: number;
      qualitativeRisk: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/risk-probability';
            code: 'high' | 'moderate' | 'low';
            display: string;
          }
        ];
      };
      whenRange?: {
        high: {
          value: number;
          unit: 'hours';
        };
      };
      rationale: string;
    }
  ];
}

export interface FhirBundle {
  resourceType: 'Bundle';
  type: 'collection';
  id: string;
  timestamp: string;
  entry: Array<{
    fullUrl: string;
    resource: FhirObservation | FhirRiskAssessment;
  }>;
}
