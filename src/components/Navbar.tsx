'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PilotBasin } from '@/lib/types';
import { SatelliteOrbiter, FhirNodeTerminal, RegulatorySeal } from '@/components/icons/CustomIcons';

interface NavbarProps {
  currentBasin?: PilotBasin;
  onSelectBasin?: (basin: PilotBasin) => void;
  onOpenFhir?: () => void;
  onOpenDossier?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenFhir,
  onOpenDossier,
}) => {
  const pathname = usePathname();

  const NAV_LINKS = [
    { href: '/', label: 'Overview' },
    { href: '/sentinel', label: 'Live Monitor' },
    { href: '/impact', label: 'Health Impact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-3">
      {/* Floating Precision Glass Capsule */}
      <div className="max-w-7xl mx-auto rounded-full bg-white/95 backdrop-blur-2xl border border-editorial-hairline shadow-elevation px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 transition-all">
        {/* Brand & Orbital Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-[#FFE500] shadow-sm group-hover:scale-105 transition-transform">
            <SatelliteOrbiter className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-black uppercase font-sans">
              AquaLens
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-surface-subtle text-editorial-charcoal border border-editorial-hairline font-semibold">
              ESA Sentinel-2 Space Data
            </span>
          </div>
        </Link>

        {/* Multi-Page Navigation Route Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-subtle p-1 rounded-full border border-editorial-hairline">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 text-xs font-mono rounded-full transition-all duration-200 uppercase font-semibold ${
                  isActive
                    ? 'bg-black text-[#FFE500] shadow-sm'
                    : 'text-editorial-muted hover:text-black'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Global Action Modals: Strict Triad (Black / White / Yellow) */}
        <div className="flex items-center gap-2">
          {/* Clinical Health Data Trigger */}
          {onOpenFhir && (
            <button
              onClick={onOpenFhir}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-subtle hover:bg-black text-black hover:text-[#FFE500] border border-editorial-hairline text-xs font-mono font-semibold uppercase transition-all duration-200 active:scale-95 shadow-softPill"
              title="Clinical Health Observation Data (HL7 FHIR R4 Standard)"
            >
              <FhirNodeTerminal className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Clinical FHIR</span>
              <span className="lg:hidden">FHIR Data</span>
            </button>
          )}

          {/* Official Water Inspection Report Trigger */}
          {onOpenDossier && (
            <button
              onClick={onOpenDossier}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFE500] hover:bg-black text-black hover:text-[#FFE500] text-xs font-mono font-bold uppercase transition-all duration-200 active:scale-95 shadow-softPill"
              title="Official Legal Water Quality Report (EU Directive 2000/60/EC)"
            >
              <RegulatorySeal className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Official Water Report</span>
              <span className="lg:hidden">Water Report</span>
            </button>
          )}

          {/* Live Platform Quick CTA if on another page */}
          {pathname !== '/sentinel' && (
            <Link
              href="/sentinel"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black text-[#FFE500] hover:bg-black/90 text-xs font-mono font-bold uppercase transition-all duration-200 active:scale-95 shadow-softPill"
            >
              <span>Launch App</span>
              <span className="text-[10px]">→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Page Navigation Bar */}
      <div className="flex md:hidden items-center justify-center gap-1.5 overflow-x-auto pt-2.5 pb-1 no-scrollbar">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 text-[11px] font-mono rounded-full whitespace-nowrap uppercase font-semibold transition-all ${
                isActive
                  ? 'bg-black text-[#FFE500] shadow-sm'
                  : 'bg-white text-editorial-muted border border-editorial-hairline'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
};
