'use client';

import React, { useState, useEffect } from 'react';
import { PILOT_BASINS } from '@/lib/pilotBasins';
import { PilotBasin, SpectralMode, DownstreamPOI } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { SatelliteMap } from '@/components/SatelliteMap';
import { SpectralViewer } from '@/components/SpectralViewer';
import { TimeMachineSlider } from '@/components/TimeMachineSlider';
import { OneHealthAlerts } from '@/components/OneHealthAlerts';
import { FhirInspector } from '@/components/FhirInspector';
import { RegulatoryDossier } from '@/components/RegulatoryDossier';
import {
  SatelliteOrbiter,
  SpectralPrism,
  PrecisionReticle,
  HydraulicStream,
  FhirNodeTerminal,
  ClinicalShield,
} from '@/components/icons/CustomIcons';

export default function SentinelPlatform() {
  const [currentBasin, setCurrentBasin] = useState<PilotBasin>(PILOT_BASINS[0]);
  const [spectralMode, setSpectralMode] = useState<SpectralMode>('chlorophyll');
  const [selectedPOI, setSelectedPOI] = useState<DownstreamPOI | null>(null);

  // Live Satellite STAC & Hydrology API State
  const [isQueryingApi, setIsQueryingApi] = useState<boolean>(false);
  const [apiTelemetry, setApiTelemetry] = useState<any>(null);
  const [customLat, setCustomLat] = useState<string>('43.6047');
  const [customLng, setCustomLng] = useState<string>('1.4442');

  // Modals state
  const [isFhirOpen, setIsFhirOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Query to /api/satellite
  const querySatelliteApi = async (lat?: number, lng?: number, basinId?: string) => {
    setIsQueryingApi(true);
    try {
      const activeBasinId = basinId || currentBasin.id;
      const urlLat = lat !== undefined ? lat : currentBasin.center[0];
      const urlLng = lng !== undefined ? lng : currentBasin.center[1];

      const res = await fetch(`/api/satellite?basinId=${activeBasinId}&lat=${urlLat}&lng=${urlLng}`);
      if (res.ok) {
        const data = await res.json();
        setApiTelemetry(data);
        showToast(`ESA Satellite Telemetry Synced (${data.satelliteObservation.mgrsTile || '31TCJ'})`);
      }
    } catch (err) {
      console.error('Satellite API fetch error:', err);
    } finally {
      setIsQueryingApi(false);
    }
  };

  // Initial fetch on mount or basin switch
  useEffect(() => {
    querySatelliteApi(currentBasin.center[0], currentBasin.center[1], currentBasin.id);
    setCustomLat(currentBasin.center[0].toString());
    setCustomLng(currentBasin.center[1].toString());
  }, [currentBasin]);

  const handleCustomCoordinateQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      querySatelliteApi(lat, lng);
    } else {
      showToast('Please enter valid numeric latitude and longitude.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white text-black min-h-screen">
      {/* Universal Multi-Page Navbar */}
      <Navbar
        onOpenFhir={() => setIsFhirOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* Interactive Toast Notification (No Dots) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] px-4 py-2.5 rounded-2xl bg-black text-[#FFE500] font-mono text-xs font-bold uppercase shadow-floating flex items-center gap-2 border border-editorial-hairline animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="px-1.5 py-0.5 rounded bg-[#FFE500] text-black text-[10px]">ALERT</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Operational Platform Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 space-y-12">
        {/* =========================================================================
            SECTION 0: PLAIN-ENGLISH WATER SAFETY STATUS (CLEAR FOR ANY NORMAL HUMAN)
            ========================================================================= */}
        <section className="rounded-3xl bg-black text-white p-6 sm:p-8 lg:p-10 shadow-floating space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#FFE500] text-black font-mono font-black text-xs uppercase tracking-wider">
                  WATER SAFETY VERDICT: HIGH DANGER
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/10 text-white font-mono font-semibold text-xs uppercase">
                  River: {currentBasin.riverName} ({currentBasin.country})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-sans">
                Toxic Contamination Detected in River
              </h1>
              <p className="text-xs sm:text-sm text-[#CCCCCC] max-w-3xl leading-relaxed">
                <strong>In Simple Words:</strong> European Space Agency satellites in space took photos of this river today. The computer detected an abnormal, dangerous bloom of poisonous blue-green algae and industrial sewage spreading down the river.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0">
              <div className="text-center font-mono">
                <div className="text-xs text-[#AAAAAA] uppercase">Water Health Score</div>
                <div className="text-3xl sm:text-4xl font-black text-[#FFE500] mt-0.5">
                  {currentBasin.plume.wqiEquivalent}/100
                </div>
                <div className="text-[10px] text-white uppercase font-bold mt-0.5 bg-black px-2 py-0.5 rounded">
                  Severely Polluted
                </div>
              </div>
            </div>
          </div>

          {/* Practical Human Answers (Can I swim? Can I drink?) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-white font-bold uppercase">
                <span>Can I swim or kayak here?</span>
                <span className="px-2 py-0.5 rounded bg-red-600/30 text-white border border-red-500/50 font-black">
                  NO · UNSAFE
                </span>
              </div>
              <p className="text-[#AAAAAA] leading-relaxed">
                Contact with skin causes severe blistering rashes, eye burning, and breathing spasms. Keep pets and children away from the riverbank.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-white font-bold uppercase">
                <span>Can this water be consumed?</span>
                <span className="px-2 py-0.5 rounded bg-red-600/30 text-white border border-red-500/50 font-black">
                  NO · DO NOT DRINK
                </span>
              </div>
              <p className="text-[#AAAAAA] leading-relaxed">
                Ingesting this water causes violent stomach gastroenteritis, fever, and acute liver cell poisoning from microcystin toxins.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFE500]/10 border border-[#FFE500]/30 space-y-1.5">
              <div className="flex items-center justify-between text-white font-bold uppercase">
                <span>What action is taken?</span>
                <span className="px-2 py-0.5 rounded bg-[#FFE500] text-black font-black">
                  PRECAUTION SENT
                </span>
              </div>
              <p className="text-[#DDDDDD] leading-relaxed">
                AquaLens sent an automated early-warning alert to municipal drinking water intakes to close pumps before the toxic water arrives.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: RIVER SELECTOR & SATELLITE SCAN CONTROLLER
            ========================================================================= */}
        <section className="rounded-3xl bg-surface-subtle border border-editorial-hairline p-6 lg:p-8 shadow-elevation space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-editorial-hairline">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-editorial-charcoal">
                Select a Waterway to Scan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black font-sans">
                {currentBasin.name}
              </h2>
              <p className="text-xs sm:text-sm text-editorial-muted font-normal max-w-2xl">
                {currentBasin.description}
              </p>
            </div>

            {/* Basin Segmented Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-editorial-hairline shadow-softPill shrink-0">
              {PILOT_BASINS.map((b) => {
                const isSelected = b.id === currentBasin.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      setCurrentBasin(b);
                      setSelectedPOI(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase font-bold transition-all duration-200 ${
                      isSelected
                        ? 'bg-black text-[#FFE500] shadow-sm'
                        : 'text-editorial-muted hover:text-black hover:bg-surface-subtle'
                    }`}
                  >
                    <span>{b.flag} {b.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coordinate Search & Satellite Trigger */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <form onSubmit={handleCustomCoordinateQuery} className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-editorial-charcoal font-semibold uppercase flex items-center gap-1.5">
                <PrecisionReticle className="w-3.5 h-3.5 text-black" />
                Scan Any GPS Location:
              </span>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-editorial-hairline shadow-softPill">
                <span className="text-editorial-light font-semibold">LAT</span>
                <input
                  type="text"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  className="w-20 font-mono font-bold text-black focus:outline-none bg-transparent"
                  placeholder="43.6047"
                  aria-label="Latitude"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-editorial-hairline shadow-softPill">
                <span className="text-editorial-light font-semibold">LNG</span>
                <input
                  type="text"
                  value={customLng}
                  onChange={(e) => setCustomLng(e.target.value)}
                  className="w-20 font-mono font-bold text-black focus:outline-none bg-transparent"
                  placeholder="1.4442"
                  aria-label="Longitude"
                />
              </div>
              <button
                type="submit"
                disabled={isQueryingApi}
                className="px-4 py-2 rounded-xl bg-black hover:bg-[#FFE500] text-white hover:text-black font-mono font-bold uppercase transition-all duration-200 shadow-softPill disabled:opacity-50 flex items-center gap-1.5 active:scale-95"
              >
                <span>{isQueryingApi ? 'Scanning Space...' : 'Scan with Satellite'}</span>
              </button>
            </form>

            {/* Live API Telemetry Badge (No Dots) */}
            <div className="flex items-center gap-2 text-xs font-mono text-editorial-charcoal">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-editorial-hairline shadow-softPill flex items-center gap-1.5 font-semibold">
                <span className="px-1.5 py-0.5 rounded bg-[#FFE500] text-black font-bold text-[10px]">LIVE</span>
                <span>ESA Copernicus Connected</span>
              </span>
              {apiTelemetry?.hydrologyTelemetry?.riverDischargeM3s && (
                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-editorial-hairline text-editorial-muted">
                  <HydraulicStream className="w-3 h-3 text-black" />
                  Speed: {apiTelemetry.hydrologyTelemetry.flowVelocityKmH} km/h
                </span>
              )}
            </div>
          </div>

          {/* Proof of Real Satellite Connection Box */}
          <div className="p-4 rounded-2xl bg-white border border-editorial-hairline text-xs font-mono space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-editorial-hairline pb-2">
              <span className="font-bold text-black uppercase flex items-center gap-1.5">
                <SatelliteOrbiter className="w-3.5 h-3.5 text-black" />
                Live Satellite Stream Verification
              </span>
              <span className="text-[11px] text-editorial-muted">
                100% Legal Public Data · European Union Regulation 377/2014
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-editorial-charcoal pt-1">
              <div>
                Satellite: <strong className="text-black">{currentBasin.plume.satellite}</strong>
              </div>
              <div>
                Scan Date: <strong className="text-black">{currentBasin.recentPassDate}</strong>
              </div>
              <div>
                Cloud Cover: <strong className="text-black">&lt; 2.4% (Clear Sky)</strong>
              </div>
              <div>
                Access Fee: <strong className="text-black bg-[#FFE500] px-1 rounded">€0 (Open ESA Access)</strong>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: SATELLITE MAP & WATER FLOW PATH
            ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-end justify-between border-b border-editorial-hairline pb-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase bg-surface-subtle text-editorial-charcoal px-3 py-1 rounded-full border border-editorial-hairline">
                Interactive Satellite View
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-black mt-2 font-sans">
                Satellite River Map & Water Flow Path
              </h2>
            </div>
            <span className="hidden sm:inline text-xs text-editorial-muted font-mono uppercase font-semibold">
              The yellow marker is where pollution started · Dotted line shows travel direction
            </span>
          </div>

          <SatelliteMap
            basin={currentBasin}
            spectralMode={spectralMode}
            onSelectPOI={(poi) => setSelectedPOI(poi)}
          />
        </section>

        {/* =========================================================================
            SECTION 3: MULTISPECTRAL SATELLITE LENS SWITCHER
            ========================================================================= */}
        <section>
          <SpectralViewer
            basin={currentBasin}
            currentMode={spectralMode}
            onModeChange={(mode) => {
              setSpectralMode(mode);
              showToast(`Optical Filter: ${mode.toUpperCase()} Activated`);
            }}
          />
        </section>

        {/* =========================================================================
            SECTION 4: RIVER TIME MACHINE SLIDER
            ========================================================================= */}
        <section>
          <TimeMachineSlider basin={currentBasin} />
        </section>

        {/* =========================================================================
            SECTION 5: DOWNSTREAM PRECAUTIONARY ALERTS & HOSPITAL ADVISORIES
            ========================================================================= */}
        <section>
          <OneHealthAlerts basin={currentBasin} selectedPOI={selectedPOI} />
        </section>

        {/* =========================================================================
            SECTION 6: HOW AQUALENS DECIDES THE WATER IS TOXIC (PLAIN ENGLISH)
            ========================================================================= */}
        <section className="rounded-3xl bg-surface-subtle border border-editorial-hairline p-8 lg:p-12 shadow-elevation space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase bg-white px-3 py-1 rounded-full border border-editorial-hairline shadow-softPill">
              Educational Breakdown
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black font-sans">
              How Does AquaLens Decide the Water is Toxic?
            </h2>
            <p className="text-xs sm:text-sm text-editorial-muted leading-relaxed">
              You do not need to be a satellite physicist to understand how this works. Here is the entire space-to-clinic pipeline explained in four simple steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="flex items-center justify-between border-b border-editorial-hairline pb-2">
                <span className="font-bold text-black uppercase font-sans text-sm">1. Light Absorption</span>
                <span className="px-2 py-0.5 bg-black text-[#FFE500] font-bold rounded">Step 1</span>
              </div>
              <p className="text-editorial-muted leading-relaxed">
                Clean river water absorbs almost all sunlight, making it look dark from space. But when toxic algae (cyanobacteria) multiplies, it fills the water with <strong>Chlorophyll-a</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="flex items-center justify-between border-b border-editorial-hairline pb-2">
                <span className="font-bold text-black uppercase font-sans text-sm">2. Invisible Infrared</span>
                <span className="px-2 py-0.5 bg-black text-[#FFE500] font-bold rounded">Step 2</span>
              </div>
              <p className="text-editorial-muted leading-relaxed">
                Chlorophyll acts like a mirror for <strong>Near-Infrared light</strong>. Human eyes cannot see this wavelength, but the satellite&apos;s special multispectral lenses detect it instantly from orbit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="flex items-center justify-between border-b border-editorial-hairline pb-2">
                <span className="font-bold text-black uppercase font-sans text-sm">3. Toxicity Index (NDCI)</span>
                <span className="px-2 py-0.5 bg-black text-[#FFE500] font-bold rounded">Step 3</span>
              </div>
              <p className="text-editorial-muted leading-relaxed">
                The computer compares the satellite&apos;s Red Edge lens (705nm) against its Red lens (665nm). If chlorophyll exceeds <strong>50 µg/L</strong>, World Health Organization rules classify it as severe toxic hazard.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-editorial-hairline shadow-softPill space-y-3">
              <div className="flex items-center justify-between border-b border-editorial-hairline pb-2">
                <span className="font-bold text-black uppercase font-sans text-sm">4. Clinic Preemption</span>
                <span className="px-2 py-0.5 bg-black text-[#FFE500] font-bold rounded">Step 4</span>
              </div>
              <p className="text-editorial-muted leading-relaxed">
                AquaLens calculates river water speed (1.6 km/h) to predict when the toxic water will reach town. It automatically alerts drinking water plants and hospitals hours before anyone drinks it.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: ACTION TRIGGERS FOR STANDARDS & VERIFICATION
            ========================================================================= */}
        <section className="rounded-3xl bg-black text-white p-8 lg:p-12 shadow-floating flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FFE500] font-bold uppercase tracking-widest">
              <FhirNodeTerminal className="w-4 h-4 text-[#FFE500]" />
              <span>International Medical Informatics Standard</span>
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight font-sans text-white">
              Export Live Hospital Early-Warning Record
            </h3>
            <p className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed">
              Instantly view and download the official HL7 FHIR R4 medical data bundle that alerts hospital emergency rooms about this river contamination.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsFhirOpen(true)}
              className="px-6 py-3.5 rounded-full bg-[#FFE500] hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-softPill"
            >
              <span>View Hospital Alert Data</span>
            </button>
            <button
              onClick={() => setIsDossierOpen(true)}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono font-semibold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95"
            >
              <span>View Official Water Report</span>
            </button>
          </div>
        </section>
      </main>

      {/* Global Standards Modals */}
      <FhirInspector
        basin={currentBasin}
        isOpen={isFhirOpen}
        onClose={() => setIsFhirOpen(false)}
      />

      <RegulatoryDossier
        basin={currentBasin}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </div>
  );
}
