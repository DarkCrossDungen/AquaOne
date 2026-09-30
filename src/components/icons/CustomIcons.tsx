import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Precision Satellite with Solar Arrays & Nadir Sensor
export const SatelliteOrbiter: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Central Bus */}
    <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.25" fill="#FFE500" />
    {/* Left Solar Wing */}
    <path d="M2 10.5H9M2 13.5H9M2 10.5V13.5M5.5 10.5V13.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    {/* Right Solar Wing */}
    <path d="M15 10.5H22M15 13.5H22M22 10.5V13.5M18.5 10.5V13.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    {/* Optical Sensor Dish */}
    <path d="M12 15V18M10 19.5C11 20.5 13 20.5 14 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Telemetry Wave */}
    <path d="M9 22C10.8 22.8 13.2 22.8 15 22" stroke="#FFE500" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

// 2. Optical Prism / Multispectral Diffraction Grating
export const SpectralPrism: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Prism Triangle */}
    <path d="M12 3L21 19H3L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    {/* Incoming Light Beam */}
    <path d="M1 12L7.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Diffracted Multispectral Rays */}
    <path d="M12 11L21 9" stroke="#FFE500" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 13L22 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 15L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 3. Hydrodynamic Vector Flow / River Streamline
export const HydraulicStream: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Fluid Vector Streamlines */}
    <path d="M3 7C7 7 9 11 13 11C17 11 19 7 21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 12C7 12 9 16 13 16C17 16 19 12 21 12" stroke="#FFE500" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M3 17C7 17 9 21 13 21C17 21 19 17 21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    {/* Arrowhead on center streamline */}
    <path d="M19 10L22 12L19 14" stroke="#FFE500" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 4. Clinical Early Warning / One Health Bio-Shield
export const ClinicalShield: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shield Outline */}
    <path
      d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Medical Crosshair Target */}
    <path d="M12 7V17M7 12H17" stroke="#FFE500" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.25" />
  </svg>
);

// 5. Precision Target Crosshair / Reticle
export const PrecisionReticle: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="#FFE500" strokeWidth="1.5" />
    <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="0.75" fill="#FFE500" />
  </svg>
);

// 6. Split-Aperture / Temporal Comparative Lens
export const TemporalAperture: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    {/* Split Line */}
    <path d="M12 3V21" stroke="#FFE500" strokeWidth="2" strokeLinecap="round" />
    {/* Before Indicator */}
    <path d="M8 10L6 12L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* After Indicator */}
    <path d="M16 10L18 12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 7. HL7 FHIR Interoperability / Node Terminal
export const FhirNodeTerminal: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 9L10 12L7 15" stroke="#FFE500" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="18" cy="7" r="1" fill="#FFE500" />
  </svg>
);

// 8. Regulatory Seal / Statutory Compliance
export const RegulatorySeal: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L15 5H19V9L22 12L19 15V19H15L12 22L9 19H5V15L2 12L5 9V5H9L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="#FFE500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 9. GPS Radar Compass Sweep
export const RadarCompass: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    {/* Sweep Needle */}
    <path d="M12 12L18 6" stroke="#FFE500" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// 10. Thermal Radiometer Wavelength
export const ThermalWave: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M4 12C6 9 8 9 10 12C12 15 14 15 16 12C18 9 20 9 22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 17C6 14 8 14 10 17C12 20 14 20 16 17C18 14 20 14 22 17" stroke="#FFE500" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 7C6 4 8 4 10 7C12 10 14 10 16 7C18 4 20 4 22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
  </svg>
);
