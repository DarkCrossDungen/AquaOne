/**
 * Mathematical models for Sentinel-2 Multispectral Instrument (MSI) optical indices.
 * Compliant with European Space Agency (ESA) & Copernicus Earth Observation standards.
 * Strictly formatted for Black / White / Yellow high-contrast typography.
 */

export interface SpectralBands {
  b2_blue: number;     // 490 nm (Aerosol / Coastal)
  b3_green: number;    // 560 nm (Water clarity)
  b4_red: number;      // 665 nm (Chlorophyll absorption)
  b5_redEdge: number;  // 705 nm (Vegetation / Algal bloom edge)
  b8_nir: number;      // 842 nm (Near Infrared - water absorbs, vegetation reflects)
  b11_swir: number;    // 1610 nm (Moisture / Suspended sediment)
}

/**
 * Normalized Difference Water Index (McFeeters, 1996)
 * NDWI = (Green - NIR) / (Green + NIR)
 * Range: -1.0 to +1.0. Positive values indicate open water bodies.
 */
export function calculateNDWI(green: number, nir: number): number {
  const denominator = green + nir;
  if (denominator === 0) return 0;
  return Number(((green - nir) / denominator).toFixed(3));
}

/**
 * Normalized Difference Chlorophyll Index (Mishra & Mishra, 2012)
 * NDCI = (RedEdge - Red) / (RedEdge + Red)
 * Sensitive to Chlorophyll-a absorption peak in cyanobacteria & eutrophic algal blooms.
 */
export function calculateNDCI(redEdge: number, red: number): number {
  const denominator = redEdge + red;
  if (denominator === 0) return 0;
  return Number(((redEdge - red) / denominator).toFixed(3));
}

/**
 * Estimate Chlorophyll-a concentration (mg/m³) from NDCI
 * Empirical polynomial calibrated for European inland freshwater catchments.
 */
export function estimateChlorophyllA(ndci: number): number {
  if (ndci <= 0) return 2.5; // Pristine oligotrophic baseline
  const estimated = 14.5 + 115 * ndci + 85 * Math.pow(ndci, 2);
  return Number(Math.min(estimated, 250).toFixed(1));
}

/**
 * Estimate Turbidity (NTU) from Red Band (665 nm) surface reflectance (Nechad et al., 2010)
 */
export function estimateTurbidityNTU(redReflectance: number): number {
  const ntu = (250 * redReflectance) / (1 - redReflectance / 0.17);
  return Number(Math.max(1.2, Math.min(ntu, 180)).toFixed(1));
}

/**
 * Compute composite Water Quality Index (WQI) on a 0-100 scale:
 * 85-100: Pristine
 * 70-84: Good (EU WFD compliant)
 * 50-69: Moderate / Caution
 * 30-49: Poor / Ecological stress
 * 0-29: Critical / Toxic plume
 */
export function computeSatelliteWQI(
  chlorophyllMgM3: number,
  turbidityNtu: number,
  surfaceTempC: number
): {
  wqi: number;
  status: 'PRISTINE' | 'GOOD' | 'MODERATE' | 'POOR' | 'CRITICAL';
  isAlert: boolean;
  wfdClassification: string;
} {
  // Penalty calculations
  const chloroPenalty = Math.min(chlorophyllMgM3 * 0.55, 45);
  const turbPenalty = Math.min(turbidityNtu * 0.45, 35);
  const tempExcess = Math.max(0, surfaceTempC - 20) * 2;

  const rawWqi = Math.max(5, Math.round(100 - (chloroPenalty + turbPenalty + tempExcess)));

  if (rawWqi >= 85) {
    return {
      wqi: rawWqi,
      status: 'PRISTINE',
      isAlert: false,
      wfdClassification: 'High Ecological Status (Directive 2000/60/EC)',
    };
  } else if (rawWqi >= 70) {
    return {
      wqi: rawWqi,
      status: 'GOOD',
      isAlert: false,
      wfdClassification: 'Good Ecological Status',
    };
  } else if (rawWqi >= 50) {
    return {
      wqi: rawWqi,
      status: 'MODERATE',
      isAlert: true,
      wfdClassification: 'Moderate Status — Eutrophication Warning',
    };
  } else if (rawWqi >= 30) {
    return {
      wqi: rawWqi,
      status: 'POOR',
      isAlert: true,
      wfdClassification: 'Poor Status — Action Plan Required',
    };
  } else {
    return {
      wqi: rawWqi,
      status: 'CRITICAL',
      isAlert: true,
      wfdClassification: 'Critical Status — Severe Chemical / Biological Incident',
    };
  }
}
