'use client';

import React from 'react';
import { PilotBasin } from '@/lib/types';
import { RegulatorySeal } from '@/components/icons/CustomIcons';

interface RegulatoryDossierProps {
  basin: PilotBasin;
  isOpen: boolean;
  onClose: () => void;
}

export const RegulatoryDossier: React.FC<RegulatoryDossierProps> = ({ basin, isOpen, onClose }) => {
  if (!isOpen) return null;

  const dossierId = `DOSSIER-WFD-${basin.id.toUpperCase()}-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[88vh] bg-white border border-editorial-hairline rounded-3xl shadow-floating flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-editorial-hairline bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-[#FFE500]">
              <RegulatorySeal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold uppercase tracking-tight text-black font-sans">
                  EU Environmental Regulatory Enforcement Dossier
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black text-[#FFE500] font-bold">
                  Directive 2000/60/EC
                </span>
              </div>
              <p className="text-xs text-editorial-muted font-mono mt-0.5">
                Ref: {dossierId} · Autonomous Satellite Evidentiary Summary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-black text-black hover:text-[#FFE500] border border-editorial-hairline flex items-center justify-center transition-all font-mono font-bold text-xs"
            aria-label="Close Modal"
          >
            ✕
          </button>
        </div>

        {/* Human-Friendly Explainer Banner */}
        <div className="px-6 py-2.5 bg-surface-subtle border-b border-editorial-hairline text-xs font-mono text-editorial-charcoal">
          <strong>What is this?</strong> Official legal water inspection report. It compiles satellite coordinates, timestamps, and water contamination readings into a certified legal filing under European Union Directive 2000/60/EC, ready to submit to government environmental authorities.
        </div>

        {/* Legal Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-black text-xs leading-relaxed bg-surface-subtle font-mono">
          {/* Section 1: Earth Observation Evidence */}
          <div className="p-5 bg-white border border-editorial-hairline rounded-2xl shadow-softPill space-y-3">
            <div className="flex items-center justify-between border-b border-editorial-hairline pb-2">
              <span className="font-bold text-black tracking-tight text-sm uppercase font-sans">
                Section 1: Earth Observation Evidence
              </span>
              <span className="text-[11px] bg-[#FFE500] text-black px-2.5 py-0.5 rounded-full font-bold uppercase">
                {basin.plume.severity} Violation
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-editorial-charcoal">
              <div>WATERWAY: <strong className="text-black uppercase">{basin.riverName}</strong></div>
              <div>STATE / JURISDICTION: <strong className="text-black uppercase">{basin.country}</strong></div>
              <div>CONSTELLATION: <strong className="text-black uppercase">{basin.plume.satellite} (MSI)</strong></div>
              <div>TIMESTAMP: <strong className="text-black">{basin.plume.detectedAt}</strong></div>
              <div>ORIGIN COORDS: <strong className="bg-[#FFE500] px-1 rounded">[{basin.plume.lat}, {basin.plume.lng}]</strong></div>
              <div>CONTAMINATED AREA: <strong className="text-black">{(basin.plume.areaSqMeters / 10000).toFixed(2)} HA</strong></div>
            </div>
          </div>

          {/* Section 2: Statutory Violation */}
          <div className="p-5 bg-white border border-editorial-hairline rounded-2xl shadow-softPill space-y-3">
            <div className="border-b border-editorial-hairline pb-2">
              <span className="font-bold text-black tracking-tight text-sm uppercase font-sans">
                Section 2: Statutory & Regulatory Violations
              </span>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-surface-subtle border border-editorial-hairline rounded-xl">
                <strong className="text-black font-bold uppercase font-sans">
                  EU Water Framework Directive (2000/60/EC) — Article 4:
                </strong>
                <p className="text-editorial-muted mt-1 text-xs">
                  Severe failure of environmental obligation to prevent degradation of surface water bodies. Observed WQI ({basin.plume.wqiEquivalent}/100) confirms acute chemical/biological shock.
                </p>
              </div>

              <div className="p-4 bg-surface-subtle border border-editorial-hairline rounded-xl">
                <strong className="text-black font-bold uppercase font-sans">
                  EU Bathing Water Directive (2006/7/EC) — Cyanobacteria Protocol:
                </strong>
                <p className="text-editorial-muted mt-1 text-xs">
                  Chlorophyll-a density ({basin.plume.chlorophyllConcentrationMgM3} µg/L) exceeds WHO Alert Level 2 threshold (50 µg/L), necessitating immediate recreational restriction.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Downstream Receptors */}
          <div className="p-5 bg-white border border-editorial-hairline rounded-2xl shadow-softPill space-y-3">
            <div className="border-b border-editorial-hairline pb-2">
              <span className="font-bold text-black tracking-tight text-sm uppercase font-sans">
                Section 3: Downstream Receptors & Arrival Schedule
              </span>
            </div>
            <ul className="space-y-2 text-xs">
              {basin.downstreamPOIs.map((poi) => (
                <li key={poi.id} className="flex items-center justify-between p-2.5 bg-surface-subtle rounded-xl border border-editorial-hairline">
                  <span className="text-black font-semibold uppercase">{poi.name} ({poi.distanceKm} km)</span>
                  <span className="bg-black text-[#FFE500] px-2.5 py-0.5 rounded-full font-bold uppercase">ETA: {poi.etaHours} hrs</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-editorial-hairline bg-white font-mono">
          <span className="text-xs text-editorial-muted font-semibold uppercase">
            Official Legal Evidentiary Briefing
          </span>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full bg-black hover:bg-[#FFE500] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-softPill"
          >
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
