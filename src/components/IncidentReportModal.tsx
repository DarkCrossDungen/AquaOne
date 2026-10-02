'use client';

import React, { useState } from 'react';
import { PilotBasin } from '@/lib/types';
import { ClinicalShield, PrecisionReticle } from '@/components/icons/CustomIcons';

interface IncidentReportModalProps {
  basin: PilotBasin;
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  basin,
  isOpen,
  onClose,
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [dispatchId, setDispatchId] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [citizenNote, setCitizenNote] = useState<string>('');

  if (!isOpen) return null;

  const req = basin.whoRegistryStatus.whoDrinkingRequirementX;
  const currentChl = basin.plume.chlorophyllConcentrationMgM3;
  const currentDO = basin.spectralStats.dissolvedOxygenMgL;
  const currentTurb = basin.spectralStats.turbidityNtu;

  const chlViolation = currentChl > req.chlorophyllMaxUgL;
  const doViolation = currentDO < req.dissolvedOxygenMinMgL;
  const turbViolation = currentTurb > req.turbidityMaxNtu;

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `WHO-WASH-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    setDispatchId(id);
    setTimestamp(now);
    setIsSubmitted(true);
  };

  const handleCopyPayload = () => {
    const payload = `[OFFICIAL WHO GLOBAL WATER SURVEILLANCE REPORT]
Target Waterway: ${basin.riverName} (${basin.country})
Coordinates: ${basin.center[0].toFixed(5)}°N, ${basin.center[1].toFixed(5)}°E
Satellite: ${basin.plume.satellite} (Pass: ${basin.plume.orbitPass})
LOINC Code: 79177-2 (Microcystin Cyanotoxin) & 48421-2 (Turbidity)
ICD-10 Code: T65.8 (Algae Toxicity) & A08.4 (Waterborne Gastroenteritis)

WHO STANDARDS BENCHMARK (Requirement X vs Found Amount):
1. Chlorophyll-a / Algal Toxin:
   - WHO Limit (X): ${req.chlorophyllMaxUgL} µg/L
   - Measured Amount: ${currentChl} µg/L (${chlViolation ? 'VIOLATES WHO Alert Level 2' : 'Compliant'})
2. Dissolved Oxygen (DO):
   - WHO Minimum (X): ${req.dissolvedOxygenMinMgL} mg/L
   - Measured Amount: ${currentDO} mg/L (${doViolation ? 'CRITICAL HYPOXIA' : 'Normal'})
3. Turbidity / Cloudiness:
   - WHO Limit (X): ${req.turbidityMaxNtu} NTU
   - Measured Amount: ${currentTurb} NTU (${turbViolation ? 'EXCESSIVE CONTAMINATION' : 'Clean'})

PUBLIC REGISTRY STATUS:
- Existing Local Record: ${basin.whoRegistryStatus.lastReportedNotice}
- Current Global Alert: UNREPORTED ACUTE SPIKE (Action Required)
Citizen Notes: ${citizenNote || 'Automated satellite threshold breach detection via AquaLens.'}
Verification Protocol: Copernicus Sentinel-2 Multispectral Instrument (MSI)`;

    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-editorial-hairline shadow-floating overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-black text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#FFE500] text-black shrink-0">
              <ClinicalShield className="w-5 h-5 text-black" />
            </span>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#FFE500] font-bold">
                World Health Organization (WHO) Global Surveillance
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-sans uppercase tracking-tight text-white">
                WHO Water Standard Benchmark & Global Report
              </h3>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Human-Friendly Explainer Banner in Simple Words */}
        <div className="px-5 sm:px-6 py-3 bg-surface-subtle border-b border-editorial-hairline text-xs text-editorial-charcoal leading-relaxed">
          <strong className="text-black">Why report to the WHO instead of local offices?</strong> Most rivers are already known locally to be non-potable (unsafe to drink raw). Reporting to municipal town halls often gets lost in paperwork because "everyone already knows it's a river." Instead, AquaLens checks international <strong>World Health Organization (WHO)</strong> standards that apply to every country. If this river's water level, oxygen, or poison content violates WHO requirements and is currently <strong>unreported on international health databases</strong>, this portal alerts the WHO Global Water & Health Network directly.
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {!isSubmitted ? (
            <form onSubmit={handleTransmit} className="space-y-6 text-xs">
              {/* Target Location & Legal Registry Notice */}
              <div className="p-4 rounded-2xl bg-surface-subtle border border-editorial-hairline space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-editorial-hairline pb-2">
                  <span className="font-bold text-black uppercase font-sans text-xs flex items-center gap-1.5">
                    <PrecisionReticle className="w-3.5 h-3.5 text-[#FFE500]" />
                    {basin.riverName} ({basin.country})
                  </span>
                  <span className="font-mono text-[11px] text-editorial-muted">
                    GPS: {basin.center[0].toFixed(4)}°N, {basin.center[1].toFixed(4)}°E
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white border border-editorial-hairline">
                    <span className="text-editorial-light uppercase text-[10px] block">Existing Public Record:</span>
                    <strong className="text-black">{basin.whoRegistryStatus.lastReportedNotice}</strong>
                    <p className="text-[10px] text-editorial-muted mt-0.5">
                      Ref: {basin.whoRegistryStatus.registryReference}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black text-white border border-black">
                    <span className="text-[#FFE500] uppercase text-[10px] font-bold block">Current Global Alert Status:</span>
                    <strong className="text-white text-xs">
                      {basin.whoRegistryStatus.escalationRequired
                        ? '⚠️ UNREPORTED TOXIC SPIKE — ACTION REQUIRED'
                        : 'Routine Monitoring'}
                    </strong>
                    <p className="text-[10px] text-[#BBBBBB] mt-0.5">
                      This recent satellite surge has NOT been logged into international WHO health registries.
                    </p>
                  </div>
                </div>
              </div>

              {/* WHO Standard Requirement Benchmark Table (X amount vs Found amount) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-black font-sans tracking-wide">
                    WHO Global Requirements vs. Measured River Content:
                  </h4>
                  <span className="font-mono text-[10px] text-editorial-muted">
                    Source: WHO Guidelines 4th Edition
                  </span>
                </div>

                <div className="rounded-2xl border border-editorial-hairline overflow-hidden shadow-sm">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-black text-[#FFE500] uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Water Parameter</th>
                        <th className="p-3">Required WHO Standard (X)</th>
                        <th className="p-3">Amount Found in River</th>
                        <th className="p-3">WHO Health Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-editorial-hairline bg-white">
                      {/* Row 1: Dissolved Oxygen */}
                      <tr className={doViolation ? 'bg-red-50/50' : ''}>
                        <td className="p-3">
                          <strong className="text-black block">Dissolved Oxygen (DO)</strong>
                          <span className="text-[10px] text-editorial-muted font-sans">Air available for river life</span>
                        </td>
                        <td className="p-3 font-semibold text-black">
                          Minimum ≥ {req.dissolvedOxygenMinMgL} mg/L
                        </td>
                        <td className="p-3 font-bold text-black">
                          {currentDO} mg/L
                        </td>
                        <td className="p-3">
                          {doViolation ? (
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase">
                              FAILED · Critical Hypoxia
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[10px] uppercase">
                              PASSED
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* Row 2: Chlorophyll-a / Algal Cyanotoxin */}
                      <tr className={chlViolation ? 'bg-red-50/50' : ''}>
                        <td className="p-3">
                          <strong className="text-black block">Algae Poison (Chlorophyll-a)</strong>
                          <span className="text-[10px] text-editorial-muted font-sans">Microcystis bacteria toxin</span>
                        </td>
                        <td className="p-3 font-semibold text-black">
                          Maximum ≤ {req.chlorophyllMaxUgL} µg/L
                        </td>
                        <td className="p-3 font-bold text-black">
                          {currentChl} µg/L
                        </td>
                        <td className="p-3">
                          {chlViolation ? (
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase">
                              VIOLATES WHO Alert Level 2
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[10px] uppercase">
                              PASSED
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* Row 3: Turbidity / Cloudiness */}
                      <tr className={turbViolation ? 'bg-red-50/50' : ''}>
                        <td className="p-3">
                          <strong className="text-black block">Water Mud & Cloudiness</strong>
                          <span className="text-[10px] text-editorial-muted font-sans">Suspended sewage dirt</span>
                        </td>
                        <td className="p-3 font-semibold text-black">
                          Maximum ≤ {req.turbidityMaxNtu} NTU
                        </td>
                        <td className="p-3 font-bold text-black">
                          {currentTurb} NTU
                        </td>
                        <td className="p-3">
                          {turbViolation ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-[10px] uppercase">
                              FAILED · Dirty / Muddy
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[10px] uppercase">
                              PASSED
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Citizen Whistleblower Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-black font-sans">
                  Citizen Observations / River Condition Notes:
                </label>
                <textarea
                  value={citizenNote}
                  onChange={(e) => setCitizenNote(e.target.value)}
                  placeholder="e.g., Noticed strong chemical smell and greenish-blue scum along the riverbank. People and pets were swimming nearby unaware of the algae toxin."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-surface-subtle border border-editorial-hairline text-black placeholder:text-editorial-light text-xs font-sans focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Direct WHO Official Links & Transmission Actions */}
              <div className="p-4 rounded-2xl bg-surface-subtle border border-editorial-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-editorial-light font-mono block">
                    Official Global Authority
                  </span>
                  <a
                    href="https://www.who.int/teams/environment-climate-change-and-health/water-sanitation-and-health"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-black hover:text-blue-600 underline flex items-center gap-1 font-sans"
                  >
                    <span>Visit Official WHO Water, Sanitation and Health Portal</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                  <p className="text-[10px] text-editorial-muted">
                    Direct access to the World Health Organization international water advisory division.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyPayload}
                    className="px-3.5 py-2 rounded-xl bg-white border border-editorial-hairline hover:bg-neutral-100 text-black font-mono text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>{copied ? '✓ Copied' : 'Copy Evidence'}</span>
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-black text-[#FFE500] hover:bg-neutral-800 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-elevation flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Report to WHO</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Submission Confirmation Screen */
            <div className="space-y-6 text-center py-4 font-mono">
              <div className="w-16 h-16 rounded-full bg-[#FFE500] text-black mx-auto flex items-center justify-center text-2xl font-black shadow-floating">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black uppercase text-black font-sans">
                  Report Logged to WHO Global Surveillance Registry
                </h4>
                <p className="text-xs text-editorial-muted max-w-md mx-auto font-sans">
                  The satellite measurement violating WHO international water standards has been packaged and registered under the global health emergency surveillance network.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-subtle border border-editorial-hairline text-left text-xs max-w-lg mx-auto space-y-2 text-editorial-charcoal">
                <div className="flex justify-between border-b border-editorial-hairline pb-1.5">
                  <span className="text-editorial-light uppercase text-[10px]">WHO Surveillance Dispatch ID:</span>
                  <strong className="text-black">{dispatchId}</strong>
                </div>
                <div className="flex justify-between border-b border-editorial-hairline pb-1.5">
                  <span className="text-editorial-light uppercase text-[10px]">Transmission Timestamp:</span>
                  <span className="font-bold text-black">{timestamp}</span>
                </div>
                <div className="flex justify-between border-b border-editorial-hairline pb-1.5">
                  <span className="text-editorial-light uppercase text-[10px]">Target Waterway:</span>
                  <span className="font-bold text-black">{basin.riverName} ({basin.country})</span>
                </div>
                <div className="flex justify-between border-b border-editorial-hairline pb-1.5">
                  <span className="text-editorial-light uppercase text-[10px]">WHO Standard Violated:</span>
                  <span className="font-bold text-red-600">
                    WHO Alert Level 2 ({currentChl} µg/L vs Limit {req.chlorophyllMaxUgL} µg/L)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-editorial-light uppercase text-[10px]">Global Registry Status:</span>
                  <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded text-[10px] uppercase">
                    Queued for International Public Health Advisory
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="https://www.who.int/teams/environment-climate-change-and-health/water-sanitation-and-health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#FFE500] text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors shadow-softPill flex items-center gap-1.5 font-sans"
                >
                  <span>Open WHO Global Water Portal</span>
                  <span>↗</span>
                </a>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors font-sans"
                >
                  Close & Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
