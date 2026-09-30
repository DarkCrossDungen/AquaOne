import { PilotBasin, FhirBundle, FhirObservation, FhirRiskAssessment } from './types';

/**
 * Serializes satellite-derived river observations & downstream human health risks
 * into standard HL7 FHIR R4 JSON Bundles.
 *
 * Direct alignment with IEEE EMBS, EFMI, and EU OneAquaHealth standards.
 */
export function generateFhirBundle(basin: PilotBasin): FhirBundle {
  const timestamp = basin.plume.detectedAt;
  const basinSlug = basin.id;

  // 1. Turbidity Observation (LOINC 48421-2)
  const turbidityObs: FhirObservation = {
    resourceType: 'Observation',
    id: `obs-turbidity-${basinSlug}`,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'exam',
            display: 'Exam',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '48421-2',
          display: 'Turbidity of Water [Turbidity Units]',
        },
      ],
      text: 'Satellite-estimated river surface turbidity',
    },
    effectiveDateTime: timestamp,
    valueQuantity: {
      value: basin.plume.turbidityNtu,
      unit: 'NTU',
      system: 'http://unitsofmeasure.org',
      code: '[NTU]',
    },
    interpretation: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
            code: basin.plume.turbidityNtu > 40 ? 'H' : 'N',
            display: basin.plume.turbidityNtu > 40 ? 'High' : 'Normal',
          },
        ],
      },
    ],
    note: [
      {
        text: `Derived via Sentinel-2 MSI Band 4 reflectance at coordinates [${basin.plume.lat}, ${basin.plume.lng}]. Orbit: ${basin.plume.orbitPass}`,
      },
    ],
  };

  // 2. Chlorophyll-a / Microcystin Cyanotoxin (LOINC 79177-2)
  const chloroObs: FhirObservation = {
    resourceType: 'Observation',
    id: `obs-chlorophyll-${basinSlug}`,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'exam',
            display: 'Exam',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '79177-2',
          display: 'Microcystin [Mass/volume] in Water',
        },
      ],
      text: 'Cyanobacterial bloom & Microcystin toxin indicator',
    },
    effectiveDateTime: timestamp,
    valueQuantity: {
      value: basin.plume.chlorophyllConcentrationMgM3,
      unit: 'ug/L',
      system: 'http://unitsofmeasure.org',
      code: 'ug/L',
    },
    interpretation: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
            code: basin.plume.chlorophyllConcentrationMgM3 > 50 ? 'H' : 'N',
            display: basin.plume.chlorophyllConcentrationMgM3 > 50 ? 'Critically Elevated' : 'Normal',
          },
        ],
      },
    ],
    note: [
      {
        text: `Calculated via NDCI index (Bands 5 and 4). Eutrophic state indicates immediate danger for raw drinking abstraction.`,
      },
    ],
  };

  // 3. Water Surface Temperature (LOINC 82810-3)
  const tempObs: FhirObservation = {
    resourceType: 'Observation',
    id: `obs-temp-${basinSlug}`,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'exam',
            display: 'Exam',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '82810-3',
          display: 'Water temperature',
        },
      ],
      text: 'Satellite radiometer surface water temperature',
    },
    effectiveDateTime: timestamp,
    valueQuantity: {
      value: basin.spectralStats.surfaceTempC,
      unit: 'Cel',
      system: 'http://unitsofmeasure.org',
      code: 'Cel',
    },
  };

  // 4. Downstream Clinical Risk Assessment (FHIR RiskAssessment)
  const riskAssessments: FhirRiskAssessment[] = basin.downstreamPOIs.map((poi, idx) => ({
    resourceType: 'RiskAssessment',
    id: `risk-eval-${basinSlug}-${idx + 1}`,
    status: 'final',
    subject: {
      display: `Downstream Population at ${poi.name} (Reach distance: ${poi.distanceKm} km)`,
    },
    occurrenceDateTime: timestamp,
    condition: {
      coding: [
        {
          system: 'http://hl7.org/fhir/sid/icd-10',
          code: poi.icd10Code,
          display: poi.diseaseDescription,
        },
      ],
      text: poi.diseaseDescription,
    },
    prediction: [
      {
        outcome: {
          text: poi.healthAdvisory,
        },
        probabilityDecimal: poi.riskLevel === 'critical' ? 0.94 : poi.riskLevel === 'high' ? 0.82 : 0.45,
        qualitativeRisk: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/risk-probability',
              code: poi.riskLevel === 'critical' || poi.riskLevel === 'high' ? 'high' : 'moderate',
              display: poi.riskLevel.toUpperCase(),
            },
          ],
        },
        whenRange: {
          high: {
            value: Number(poi.etaHours.toFixed(1)),
            unit: 'hours',
          },
        },
        rationale: `Contaminant plume moving at ${basin.plume.flowVelocityKmH} km/h along river center line. Expected contamination arrival in ${poi.etaHours.toFixed(1)} hours.`,
      },
    ],
  }));

  // Build Collection Bundle
  return {
    resourceType: 'Bundle',
    type: 'collection',
    id: `bundle-aqualens-${basinSlug}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: `urn:uuid:${turbidityObs.id}`,
        resource: turbidityObs,
      },
      {
        fullUrl: `urn:uuid:${chloroObs.id}`,
        resource: chloroObs,
      },
      {
        fullUrl: `urn:uuid:${tempObs.id}`,
        resource: tempObs,
      },
      ...riskAssessments.map((ra) => ({
        fullUrl: `urn:uuid:${ra.id}`,
        resource: ra,
      })),
    ],
  };
}
