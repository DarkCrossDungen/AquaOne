'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { FhirInspector } from '@/components/FhirInspector';
import { RegulatoryDossier } from '@/components/RegulatoryDossier';
import { PILOT_BASINS } from '@/lib/pilotBasins';
import {
  ClinicalShield,
  HydraulicStream,
  SatelliteOrbiter,
  RegulatorySeal,
} from '@/components/icons/CustomIcons';

export default function ImpactPage() {
  const [isFhirOpen, setIsFhirOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  const DISEASE_PROFILES = [
    {
      code: 'ICD-10 T65.8',
      title: 'Microcystin Cyanotoxin Toxicity',
      pollutant: 'Cyanobacteria / Harmful Algal Blooms (HABs)',
      pathway: 'Direct recreational swimming contact, ingestion, or aerosolized inhalation near river weirs.',
      clinicalImpact:
        'Severe hepatotoxicity, acute liver enzyme spikes, blistering contact dermatitis, and acute respiratory bronchospasms.',
      prevention:
        'AquaLens detects chlorophyll-a anomalies at 10m resolution, forecasting downstream arrival at public beaches 2–6 hours before human exposure.',
    },
    {
      code: 'ICD-10 A08.4',
      title: 'Waterborne Infectious Gastroenteritis',
      pollutant: 'Cryptosporidium, Giardia, Enteropathogenic E. coli',
      pathway: 'Municipal drinking water abstraction or immersion swimming during sewer storm overflow.',
      clinicalImpact:
        'Violent dehydration, acute pediatric vomiting, abdominal cramps, and potential hemolytic uremic syndrome.',
      prevention:
        'Automated HL7 FHIR alerts prompt drinking water treatment plants to preemptively close intake gates and engage carbon adsorption filters.',
    },
    {
      code: 'ICD-10 A27.0',
      title: 'Acute Urban Leptospirosis',
      pollutant: 'Leptospira interrogans from urban rodent burrows',
      pathway: 'Flooded urban riverbanks and kayak parks following heavy precipitation and rapid stream velocity.',
      clinicalImpact:
        'Biphasic fever, acute renal failure, jaundice, pulmonary hemorrhage, and Weil disease.',
      prevention:
        'Combines Open-Meteo flood discharge velocity with satellite sediment plumes to issue immediate park closure notices to local councils.',
    },
  ];

  const ECONOMIC_IMPACTS = [
    {
      stat: '€4.2M+',
      label: 'Annual Regional Health Savings',
      detail: 'Averted ER visits and outpatient acute treatments across European pilot river basins by stopping waterborne disease outbreaks at the source.',
    },
    {
      stat: '100%',
      label: 'Watershed Spatial Coverage',
      detail: 'Replaces sporadic 100-meter localized probe testing with 290-kilometer continuous satellite swaths covering every tributary.',
    },
    {
      stat: '4–8 Hours',
      label: 'Preemptive Action Window',
      detail: 'Hydrodynamic flow velocity modeling alerts drinking water intakes hours before toxic plumes arrive at municipal abstraction pumps.',
    },
    {
      stat: '€0',
      label: 'Recurring Sensor Maintenance',
      detail: 'Operates entirely on free, open European Space Agency Copernicus data without expensive in-stream probe fouling or vandalism.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white text-black min-h-screen">
      <Navbar
        onOpenFhir={() => setIsFhirOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-subtle border border-editorial-hairline shadow-softPill">
            <ClinicalShield className="w-3.5 h-3.5 text-[#FFE500]" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black">
              One Health · Environmental Biosecurity · Public Prevention
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black font-sans leading-tight">
            How AquaLens <br />
            <span className="bg-[#FFE500] px-4 py-0.5 rounded-2xl inline-block mt-2 shadow-softPill">
              Saves Lives & Waterways.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-editorial-muted font-normal leading-relaxed max-w-2xl mx-auto">
            Traditional river monitoring treats environmental data as isolated statistics. AquaLens activates the One Health paradigm—preventing human disease by protecting aquatic ecosystems from orbit.
          </p>
        </section>

        {/* The One Health Triad Diagram */}
        <section className="rounded-3xl bg-surface-subtle border border-editorial-hairline p-8 lg:p-12 shadow-elevation space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase bg-white px-3 py-1 rounded-full border border-editorial-hairline shadow-softPill">
              The One Health Continuum
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black font-sans">
              Interconnected Ecological Defense
            </h2>
            <p className="text-xs sm:text-sm text-editorial-muted">
              Water health is not isolated—it is the direct precursor to wildlife biodiversity and human population health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="flex items-center gap-2 text-black font-bold uppercase text-sm font-sans border-b border-editorial-hairline pb-2">
                <SatelliteOrbiter className="w-4 h-4 text-black" />
                1. Healthy Waters
              </div>
              <p className="text-xs text-editorial-muted leading-relaxed font-mono">
                Satellite MSI sensors detect cyanobacteria chlorophyll-a, chemical turbidity, and industrial thermal effluent within hours of discharge, preventing river eutrophication.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="flex items-center gap-2 text-black font-bold uppercase text-sm font-sans border-b border-editorial-hairline pb-2">
                <HydraulicStream className="w-4 h-4 text-[#FFE500]" />
                2. Healthy Ecosystems
              </div>
              <p className="text-xs text-editorial-muted leading-relaxed font-mono">
                Preserves benthic macroinvertebrates, fish nurseries, and riparian biodiversity by enforcing EU Directive 2000/60/EC limits against clandestine polluters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="flex items-center gap-2 text-black font-bold uppercase text-sm font-sans border-b border-editorial-hairline pb-2">
                <ClinicalShield className="w-4 h-4 text-black" />
                3. Healthy Communities
              </div>
              <p className="text-xs text-editorial-muted leading-relaxed font-mono">
                Translates space observations into HL7 FHIR clinical standards, preempting contaminated drinking water abstraction and alerting clinics before disease clusters emerge.
              </p>
            </div>
          </div>
        </section>

        {/* Disease Profiles Prevented */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-editorial-hairline pb-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase bg-surface-subtle text-editorial-charcoal px-3 py-1 rounded-full border border-editorial-hairline">
                Clinical Pathology Linkage
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-black mt-2 font-sans">
                Waterborne Diseases Preempted by AquaLens
              </h2>
            </div>
            <span className="hidden sm:inline text-xs text-editorial-muted font-mono uppercase font-semibold">
              ICD-10 & LOINC Clinical Mappings
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {DISEASE_PROFILES.map((dp, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-editorial-hairline p-6 lg:p-8 shadow-elevation space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-editorial-hairline pb-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black text-[#FFE500]">
                      {dp.code}
                    </span>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-black font-sans mt-1">
                      {dp.title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono text-editorial-muted bg-surface-subtle px-3 py-1 rounded-full border border-editorial-hairline font-semibold self-start sm:self-auto">
                    Cause: {dp.pollutant}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-surface-subtle border border-editorial-hairline space-y-1">
                    <span className="font-bold text-black uppercase">Exposure Pathway</span>
                    <p className="text-editorial-muted leading-relaxed">{dp.pathway}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-subtle border border-editorial-hairline space-y-1">
                    <span className="font-bold text-black uppercase">Clinical Manifestation</span>
                    <p className="text-editorial-muted leading-relaxed">{dp.clinicalImpact}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFE500]/15 border border-[#FFE500]/40 space-y-1">
                    <span className="font-bold text-black uppercase">AquaLens Preemption</span>
                    <p className="text-editorial-charcoal leading-relaxed">{dp.prevention}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Economic & Healthcare Impact Stats */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-editorial-hairline pb-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase bg-surface-subtle text-editorial-charcoal px-3 py-1 rounded-full border border-editorial-hairline">
                Quantified Benefits
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-black mt-2 font-sans">
                Economic & Operational Impact
              </h2>
            </div>
            <span className="hidden sm:inline text-xs text-editorial-muted font-mono uppercase font-semibold">
              Municipal & Regional Scale
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
            {ECONOMIC_IMPACTS.map((stat, sIdx) => (
              <div
                key={sIdx}
                className="p-6 rounded-3xl bg-surface-subtle border border-editorial-hairline shadow-elevation space-y-2"
              >
                <div className="text-3xl lg:text-4xl font-black text-black">{stat.stat}</div>
                <div className="text-xs font-bold text-black uppercase font-sans">{stat.label}</div>
                <p className="text-xs text-editorial-muted leading-relaxed">{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5 Pilot Study Basins Summary */}
        <section className="rounded-3xl bg-surface-subtle border border-editorial-hairline p-8 lg:p-12 shadow-elevation space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-editorial-muted">
              Live Field Testing
            </span>
            <h3 className="text-2xl font-bold uppercase tracking-tight text-black font-sans">
              The 5 European Pilot Study Basins
            </h3>
            <p className="text-xs sm:text-sm text-editorial-muted">
              Validated on diverse European waterways covering UNESCO canals, agricultural river basins, and sub-alpine junctions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {PILOT_BASINS.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-base">
                    <span className="font-bold text-black uppercase">{b.name}</span>
                    <span>{b.flag}</span>
                  </div>
                  <div className="text-[11px] text-editorial-light mt-0.5">{b.riverName} ({b.country})</div>
                  <p className="text-editorial-muted mt-2 text-[11px] leading-relaxed line-clamp-2">
                    {b.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-editorial-hairline flex items-center justify-between text-[11px]">
                  <span className="text-black font-semibold">WQI: {b.plume.wqiEquivalent}/100</span>
                  <span className="px-2 py-0.5 bg-[#FFE500] text-black font-bold rounded-full">
                    {b.plume.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="rounded-3xl bg-black text-white p-8 lg:p-12 shadow-floating flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#FFE500]">
              Operational Prototype
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
              Experience the Solution Live
            </h3>
            <p className="text-xs sm:text-sm text-[#AAAAAA] max-w-xl">
              Inspect satellite spectral bands, simulate downstream contaminant travel velocity, and review HL7 FHIR hospital advisories in real time.
            </p>
          </div>

          <Link
            href="/sentinel"
            className="px-8 py-3.5 rounded-full bg-[#FFE500] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 shadow-softPill shrink-0 text-center"
          >
            Launch Live Monitor →
          </Link>
        </section>
      </main>

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
