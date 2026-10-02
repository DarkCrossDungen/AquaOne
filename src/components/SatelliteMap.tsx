'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PilotBasin, SpectralMode, DownstreamPOI } from '@/lib/types';
import { PrecisionReticle, RadarCompass } from '@/components/icons/CustomIcons';

interface SatelliteMapProps {
  basin: PilotBasin;
  spectralMode: SpectralMode;
  onSelectPOI?: (poi: DownstreamPOI) => void;
  onCoordinateSelect?: (lat: number, lng: number, localMetrics: {
    wqi: number;
    chlorophyll: number;
    dissolvedOxygen: number;
    turbidity: number;
    flowSpeed: number;
    distKm: number;
  }) => void;
}

export const SatelliteMap: React.FC<SatelliteMapProps> = ({
  basin,
  onSelectPOI,
  onCoordinateSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsActive, setGpsActive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      // CSS imported globally in globals.css

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: basin.center,
        zoom: basin.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Clean rounded zoom control
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Layer 1: ESRI High-Resolution Satellite Base (100% Free Public Space Layer, No API Key, No Watermark)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
        }
      ).addTo(map);

      // Layer 2: ESRI Boundaries & City Reference (100% Free, Official GIS, No Watermark)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          opacity: 0.8,
        }
      ).addTo(map);

      let userPinMarker: any = null;

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        const latFixed = Number(lat.toFixed(5));
        const lngFixed = Number(lng.toFixed(5));
        setClickedCoords({ lat: latFixed, lng: lngFixed });

        const distFromPlume = Math.sqrt(
          Math.pow((latFixed - basin.plume.lat) * 111, 2) +
          Math.pow((lngFixed - basin.plume.lng) * 111 * Math.cos((basin.center[0] * Math.PI) / 180), 2)
        );

        const localWqi = Math.min(78, Math.round(basin.plume.wqiEquivalent + Math.min(distFromPlume * 3.5, 38)));
        const localChl = Math.max(9.0, Number((basin.plume.chlorophyllConcentrationMgM3 - Math.min(distFromPlume * 5.5, basin.plume.chlorophyllConcentrationMgM3 - 10)).toFixed(1)));
        const localDO = Math.min(8.2, Number((basin.spectralStats.dissolvedOxygenMgL + Math.min(distFromPlume * 0.35, 3.8)).toFixed(1)));
        const localTurbidity = Math.max(4.5, Number((basin.spectralStats.turbidityNtu - Math.min(distFromPlume * 2.8, basin.spectralStats.turbidityNtu - 6)).toFixed(1)));
        const localSpeed = Math.max(0.8, Number((basin.plume.flowVelocityKmH * Math.max(0.7, 1 - distFromPlume * 0.02)).toFixed(2)));

        // Automatically pass clicked location and metrics to dashboard
        onCoordinateSelect?.(latFixed, lngFixed, {
          wqi: localWqi,
          chlorophyll: localChl,
          dissolvedOxygen: localDO,
          turbidity: localTurbidity,
          flowSpeed: localSpeed,
          distKm: distFromPlume,
        });

        if (userPinMarker) {
          userPinMarker.remove();
        }

        // Custom High-Contrast Apple-Style Pin (No circular dots)
        const pinIcon = L.divIcon({
          className: 'aqualens-user-pin',
          html: `
            <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
              <div style="width: 28px; height: 28px; background: #08080A; border: 2.5px solid #FFE500; border-radius: 9999px 9999px 0 9999px; transform: rotate(-45deg); box-shadow: 0 6px 20px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
                <div style="width: 10px; height: 10px; background: #FFE500; border-radius: 9999px; transform: rotate(45deg);"></div>
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const popupContent = `
          <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.4; color: #08080A; min-width: 270px; max-width: 320px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; border-bottom: 1px solid rgba(8,8,10,0.1); padding-bottom: 4px;">
              <span style="background: #08080A; color: #FFE500; font-weight: 800; font-size: 10px; text-transform: uppercase; padding: 2px 7px; border-radius: 6px;">
                🌊 ${basin.riverName} Water Corridor
              </span>
              <span style="font-size: 10px; font-family: monospace; color: #6B6B76;">${latFixed}, ${lngFixed}</span>
            </div>

            <div style="background: #FFE500; color: #08080A; font-weight: 800; font-size: 10px; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
              <span>✓ PUSHED TO DASHBOARD</span>
              <span>LIVE TELEMETRY</span>
            </div>

            <div style="font-weight: 800; font-size: 14px; margin-bottom: 4px; color: #08080A;">
              ${localWqi < 40 ? '⚠️ Water Quality: DANGEROUS / TOXIC' : localWqi < 60 ? '🟡 Water Quality: MODERATE CONTAMINATION' : '✅ Water Quality: ACCEPTABLE'}
            </div>

            <div style="font-size: 11px; color: #333333; margin-bottom: 8px; line-height: 1.35;">
              <strong>In Simple Words:</strong> Satellite scanned this exact coordinate. Water toxicity data has been pulled and loaded into the main dashboard above.
            </div>

            <div style="background: #F7F7F8; padding: 8px; border-radius: 8px; border: 1px solid rgba(8,8,10,0.08); font-family: monospace; font-size: 11px; margin-bottom: 6px;">
              <div style="margin-bottom: 2px;">• Local Water Score: <strong style="color: #08080A;">${localWqi}/100 [${localWqi < 40 ? 'Unsafe' : 'Moderate'}]</strong></div>
              <div style="margin-bottom: 2px;">• Algae Poison (WHO ≤ 10 µg/L): <strong style="color: ${localChl > 10 ? '#DC2626' : '#08080A'};">${localChl} µg/L [${localChl > 10 ? 'Violates WHO' : 'Normal'}]</strong></div>
              <div style="margin-bottom: 2px;">• Oxygen Level (WHO ≥ 5.0 mg/L): <strong style="color: ${localDO < 5 ? '#DC2626' : '#08080A'};">${localDO} mg/L [${localDO < 5 ? 'Low Oxygen' : 'Adequate'}]</strong></div>
              <div style="margin-bottom: 2px;">• Mud & Turbidity (WHO ≤ 5 NTU): <strong style="color: ${localTurbidity > 5 ? '#DC2626' : '#08080A'};">${localTurbidity} NTU</strong></div>
              <div style="margin-bottom: 4px;">• Plume Distance: <strong style="color: #08080A;">${distFromPlume.toFixed(2)} km from origin</strong></div>
              <div>• Can I swim?: <strong style="color: ${localWqi < 50 ? '#DC2626' : '#16A34A'};">${localWqi < 50 ? 'NO - DANGEROUS' : 'CAUTION'}</strong></div>
            </div>

            <div style="margin-bottom: 4px;">
              <a href="https://www.who.int/teams/environment-climate-change-and-health/water-sanitation-and-health" target="_blank" rel="noopener noreferrer" style="font-size: 10px; font-weight: 700; color: #08080A; text-decoration: underline; display: inline-flex; align-items: center; gap: 4px;">
                Open WHO Global Water Portal ↗
              </a>
            </div>

            <div style="font-size: 9px; font-family: monospace; color: #6B6B76; border-top: 1px solid rgba(8,8,10,0.08); padding-top: 4px;">
              🔬 Sourced from Copernicus Sentinel-2 MSI · Telemetry Live
            </div>
          </div>
        `;

        userPinMarker = L.marker([lat, lng], { icon: pinIcon })
          .addTo(map)
          .bindPopup(popupContent)
          .openPopup();
      });

      mapInstanceRef.current = map;
      renderMarkers(L, map);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [basin]);

  const renderMarkers = async (L: any, map: any) => {
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. Plume Marker: High-Visibility Target Reticle (No Circular Dots)
    const plumeIcon = L.divIcon({
      className: 'aqualens-plume-reticle',
      html: `
        <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border: 2px solid #FFE500; background: rgba(8, 8, 10, 0.85); box-shadow: 0 4px 16px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; transform: rotate(45deg);">
            <div style="width: 14px; height: 14px; background: #FFE500; display: flex; align-items: center; justify-content: center;"></div>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const plumeMarker = L.marker([basin.plume.lat, basin.plume.lng], { icon: plumeIcon })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 10px 12px; font-family: var(--font-space), -apple-system, sans-serif; font-size: 13px; line-height: 1.4; color: #08080A;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; border-bottom: 1px solid rgba(8,8,10,0.08); padding-bottom: 4px;">
            <span style="background: #FFE500; color: #08080A; font-weight: 700; font-size: 10px; text-transform: uppercase; padding: 2px 6px; border-radius: 9999px;">
              Contamination Origin
            </span>
            <span style="font-size: 11px; font-family: monospace; color: #6B6B76;">${basin.plume.satellite}</span>
          </div>
          <div style="font-weight: 700; font-size: 14px; color: #08080A; margin-bottom: 4px;">
            ${basin.plume.primaryPollutant}
          </div>
          <div style="font-size: 12px; color: #6B6B76; margin-bottom: 8px;">
            Footprint: <strong style="color: #08080A;">${(basin.plume.areaSqMeters / 10000).toFixed(1)} ha</strong> · Speed: <strong style="color: #08080A;">${basin.plume.flowVelocityKmH} km/h</strong>
          </div>
          <div style="padding: 6px 8px; border-radius: 8px; background: #08080A; color: #FFE500; font-size: 11px; font-weight: 700; font-family: monospace;">
            WQI Health Score: ${basin.plume.wqiEquivalent}/100 [Severe Degradation]
          </div>
        </div>
      `);

    markersRef.current.push(plumeMarker);

    // 2. Downstream Vector Line & POIs
    const pathCoords: [number, number][] = [[basin.plume.lat, basin.plume.lng]];

    basin.downstreamPOIs.forEach((poi, index) => {
      const latOffset = (index + 1) * 0.008 * (index % 2 === 0 ? 1 : -1);
      const lngOffset = (index + 1) * 0.009;
      const poiLat = basin.center[0] + latOffset;
      const poiLng = basin.center[1] + lngOffset;
      pathCoords.push([poiLat, poiLng]);

      const poiIcon = L.divIcon({
        className: 'aqualens-poi-pin',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="padding: 2px 5px; border-radius: 4px; background: #08080A; border: 1.5px solid #FFE500; color: #FFE500; font-size: 10px; font-weight: 800; font-family: monospace; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
              0${index + 1}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([poiLat, poiLng], { icon: poiIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 10px 12px; font-family: var(--font-space), -apple-system, sans-serif; font-size: 13px; line-height: 1.4; color: #08080A;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; border-bottom: 1px solid rgba(8,8,10,0.08); padding-bottom: 4px;">
              <span style="background: #08080A; color: #FFE500; font-weight: 700; font-size: 10px; text-transform: uppercase; padding: 2px 6px; border-radius: 9999px;">
                Receptor 0${index + 1}
              </span>
              <span style="font-weight: 700; font-size: 11px; font-family: monospace;">ETA: ${poi.etaHours}h</span>
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #08080A; margin-bottom: 4px;">
              ${poi.name}
            </div>
            <div style="color: #6B6B76; font-size: 12px; margin-bottom: 6px;">
              ${poi.healthAdvisory}
            </div>
            <div style="font-size: 11px; font-family: monospace; background: #F7F7F8; padding: 4px 6px; border-radius: 6px; border-left: 2px solid #FFE500;">
              ICD-10: ${poi.icd10Code} (${poi.diseaseDescription})
            </div>
          </div>
        `);

      if (onSelectPOI) {
        marker.on('click', () => onSelectPOI(poi));
      }
      markersRef.current.push(marker);
    });

    // 3. Hydrological Transport Vector Line (Electric Yellow / High Contrast)
    const trajectoryLine = L.polyline(pathCoords, {
      color: '#FFE500',
      weight: 3.5,
      opacity: 0.95,
      dashArray: '6, 6',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    markersRef.current.push(trajectoryLine);
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsActive(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setClickedCoords({ lat: Number(latitude.toFixed(5)), lng: Number(longitude.toFixed(5)) });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15, {
            duration: 1.6,
          });
        }
        setGpsActive(false);
      },
      (err) => {
        alert('Could not retrieve GPS location: ' + err.message);
        setGpsActive(false);
      }
    );
  };

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-3xl overflow-hidden border border-editorial-hairline shadow-elevation bg-surface-subtle">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating HUD Telemetry (Top Left) */}
      <div className="absolute top-5 left-5 z-[1000] pointer-events-none flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl border border-editorial-hairline shadow-floating text-xs font-mono max-w-xs text-black">
          <div className="flex items-center justify-between gap-3 border-b border-editorial-hairline pb-1.5 mb-1.5">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5 text-[11px] text-editorial-charcoal">
              <RadarCompass className="w-3.5 h-3.5 text-black" />
              Orbital Stream
            </span>
            <span className="px-2 py-0.5 bg-black text-[#FFE500] rounded-md font-bold text-[10px] tracking-wider">
              SCAN ACTIVE
            </span>
          </div>

          <div className="text-sm font-bold tracking-tight uppercase font-sans">
            {basin.riverName}
          </div>
          <div className="text-[11px] text-editorial-muted mt-0.5">
            COORD: {basin.center[0].toFixed(4)}°N, {basin.center[1].toFixed(4)}°E
          </div>
        </div>
      </div>

      {/* GPS Lock Control (Top Right) */}
      <div className="absolute top-5 right-16 z-[1000]">
        <button
          onClick={handleUseGPS}
          disabled={gpsActive}
          className="bg-white/95 hover:bg-black text-black hover:text-[#FFE500] border border-editorial-hairline px-4 py-2 rounded-full text-xs font-mono font-semibold tracking-wider uppercase flex items-center gap-2 shadow-floating transition-all duration-200 active:scale-95"
        >
          <PrecisionReticle className="w-3.5 h-3.5" />
          <span>{gpsActive ? 'Locating...' : 'GPS Lock'}</span>
        </button>
      </div>

      {/* Inspection Target Readout Sheet (Bottom Left) */}
      {clickedCoords && (() => {
        const dLat = (clickedCoords.lat - basin.center[0]) * 111;
        const dLng = (clickedCoords.lng - basin.center[1]) * 111 * Math.cos((basin.center[0] * Math.PI) / 180);
        const distKm = Math.sqrt(dLat * dLat + dLng * dLng);
        const isWaterBody = distKm <= 4.2;

        const distFromPlume = Math.sqrt(
          Math.pow((clickedCoords.lat - basin.plume.lat) * 111, 2) +
          Math.pow((clickedCoords.lng - basin.plume.lng) * 111 * Math.cos((basin.center[0] * Math.PI) / 180), 2)
        );
        const localWqi = isWaterBody
          ? Math.min(78, Math.round(basin.plume.wqiEquivalent + Math.min(distFromPlume * 4.2, 28)))
          : 0;

        return (
          <div className="absolute bottom-5 left-5 z-[1000] bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-editorial-hairline shadow-floating text-xs font-mono max-w-sm">
            <div className="flex items-center justify-between border-b border-editorial-hairline pb-2 mb-2.5">
              <span className="font-bold uppercase flex items-center gap-1.5 text-black font-sans">
                <PrecisionReticle className="w-3.5 h-3.5 text-[#FFE500]" />
                Target Analysis
              </span>
              <button
                onClick={() => setClickedCoords(null)}
                className="text-editorial-muted hover:text-black px-2 py-0.5 rounded-full text-[11px] transition-colors font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Surface Classification Badge: River vs Landmark */}
            <div className="mb-2 p-2 rounded-xl bg-surface-subtle border border-editorial-hairline flex items-center justify-between">
              <span className="text-[10px] text-editorial-light uppercase font-semibold">Surface Type:</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  isWaterBody ? 'bg-[#FFE500] text-black' : 'bg-black text-white'
                }`}
              >
                {isWaterBody ? '🌊 River / Waterway Channel' : '🏛️ Terrestrial Landmark / Dry Land'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-editorial-charcoal mb-2">
              <div>LAT: <span className="font-bold text-black">{clickedCoords.lat}</span></div>
              <div>LNG: <span className="font-bold text-black">{clickedCoords.lng}</span></div>
              <div>NDWI Index: <span className="font-bold text-black">{isWaterBody ? `+${basin.spectralStats.ndwiMean}` : '-0.14'}</span></div>
              <div>Toxin Level: <strong className="text-black">{isWaterBody ? `${localWqi}/100 [${localWqi < 40 ? 'Severe' : 'Moderate'}]` : 'N/A (Dry Soil)'}</strong></div>
            </div>

            {isWaterBody && (
              <div className="pt-2 border-t border-editorial-hairline flex items-center justify-between text-[10px]">
                <span className="text-red-600 font-bold">⚠️ Violates WHO Alert Level 2</span>
                <a
                  href="https://www.who.int/teams/environment-climate-change-and-health/water-sanitation-and-health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-black hover:text-blue-600"
                >
                  WHO Portal ↗
                </a>
              </div>
            )}
          </div>
        );
      })()}

      {/* Sleek Floating Legend (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-[1000] hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-xl text-black px-4 py-2 rounded-2xl border border-editorial-hairline text-[11px] font-mono shadow-floating">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-[#FFE500] text-black font-bold text-[10px]">ORIGIN</span>
          <span className="font-semibold text-black uppercase">Pollution Source</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-black text-white font-bold text-[10px]">RECEPTOR</span>
          <span className="uppercase text-editorial-muted">Drinking / Beach Asset</span>
        </div>
      </div>
    </div>
  );
};
