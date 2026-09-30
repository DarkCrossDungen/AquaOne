'use client';

import React, { useState } from 'react';
import { PilotBasin, DownstreamPOI } from '@/lib/types';
import { ClinicalShield, HydraulicStream } from '@/components/icons/CustomIcons';

interface OneHealthAlertsProps {
  basin: PilotBasin;
  selectedPOI?: DownstreamPOI | null;
}

export const OneHealthAlerts: React.FC<OneHealthAlertsProps> = ({ basin, selectedPOI }) => {
  const [dispatchedAlerts, setDispatchedAlerts] = useState<Record<string, boolean>>({});

  const handleDispatch = (poiId: string) => {
    setDispatchedAlerts((prev) => ({ ...prev, [poiId]: true }));
  };

  return (
    <div className="rounded-3xl bg-white border border-editorial-hairline p-6 lg:p-10 shadow-elevation flex flex-col gap-8 transition-all">
      {/* Title & Speed Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-editorial-hairline">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-editorial-hairline text-xs font-mono font-semibold uppercase tracking-wider text-black">
            <ClinicalShield className="w-3.5 h-3.5 text-[#FFE500]" />
            <span>Space-to-Clinic Early Warning</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-black uppercase font-sans">
            Downstream Epidemiological Forecast
          </h2>
          <p className="text-sm text-editorial-muted font-normal">
            Real-time hydrodynamic transport at {basin.plume.flowVelocityKmH} km/h toward municipal recreation and drinking assets.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-black text-[#FFE500] font-bold uppercase shadow-sm">
            {basin.downstreamPOIs.length} Municipal Receptors At Risk
          </span>
        </div>
      </div>

      {/* Sleek Downstream Receptors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {basin.downstreamPOIs.map((poi, idx) => {
          const isCritical = poi.riskLevel === 'critical';
          const isDispatched = dispatchedAlerts[poi.id];
          const isSelected = selectedPOI?.id === poi.id;

          return (
            <div
              key={poi.id}
              className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-6 ${
                isCritical
                  ? 'bg-surface-subtle border-black/15 shadow-elevation'
                  : 'bg-white border-editorial-hairline hover:border-black/20'
              } ${isSelected ? 'ring-2 ring-[#FFE500]' : ''}`}
            >
              <div className="space-y-4">
                {/* Header: Name & Severity Tag */}
                <div className="flex items-start justify-between gap-3 border-b border-editorial-hairline pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-editorial-light font-semibold uppercase tracking-wider">
                      Receptor 0{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-black uppercase tracking-tight leading-snug font-sans">
                      {poi.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                      isCritical
                        ? 'bg-[#FFE500] text-black shadow-sm'
                        : 'bg-black text-white'
                    }`}
                  >
                    {poi.riskLevel}
                  </span>
                </div>

                {/* Distance & Arrival ETA */}
                <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-editorial-hairline">
                  <span className="flex items-center gap-1.5 text-editorial-charcoal font-semibold">
                    <HydraulicStream className="w-3.5 h-3.5 text-black" />
                    {poi.distanceKm} km reach
                  </span>
                  <span className="flex items-center gap-1.5 bg-black text-[#FFE500] px-2.5 py-1 rounded-md font-bold">
                    ETA: {poi.etaHours}h
                  </span>
                </div>

                {/* Clinical Disease Exposure & Advisory */}
                <div className="space-y-2">
                  <div className="text-xs text-black font-semibold uppercase font-sans">
                    {poi.diseaseDescription}
                  </div>
                  <div className="text-[11px] font-mono bg-surface-subtle text-black px-2.5 py-1 rounded-md border border-editorial-hairline inline-block font-bold">
                    ICD-10: <span className="text-black font-extrabold">{poi.icd10Code}</span>
                  </div>
                  <p className="text-xs text-editorial-muted leading-relaxed font-normal">
                    &ldquo;{poi.healthAdvisory}&rdquo;
                  </p>
                </div>
              </div>

              {/* Action Button: Black / Yellow State */}
              <div>
                {isDispatched ? (
                  <div className="w-full py-2.5 px-4 rounded-full bg-[#FFE500] text-black text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 shadow-sm">
                    <span className="font-bold">✓</span>
                    <span>Advisory Transmitted</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDispatch(poi.id)}
                    className="w-full py-2.5 px-4 rounded-full bg-black hover:bg-[#FFE500] text-[#FFE500] hover:text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-softPill"
                  >
                    <span>Dispatch Precautionary Alert</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
