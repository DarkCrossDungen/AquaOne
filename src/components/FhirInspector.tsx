'use client';

import React, { useState } from 'react';
import { PilotBasin } from '@/lib/types';
import { generateFhirBundle } from '@/lib/fhirGenerator';
import { FhirNodeTerminal } from '@/components/icons/CustomIcons';

interface FhirInspectorProps {
  basin: PilotBasin;
  isOpen: boolean;
  onClose: () => void;
}

export const FhirInspector: React.FC<FhirInspectorProps> = ({ basin, isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const fhirBundle = generateFhirBundle(basin);
  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FHIR-R4-Aqualens-${basin.id}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-white border border-editorial-hairline rounded-3xl shadow-floating flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-editorial-hairline bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-[#FFE500]">
              <FhirNodeTerminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold uppercase tracking-tight text-black font-sans">
                  HL7 FHIR R4 Bundle Inspector
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black text-[#FFE500] font-bold">
                  IEEE EMBS · EFMI
                </span>
              </div>
              <p className="text-xs text-editorial-muted font-mono mt-0.5">
                Target: {basin.riverName} ({basin.country}) · Resource: Bundle (Collection)
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
          <strong>What is this?</strong> Standardized hospital emergency records (HL7 FHIR format). When a toxic river plume is detected, this data is transmitted straight into hospital triage software so doctors are notified hours before poisoned patients arrive.
        </div>

        {/* Clinical Terminology Strip */}
        <div className="px-6 py-3 bg-white border-b border-editorial-hairline flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-editorial-charcoal font-semibold uppercase">
            <span>Clinical Terminology Mapped:</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="bg-surface-subtle px-2.5 py-1 rounded-md border border-editorial-hairline text-black font-semibold">
              LOINC: 79177-2 (Microcystin)
            </span>
            <span className="bg-surface-subtle px-2.5 py-1 rounded-md border border-editorial-hairline text-black font-semibold">
              LOINC: 48421-2 (Turbidity)
            </span>
            <span className="bg-black text-[#FFE500] px-2.5 py-1 rounded-md font-bold">
              ICD-10: T65.8 & A08.4
            </span>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface-subtle font-mono text-xs text-black leading-relaxed">
          <pre className="p-4 bg-white border border-editorial-hairline rounded-2xl overflow-x-auto text-[11px] shadow-sm">
            <code>{jsonString}</code>
          </pre>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-editorial-hairline bg-white">
          <span className="text-xs text-editorial-muted font-mono font-semibold uppercase">
            {fhirBundle.entry.length} Resources Serialized
          </span>

          <div className="flex items-center gap-3 font-mono">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-full bg-surface-subtle hover:bg-black text-black hover:text-[#FFE500] text-xs font-semibold uppercase border border-editorial-hairline transition-all active:scale-95 shadow-softPill"
            >
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-full bg-[#FFE500] hover:bg-black text-black hover:text-[#FFE500] text-xs font-bold uppercase transition-all active:scale-95 shadow-softPill"
            >
              <span>Download Bundle (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
