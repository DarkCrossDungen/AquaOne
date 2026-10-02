'use client';

import React, { useState } from 'react';
import { PilotBasin } from '@/lib/types';
import { TemporalAperture } from '@/components/icons/CustomIcons';

interface TimeMachineSliderProps {
  basin: PilotBasin;
}

export const TimeMachineSlider: React.FC<TimeMachineSliderProps> = ({ basin }) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="rounded-3xl bg-white border border-editorial-hairline p-6 lg:p-10 shadow-elevation flex flex-col gap-6 transition-all">
      {/* Title & Human-Friendly Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-editorial-hairline">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-editorial-hairline text-xs font-mono font-semibold uppercase tracking-wider text-black">
            <TemporalAperture className="w-3.5 h-3.5 text-black" />
            <span>Before & After Satellite Evidence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-black uppercase font-sans">
            River Time Comparison Slider
          </h2>
          <p className="text-xs sm:text-sm text-editorial-muted font-normal max-w-xl">
            Drag the scrub bar left and right to see how this river deteriorated from a healthy waterway into a toxic contaminated zone.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <span className="text-editorial-charcoal bg-surface-subtle px-3 py-1.5 rounded-lg border border-editorial-hairline font-semibold uppercase">
            Baseline: {basin.historicalBaselineDate}
          </span>
          <span className="text-black bg-[#FFE500] px-3 py-1.5 rounded-lg font-bold uppercase shadow-sm">
            Active Scan: {basin.recentPassDate}
          </span>
        </div>
      </div>

      {/* In Simple Words Helper Callout */}
      <div className="p-4 rounded-2xl bg-surface-subtle border border-editorial-hairline text-xs font-mono text-editorial-charcoal flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="font-bold text-black uppercase shrink-0 bg-white px-2 py-0.5 rounded border border-editorial-hairline">
            How to use:
          </span>
          <p className="text-editorial-muted leading-relaxed">
            Move the slider handle horizontally. The <strong>left side</strong> shows the river months ago when it was clean. The <strong>right side</strong> shows today&apos;s satellite photo after toxic algae and chemical runoff flooded the river channel.
          </p>
        </div>
      </div>

      {/* Tactile Split Slider Canvas: Precision River Comparison */}
      <div className="relative w-full h-72 md:h-84 rounded-2xl overflow-hidden border border-editorial-hairline bg-surface-subtle select-none shadow-inner">
        {/* Layer 1: ACTIVE INCIDENT (TODAY'S TOXIC PLUME) */}
        <div className="absolute inset-0 w-full h-full bg-[#18181C] flex items-center justify-center overflow-hidden">
          {/* River banks / terrain background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Active Toxic River Channel */}
          <div className="relative w-[120%] h-24 bg-[#0A0A0E] -rotate-3 flex items-center justify-center overflow-hidden border-y-2 border-[#FFE500]">
            {/* Toxic Algae & Chemical Plume */}
            <div className="absolute inset-0 bg-[#FFE500] opacity-90 flex items-center justify-center">
              <span className="text-black font-mono font-bold text-xs tracking-widest uppercase bg-black/10 px-4 py-1.5 rounded">
                ⚠ TOXIC ALGAE PLUME DETECTED — SPEED {basin.plume.flowVelocityKmH} KM/H
              </span>
            </div>
          </div>

          {/* Right Floating Badge (Today's Condition) */}
          <div className="absolute bottom-4 right-4 z-10 bg-black/95 backdrop-blur-xl text-white border border-white/20 p-3 rounded-xl text-xs font-mono shadow-floating">
            <div className="text-[#FFE500] font-bold uppercase text-[11px]">
              TODAY ({basin.recentPassDate})
            </div>
            <div className="text-white font-bold text-sm mt-0.5">
              TOXIC CONTAMINATION ACTIVE
            </div>
            <div className="text-[11px] text-editorial-light mt-0.5">
              Health Status: Severe Hazard · Score: {basin.plume.wqiEquivalent}/100
            </div>
          </div>
        </div>

        {/* Layer 2: HISTORICAL BASELINE (PAST CLEAN RIVER) */}
        <div
          className="absolute inset-0 h-full overflow-hidden border-r-2 border-[#FFE500] bg-surface-subtle"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* Past Clean River Channel */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#EFEFEF]">
            <div className="relative w-[140%] h-24 bg-white -rotate-3 border-y-2 border-black/20 flex items-center justify-center shadow-sm">
              <span className="text-black font-mono font-bold text-xs tracking-widest uppercase bg-surface-subtle px-4 py-1.5 rounded border border-editorial-hairline">
                ✓ CLEAN WATERWAY — HEALTHY & SAFE
              </span>
            </div>
          </div>

          {/* Left Floating Badge (Past Clean Condition) */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-xl border border-editorial-hairline p-3 rounded-xl text-xs font-mono shadow-floating whitespace-nowrap">
            <div className="text-editorial-muted font-semibold uppercase text-[11px]">
              PAST ({basin.historicalBaselineDate})
            </div>
            <div className="text-black font-bold text-sm mt-0.5">
              NATURAL CLEAN STATE
            </div>
            <div className="text-[11px] text-editorial-muted mt-0.5">
              Health Status: Safe & Unimpaired · Score: 88/100
            </div>
          </div>
        </div>

        {/* Tactile Scrub Handle (No Circular Dots - Sleek Rectangular Slider Pill) */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-20 flex items-center justify-center"
          style={{ left: `calc(${sliderPosition}% - 22px)` }}
        >
          <div className="px-2.5 py-1.5 rounded-lg bg-[#FFE500] text-black border border-black shadow-floating flex items-center gap-1 font-mono font-black text-[10px] tracking-wider uppercase">
            <span>◀</span>
            <span>DRAG</span>
            <span>▶</span>
          </div>
        </div>

        {/* Range Input for scrubbing */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          aria-label="Drag to compare past vs today"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        />
      </div>

      {/* 4 Simplified Plain-English Impact Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        {(() => {
          const algaePct = Math.max(80, Math.round(((basin.plume.chlorophyllConcentrationMgM3 - 10) / 10) * 100));
          const turbPct = Math.max(60, Math.round(((basin.spectralStats.turbidityNtu - 5) / 5) * 100));

          return (
            <>
              <div className="p-4 rounded-2xl bg-surface-subtle border border-editorial-hairline shadow-softPill space-y-1">
                <span className="text-[10px] tracking-wider uppercase text-editorial-light font-semibold">
                  Toxic Algae Spike
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-black">+{algaePct}%</div>
                <span className="text-[11px] font-semibold text-black bg-[#FFE500] px-2 py-0.5 rounded inline-block">
                  Severe Bloom Active
                </span>
                <p className="text-[10px] text-editorial-muted pt-1">Causes stomach illness & rashes</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-subtle border border-editorial-hairline shadow-softPill space-y-1">
                <span className="text-[10px] tracking-wider uppercase text-editorial-light font-semibold">
                  Water Cloudiness
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-black">+{turbPct}%</div>
                <span className="text-[11px] font-semibold text-black bg-white px-2 py-0.5 rounded border border-editorial-hairline inline-block">
                  Mud & Sewage Runoff
                </span>
                <p className="text-[10px] text-editorial-muted pt-1">Suspended particles in water</p>
              </div>
            </>
          );
        })()}

        <div className="p-4 rounded-2xl bg-surface-subtle border border-editorial-hairline shadow-softPill space-y-1">
          <span className="text-[10px] tracking-wider uppercase text-editorial-light font-semibold">
            Polluted River Size
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-black">
            {(basin.plume.areaSqMeters / 10000).toFixed(1)}{' '}
            <span className="text-xs font-normal text-editorial-muted">Hectares</span>
          </div>
          <span className="text-[11px] font-semibold text-black bg-white px-2 py-0.5 rounded border border-editorial-hairline inline-block">
            Contaminated Area
          </span>
          <p className="text-[10px] text-editorial-muted pt-1">Spanning multiple kilometers</p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-subtle border border-editorial-hairline shadow-softPill space-y-1">
          <span className="text-[10px] tracking-wider uppercase text-editorial-light font-semibold">
            Water Flow Speed
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-black">
            {basin.plume.flowVelocityKmH}{' '}
            <span className="text-xs font-normal text-editorial-muted">KM/H</span>
          </div>
          <span className="text-[11px] font-semibold text-black bg-[#FFE500] px-2 py-0.5 rounded inline-block">
            Moving Toward Town
          </span>
          <p className="text-[10px] text-editorial-muted pt-1">Flowing to public beaches</p>
        </div>
      </div>
    </div>
  );
};
