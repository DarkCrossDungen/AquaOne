'use client';

import React from 'react';
import { PilotBasin, SpectralMode } from '@/lib/types';
import { computeSatelliteWQI } from '@/lib/spectralIndices';
import { SpectralPrism, ThermalWave, PrecisionReticle, HydraulicStream } from '@/components/icons/CustomIcons';

interface SpectralViewerProps {
  basin: PilotBasin;
  currentMode: SpectralMode;
  onModeChange: (mode: SpectralMode) => void;
}

export const SpectralViewer: React.FC<SpectralViewerProps> = ({
  basin,
  currentMode,
  onModeChange,
}) => {
  const wqiResult = computeSatelliteWQI(
    basin.spectralStats.chlorophyllMean,
    basin.spectralStats.turbidityNtu,
    basin.spectralStats.surfaceTempC
  );

  const MODES: {
    id: SpectralMode;
    label: string;
    tag: string;
    wavelength: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'rgb',
      label: 'True Color',
      tag: 'RGB',
      wavelength: 'Bands 4, 3, 2 (Visual Optical)',
      description: 'Human-eye composite. Inspects surface discoloration, scum rafts, and visible debris.',
      icon: <PrecisionReticle className="w-4 h-4" />,
    },
    {
      id: 'ndwi',
      label: 'NDWI Water Index',
      tag: 'B3 / B8',
      wavelength: 'Green (560nm) vs NIR (842nm)',
      description: 'Delineates open water boundaries and detects stagnant wetland flood pooling.',
      icon: <HydraulicStream className="w-4 h-4" />,
    },
    {
      id: 'chlorophyll',
      label: 'Chlorophyll-a / HABs',
      tag: 'Red Edge',
      wavelength: 'B5 (705nm) vs B4 (665nm)',
      description: 'Isolates photosynthetic cyanobacteria. Flags toxic blue-green algal blooms.',
      icon: <SpectralPrism className="w-4 h-4" />,
    },
    {
      id: 'turbidity',
      label: 'Turbidity & Silt',
      tag: 'B4 Reflect',
      wavelength: 'Red Reflectance (665nm)',
      description: 'Quantifies suspended particulate matter, dredge slurry, and sewer discharge.',
      icon: <PrecisionReticle className="w-4 h-4" />,
    },
    {
      id: 'thermal',
      label: 'Thermal Radiometry',
      tag: 'TIR Proxy',
      wavelength: 'Thermal Surface Radiometry',
      description: 'Tracks industrial cooling effluent and heated municipal discharge plumes.',
      icon: <ThermalWave className="w-4 h-4" />,
    },
  ];

  const activeModeObj = MODES.find((m) => m.id === currentMode) || MODES[0];

  return (
    <div className="rounded-3xl bg-white border border-editorial-hairline p-6 lg:p-10 shadow-elevation flex flex-col gap-8 transition-all">
      {/* Top Header: Monochromatic Architectural Readout */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-editorial-hairline">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-editorial-hairline text-xs font-mono font-semibold uppercase tracking-wider text-black">
            <SpectralPrism className="w-3.5 h-3.5 text-[#FFE500]" />
            <span>Multispectral Optical Analysis</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-black uppercase font-sans">
            Copernicus Sentinel-2 MSI Spectrum
          </h2>
          <p className="text-sm text-editorial-muted max-w-xl font-normal leading-relaxed">
            13 discrete optical bands synthesized at 10-meter ground resolution to isolate chemical, biological, and thermal anomalies in urban waterways.
          </p>
        </div>

        {/* WQI Metric Display (Sleek High Contrast Black & Yellow Pill) */}
        <div className="flex items-center gap-4 bg-surface-subtle p-3.5 pr-6 rounded-2xl border border-editorial-hairline shrink-0 shadow-softPill">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-black text-[#FFE500] font-mono text-2xl font-bold shadow-sm">
            {wqiResult.wqi}
          </div>

          <div className="flex flex-col font-mono">
            <span className="text-[10px] tracking-widest uppercase text-editorial-muted font-semibold">
              Composite WQI Score
            </span>
            <span className="text-sm font-bold uppercase tracking-tight text-black flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded bg-[#FFE500] text-black font-black text-[10px]">WQI</span>
              {wqiResult.status} Status
            </span>
            <span className="text-[11px] text-editorial-muted">
              {wqiResult.wfdClassification.split('—')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Optical Band Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {MODES.map((mode) => {
          const isActive = mode.id === currentMode;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-mono tracking-tight uppercase font-semibold transition-all duration-200 flex items-center gap-2 border ${
                isActive
                  ? 'bg-black text-[#FFE500] border-black shadow-sm'
                  : 'bg-surface-subtle hover:bg-surface-muted text-editorial-charcoal border-editorial-hairline'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#FFE500] text-black font-bold' : 'bg-black/5 text-editorial-muted'
                }`}
              >
                {mode.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Spectral Mode Insight Card */}
      <div className="rounded-2xl bg-surface-subtle border border-editorial-hairline p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="text-black font-bold text-base tracking-tight uppercase font-sans">
              {activeModeObj.label} Telemetry
            </span>
            <span className="text-xs font-mono font-semibold bg-white text-black px-2 py-0.5 rounded-md border border-editorial-hairline">
              {activeModeObj.wavelength}
            </span>
          </div>
          <p className="text-xs text-editorial-muted font-normal leading-relaxed">
            {activeModeObj.description}
          </p>
        </div>

        {/* 4 Precision Readouts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 font-mono">
          <div className="p-3.5 rounded-xl bg-white border border-editorial-hairline shadow-softPill">
            <div className="text-[10px] text-editorial-light uppercase font-semibold">NDWI Index</div>
            <div className="text-base font-bold text-black mt-0.5">+{basin.spectralStats.ndwiMean}</div>
            <div className="text-[10px] text-editorial-muted">Open Channel</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-editorial-hairline shadow-softPill">
            <div className="text-[10px] text-editorial-light uppercase font-semibold">Chlorophyll</div>
            <div className="text-base font-bold text-black mt-0.5">
              {basin.spectralStats.chlorophyllMean} <span className="text-xs font-normal text-editorial-muted">µg/L</span>
            </div>
            <div className="text-[10px] font-bold text-black bg-[#FFE500] px-1.5 py-0.5 rounded mt-1 inline-block">
              CRITICAL SPIKE
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-editorial-hairline shadow-softPill">
            <div className="text-[10px] text-editorial-light uppercase font-semibold">Turbidity</div>
            <div className="text-base font-bold text-black mt-0.5">
              {basin.spectralStats.turbidityNtu} <span className="text-xs font-normal text-editorial-muted">NTU</span>
            </div>
            <div className="text-[10px] text-editorial-muted">Suspended Silt</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-editorial-hairline shadow-softPill">
            <div className="text-[10px] text-editorial-light uppercase font-semibold">Surface Temp</div>
            <div className="text-base font-bold text-black mt-0.5">
              {basin.spectralStats.surfaceTempC}°C
            </div>
            <div className="text-[10px] text-editorial-muted">+3.2°C Delta</div>
          </div>
        </div>
      </div>
    </div>
  );
};
