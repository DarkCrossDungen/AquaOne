'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { FhirInspector } from '@/components/FhirInspector';
import { RegulatoryDossier } from '@/components/RegulatoryDossier';
import { PILOT_BASINS } from '@/lib/pilotBasins';
import {
  SatelliteOrbiter,
  SpectralPrism,
  HydraulicStream,
  ClinicalShield,
  PrecisionReticle,
  TemporalAperture,
  FhirNodeTerminal,
  RegulatorySeal,
} from '@/components/icons/CustomIcons';

export default function Home() {
  const [isFhirOpen, setIsFhirOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [activeSpectralTab, setActiveSpectralTab] = useState<'ndci' | 'ndwi' | 'turbidity' | 'thermal'>('ndci');

  const SPECTRAL_EXPLANATIONS = {
    ndci: {
      name: 'NDCI / Chlorophyll-a (Algae & Cyanotoxins)',
      formula: '(Band 5 RedEdge - Band 4 Red) / (Band 5 + Band 4)',
      resolution: '10-meter spatial pixel resolution',
      purpose:
        'Quantifies microcystin-producing cyanobacterial blooms (Harmful Algal Blooms) from space before water turns visible green to the naked eye. Mapped to LOINC 79177-2 and ICD-10 T65.8.',
      application:
        'Prevents severe hepatotoxicity and respiratory distress by alerting municipal water utilities to close intake pumps hours before toxic blooms arrive.',
    },
    ndwi: {
      name: 'NDWI (Normalized Difference Water Index)',
      formula: '(Band 3 Green - Band 8 NIR) / (Band 3 + Band 8)',
      resolution: '10-meter spatial pixel resolution',
      purpose:
        'Delineates exact waterbody boundaries, moisture pooling, and river canal contraction or flood expansion using high near-infrared water absorption.',
      application:
        'Monitors urban riverbank overflows, illegal embankment breaches, and seasonal canal shrinkage across entire municipal watersheds.',
    },
    turbidity: {
      name: 'Turbidity & Suspended Solids (SPM)',
      formula: 'Nechad Red Band (665 nm) Reflectance Model',
      resolution: '10-meter spatial pixel resolution',
      purpose:
        'Measures particulate scattering caused by construction dirt, agricultural topsoil erosion, and sewer overflow discharge. Mapped to LOINC 48421-2.',
      application:
        'Identifies clandestine industrial mud discharges and sewer spills within hours, protecting downstream benthic ecosystems and filter infrastructure.',
    },
    thermal: {
      name: 'Thermal Effluent Disparity',
      formula: 'Copernicus Multi-Temporal Surface Temperature Delta',
      resolution: '60-meter thermal/infrared composite',
      purpose:
        'Pinpoints abnormal thermal plumes caused by industrial coolant return pipes and clandestine hot chemical manufacturing outfalls.',
      application:
        'Detects localized thermal pollution shocks that trigger dissolved oxygen crashes and localized fish die-offs under EU Directive 2000/60/EC.',
    },
  };

  const PIPELINE_STAGES = [
    {
      step: '01',
      title: 'Orbital Reconnaissance',
      icon: SatelliteOrbiter,
      subtitle: 'Copernicus Sentinel-2 Multispectral Radiometry',
      description:
        'Continuous 290-km swath scanning by European Space Agency Sentinel-2 satellites. Captures 13 discrete electromagnetic bands invisible to human eyes every 5 days.',
      metric: '786 km Orbit · 13 Spectral Bands',
    },
    {
      step: '02',
      title: 'Optical Anomaly AI',
      icon: SpectralPrism,
      subtitle: 'Biophysical Index Synthesis',
      description:
        'Real-time automated computation of NDWI, NDCI / Chlorophyll-a, and turbidity reflectance. Automatically generates a 0–100 Composite Water Quality Index (WQI).',
      metric: '10m Resolution · Instant Computation',
    },
    {
      step: '03',
      title: 'Hydrodynamic Transport',
      icon: HydraulicStream,
      subtitle: 'Manning-Strickler Downstream Propagation',
      description:
        'Integrates live Open-Meteo river discharge (m³/s) to model the downstream movement speed and exact arrival times at public beaches, drinking intakes, and kayak parks.',
      metric: 'Real-time Flow (km/h) · POI ETA Modeling',
    },
    {
      step: '04',
      title: 'Clinical Early Warning',
      icon: ClinicalShield,
      subtitle: 'HL7 FHIR R4 Medical Interoperability',
      description:
        'Translates orbital anomalies directly into HL7 FHIR clinical observation bundles with LOINC and ICD-10 codes, notifying hospitals before poisoned patients enter triage.',
      metric: 'LOINC 79177-2 · ICD-10 T65.8 Preemption',
    },
  ];

  const CORE_MODULES = [
    {
      href: '/sentinel',
      title: 'Live Sentinel Platform',
      tag: 'Working System',
      description:
        'The operational cockpit. Search any coordinates on Earth, query live Copernicus STAC satellites, inspect optical lenses, and run the time-machine comparison.',
      actionText: 'Launch Live Platform →',
      icon: SatelliteOrbiter,
    },
    {
      href: '/why-we-win',
      title: 'Judging Criteria & Scorecard',
      tag: 'Rubric Breakdown',
      description:
        'A transparent, evidence-based breakdown showing how AquaLens meets the 5 official hackathon criteria with head-to-head comparisons against manual testing.',
      actionText: 'Review Criteria →',
      icon: RegulatorySeal,
    },
    {
      href: '/impact',
      title: 'One Health & Clinical Impact',
      tag: 'Public Biosecurity',
      description:
        'In-depth clinical epidemiology, waterborne disease prevention profiles (ICD-10 T65.8, A08.4, A27.0), €4.2M+ regional savings, and 5 European pilot basins.',
      actionText: 'Explore Impact Metrics →',
      icon: ClinicalShield,
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white text-black min-h-screen">
      {/* Precision Navigation Bar */}
      <Navbar
        onOpenFhir={() => setIsFhirOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-subtle border border-editorial-hairline shadow-softPill">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
              One Health Space Sentinel · IEEE Global Hackathon 2026
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black font-sans leading-[1.05]">
            From Orbit to <br />
            <span className="bg-[#FFE500] px-4 py-1 rounded-2xl inline-block mt-2 shadow-softPill">
              Bloodstream.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-editorial-muted font-normal max-w-2xl mx-auto leading-relaxed">
            AquaLens is an autonomous, space-to-clinic freshwater surveillance platform. We connect European Space Agency Copernicus satellite telemetry directly to hospital emergency informatics—preventing waterborne disease outbreaks before they reach human communities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/sentinel"
              className="px-8 py-3.5 rounded-full bg-black hover:bg-[#FFE500] text-white hover:text-black font-mono font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 shadow-softPill"
            >
              Launch Live Monitor →
            </Link>

            <Link
              href="/why-we-win"
              className="px-8 py-3.5 rounded-full bg-surface-subtle hover:bg-black text-black hover:text-[#FFE500] font-mono font-bold text-xs uppercase tracking-widest border border-editorial-hairline transition-all duration-200 active:scale-95 shadow-softPill"
            >
              Judging Criteria
            </Link>

            <button
              onClick={() => setIsFhirOpen(true)}
              className="px-6 py-3.5 rounded-full bg-white hover:bg-surface-subtle text-black font-mono font-bold text-xs uppercase tracking-widest border border-editorial-hairline transition-all duration-200 active:scale-95 shadow-softPill flex items-center gap-1.5"
            >
              <FhirNodeTerminal className="w-4 h-4 text-black" />
              <span>Hospital Alert Data</span>
            </button>
          </div>
        </section>

        {/* Section 1: The Problem & The Blind Spot */}
        <section className="rounded-3xl bg-surface-subtle border border-editorial-hairline p-8 lg:p-12 shadow-elevation space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase bg-white px-3 py-1 rounded-full border border-editorial-hairline shadow-softPill">
              The Critical Dilemma
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black font-sans">
              Why Traditional River Monitoring Fails
            </h2>
            <p className="text-sm text-editorial-muted leading-relaxed">
              Every year, millions of citizens suffer from preventable waterborne illnesses due to structural gaps in environmental testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="text-2xl font-black text-black">99% Blind</div>
              <div className="font-bold text-black uppercase font-sans text-sm">Spatial Blind Spots</div>
              <p className="text-editorial-muted leading-relaxed">
                Manual field testing probes inspect only sporadic 100-meter segments. Hundreds of kilometers of riverbanks remain completely unmonitored, allowing clandestine night dumping to go undetected.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="text-2xl font-black text-black">5–7 Days</div>
              <div className="font-bold text-black uppercase font-sans text-sm">Laboratory Latency</div>
              <p className="text-editorial-muted leading-relaxed">
                Taking water samples, transporting them to regional labs, and cultivating bacterial cultures takes days. By the time contamination is confirmed, toxic water has already reached municipal taps and swimming beaches.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="text-2xl font-black text-black">Zero Link</div>
              <div className="font-bold text-black uppercase font-sans text-sm">Disconnected Health Data</div>
              <p className="text-editorial-muted leading-relaxed">
                Environmental departments and hospital emergency rooms operate in total isolation. Doctors receive vomiting children or skin-blistered patients without knowing a cyanotoxin plume is flowing through the local river.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: The 4-Stage Autonomous Space-to-Clinic Pipeline */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase bg-surface-subtle px-3 py-1 rounded-full border border-editorial-hairline">
              End-to-End Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black font-sans">
              The 4-Stage Space-to-Clinic Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-editorial-muted">
              From photons captured in low-Earth orbit to automated clinical early-warning records in hospital electronic health record systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PIPELINE_STAGES.map((stage) => {
              const IconComp = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="rounded-3xl bg-surface-subtle border border-editorial-hairline p-6 lg:p-7 shadow-elevation flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-editorial-hairline pb-3">
                      <span className="w-8 h-8 rounded-full bg-black text-[#FFE500] font-mono font-bold text-xs flex items-center justify-center">
                        {stage.step}
                      </span>
                      <IconComp className="w-5 h-5 text-black" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold uppercase tracking-tight text-black font-sans">
                        {stage.title}
                      </h3>
                      <div className="text-[11px] font-mono text-editorial-light font-semibold uppercase">
                        {stage.subtitle}
                      </div>
                    </div>

                    <p className="text-xs text-editorial-muted leading-relaxed font-mono">
                      {stage.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-editorial-hairline">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-white border border-editorial-hairline text-[10px] font-mono font-bold text-editorial-charcoal">
                      {stage.metric}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Interactive Multispectral Index Explorer */}
        <section className="rounded-3xl bg-surface-subtle border border-editorial-hairline p-8 lg:p-12 shadow-elevation space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-hairline pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest uppercase bg-white px-3 py-1 rounded-full border border-editorial-hairline shadow-softPill">
                Spectral Physics
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black font-sans">
                Multispectral Radiometry Explained
              </h2>
            </div>

            {/* Tab Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-full border border-editorial-hairline shadow-softPill">
              {(['ndci', 'ndwi', 'turbidity', 'thermal'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSpectralTab(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold transition-all ${
                    activeSpectralTab === tab
                      ? 'bg-black text-[#FFE500] shadow-sm'
                      : 'text-editorial-muted hover:text-black'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Active Spectral Info Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-black uppercase">Active Filter</span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black font-sans">
                  {SPECTRAL_EXPLANATIONS[activeSpectralTab].name}
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-editorial-hairline font-mono text-xs space-y-2 shadow-softPill">
                <div className="text-editorial-light uppercase font-semibold">Mathematical Formula:</div>
                <div className="text-black font-bold text-sm bg-surface-subtle p-2 rounded-xl border border-editorial-hairline">
                  {SPECTRAL_EXPLANATIONS[activeSpectralTab].formula}
                </div>
                <div className="text-[11px] text-editorial-muted">
                  Spatial Resolution: <span className="font-semibold text-black">{SPECTRAL_EXPLANATIONS[activeSpectralTab].resolution}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-editorial-charcoal leading-relaxed font-mono">
                {SPECTRAL_EXPLANATIONS[activeSpectralTab].purpose}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-4">
              <div className="flex items-center gap-2 text-black font-bold uppercase text-xs font-mono border-b border-editorial-hairline pb-2">
                <ClinicalShield className="w-4 h-4 text-[#FFE500]" />
                Public Health & Early Warning Application
              </div>

              <p className="text-xs font-mono text-editorial-muted leading-relaxed">
                {SPECTRAL_EXPLANATIONS[activeSpectralTab].application}
              </p>

              <div className="pt-2">
                <Link
                  href="/sentinel"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-black hover:text-[#FFE500] bg-black hover:bg-black/90 text-white px-4 py-2 rounded-full shadow-softPill transition-all"
                >
                  <span>Test on Live Map</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: The 3 Operational Pages of AquaLens */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-editorial-hairline pb-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase bg-surface-subtle text-editorial-charcoal px-3 py-1 rounded-full border border-editorial-hairline">
                Platform Architecture
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-black mt-2 font-sans">
                Explore the Complete AquaLens Suite
              </h2>
            </div>
            <span className="hidden sm:inline text-xs text-editorial-muted font-mono uppercase font-semibold">
              3 Distinct Functional Routes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_MODULES.map((mod, mIdx) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={mIdx}
                  className="rounded-3xl bg-white border border-editorial-hairline p-7 shadow-elevation flex flex-col justify-between space-y-6 group hover:border-black transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-surface-subtle text-editorial-charcoal font-mono text-[11px] font-semibold border border-editorial-hairline">
                        {mod.tag}
                      </span>
                      <IconComp className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-tight text-black font-sans">
                      {mod.title}
                    </h3>

                    <p className="text-xs text-editorial-muted leading-relaxed font-mono">
                      {mod.description}
                    </p>
                  </div>

                  <Link
                    href={mod.href}
                    className="w-full py-3 rounded-full bg-black group-hover:bg-[#FFE500] text-white group-hover:text-black font-mono font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-softPill text-center block"
                  >
                    {mod.actionText}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Standards & Real Earth APIs Banner */}
        <section className="rounded-3xl bg-black text-white p-8 lg:p-12 shadow-floating space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#FFE500]">
                Institutional Interoperability
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                Powered by Public Earth Observation APIs
              </h3>
              <p className="text-xs sm:text-sm text-[#AAAAAA] max-w-2xl leading-relaxed">
                AquaLens queries the real European Space Agency Copernicus Data Space STAC catalog and the Open-Meteo Flood Hydrology API with zero runtime software fees.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsFhirOpen(true)}
                className="px-6 py-3 rounded-full bg-[#FFE500] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-softPill"
              >
                Inspect HL7 FHIR Spec
              </button>
              <button
                onClick={() => setIsDossierOpen(true)}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono font-semibold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95"
              >
                EU Legal Dossier
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white uppercase">ESA Copernicus</div>
              <div className="text-[11px] text-[#888888]">Sentinel-2 MSI 13-band radiometry</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white uppercase">CDSE STAC API</div>
              <div className="text-[11px] text-[#888888]">Live spatial granule querying</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white uppercase">Open-Meteo Hydro</div>
              <div className="text-[11px] text-[#888888]">River discharge (m³/s) velocity</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white uppercase">HL7 FHIR R4</div>
              <div className="text-[11px] text-[#888888]">LOINC 79177-2 & ICD-10 T65.8</div>
            </div>
          </div>
        </section>
      </main>

      {/* Monochromatic Hardware Footer */}
      <footer className="border-t border-editorial-hairline bg-white py-12 px-6 lg:px-8 text-center text-xs font-mono">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-black uppercase font-semibold">
            AquaLens &mdash; Space-to-Clinic Freshwater Surveillance &mdash;{' '}
            <span className="bg-[#FFE500] px-2 py-0.5 rounded text-black font-bold">
              OneAquaHealth IEEE Global Hackathon 2026
            </span>
          </p>
          <p className="text-editorial-muted uppercase text-[11px]">
            European Space Agency Copernicus Data Space Ecosystem · Open-Meteo Hydrology · HL7 FHIR R4 Standard
          </p>
        </div>
      </footer>

      {/* Global Standards Modals */}
      <FhirInspector
        basin={PILOT_BASINS[0]}
        isOpen={isFhirOpen}
        onClose={() => setIsFhirOpen(false)}
      />

      <RegulatoryDossier
        basin={PILOT_BASINS[0]}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </div>
  );
}
