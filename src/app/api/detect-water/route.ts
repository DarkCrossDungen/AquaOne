import { NextResponse } from 'next/server';
import { PILOT_BASINS } from '@/lib/pilotBasins';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const basinId = searchParams.get('basinId');

  if (!latStr || !lngStr) {
    return NextResponse.json({ isWater: false, waterBodyName: null, waterType: null, source: 'error' });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ isWater: false, waterBodyName: null, waterType: null, source: 'invalid_coords' });
  }

  // =========================================================================
  // METHOD 1: OpenStreetMap Overpass API (High-precision waterway/river/stream search)
  // Searching around 400m to catch small rivers, streams, canals, and riverbanks
  // =========================================================================
  try {
    const query = `[out:json][timeout:6];(
      way["waterway"](around:400,${lat},${lng});
      way["natural"="water"](around:400,${lat},${lng});
      way["water"](around:400,${lat},${lng});
      way["natural"="coastline"](around:600,${lat},${lng});
      way["natural"="bay"](around:600,${lat},${lng});
      way["natural"="wetland"](around:400,${lat},${lng});
      way["landuse"="reservoir"](around:400,${lat},${lng});
      way["landuse"="basin"](around:400,${lat},${lng});
      relation["waterway"](around:400,${lat},${lng});
      relation["natural"="water"](around:400,${lat},${lng});
      relation["place"="sea"](around:800,${lat},${lng});
      relation["place"="ocean"](around:800,${lat},${lng});
    );out tags 4;`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'AquaLens-Sentinel/1.0 (water-detect; contact@aqualens.org)'
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const elements = data.elements || [];
      if (elements.length > 0) {
        // Find best name from tags
        let chosenName = null;
        let chosenType = 'river';

        for (const el of elements) {
          const tags = el.tags || {};
          const n = tags.name || tags['name:en'] || tags['name:fr'] || tags['name:es'] || tags['name:oc'];
          if (n && !chosenName) {
            chosenName = n;
          }
          if (tags.waterway) chosenType = tags.waterway;
          else if (tags.natural) chosenType = tags.natural;
          else if (tags.water) chosenType = tags.water;
        }

        return NextResponse.json({
          isWater: true,
          waterBodyName: chosenName || `River / ${chosenType}`,
          waterType: chosenType,
          source: 'OpenStreetMap Overpass API',
        });
      }
    }
  } catch (err) {
    console.warn('Overpass API check note:', err instanceof Error ? err.message : 'timeout');
  }

  // =========================================================================
  // METHOD 2: Open-Meteo Global River Discharge & Hydrology Catchment
  // Checks if this location has an active river discharge (> 0 m³/s)
  // =========================================================================
  try {
    const hydroController = new AbortController();
    const hydroTimeout = setTimeout(() => hydroController.abort(), 2500);

    const hydroUrl = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&daily=river_discharge&forecast_days=1`;
    const hydroRes = await fetch(hydroUrl, { signal: hydroController.signal });
    clearTimeout(hydroTimeout);

    if (hydroRes.ok) {
      const hydroJson = await hydroRes.json();
      const discharge = hydroJson.daily?.river_discharge?.[0];

      // If positive discharge exists and matches catchment
      if (typeof discharge === 'number' && discharge > 0.05) {
        // Check if there is an active river in current basin
        const basin = PILOT_BASINS.find((b) => b.id === basinId) || PILOT_BASINS[0];
        const distKm = Math.sqrt(
          Math.pow((lat - basin.center[0]) * 111, 2) +
          Math.pow((lng - basin.center[1]) * 111 * Math.cos((basin.center[0] * Math.PI) / 180), 2)
        );

        if (distKm <= 35) {
          return NextResponse.json({
            isWater: true,
            waterBodyName: `${basin.riverName} Tributary / Corridor`,
            waterType: 'river_tributary',
            source: 'Open-Meteo Hydrology Network',
          });
        }
      }
    }
  } catch (err) {
    console.warn('Open-Meteo fallback note:', err instanceof Error ? err.message : 'timeout');
  }

  // =========================================================================
  // METHOD 3: Check Regional Proximity to Basin Pilot Waterways
  // If the user is inspecting within 5km of the active river corridor
  // =========================================================================
  for (const b of PILOT_BASINS) {
    const dCenter = Math.sqrt(
      Math.pow((lat - b.center[0]) * 111, 2) +
      Math.pow((lng - b.center[1]) * 111 * Math.cos((b.center[0] * Math.PI) / 180), 2)
    );
    const dPlume = Math.sqrt(
      Math.pow((lat - b.plume.lat) * 111, 2) +
      Math.pow((lng - b.plume.lng) * 111 * Math.cos((b.center[0] * Math.PI) / 180), 2)
    );

    // If within 4.5km of river center or plume origin
    if (dCenter <= 4.5 || dPlume <= 4.5) {
      return NextResponse.json({
        isWater: true,
        waterBodyName: b.riverName,
        waterType: 'river_basin',
        source: 'Regional River Basin Registry',
      });
    }
  }

  // =========================================================================
  // METHOD 4: Nominatim Reverse Geocoding (Detects oceans, bays, beaches)
  // =========================================================================
  try {
    const nomController = new AbortController();
    const nomTimeout = setTimeout(() => nomController.abort(), 2500);

    const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14`;
    const nomRes = await fetch(nomUrl, {
      signal: nomController.signal,
      headers: { 'User-Agent': 'AquaLens-Sentinel/1.0 (IEEE-Hackathon; contact@aqualens.org)' }
    });
    clearTimeout(nomTimeout);

    if (nomRes.ok) {
      const data = await nomRes.json();
      if (data.error === 'Unable to geocode') {
        return NextResponse.json({
          isWater: true,
          waterBodyName: 'Open Ocean / Sea',
          waterType: 'ocean',
          source: 'Ocean Geo-Inference',
        });
      }

      const category = (data.category || '').toLowerCase();
      const type = (data.type || '').toLowerCase();
      const displayName = (data.display_name || '').toLowerCase();

      const waterTypes = [
        'water', 'river', 'lake', 'stream', 'canal', 'reservoir', 'pond',
        'sea', 'ocean', 'wetland', 'riverbank', 'drain', 'ditch', 'dock',
        'basin', 'bay', 'strait', 'coastline', 'beach', 'harbour', 'marina',
      ];

      const waterKeywords = [
        'river', 'lake', 'ocean', 'sea', 'canal', 'bay', 'strait',
        'creek', 'stream', 'harbour', 'harbor', 'port', 'marina',
        'lagoon', 'estuary', 'delta', 'reservoir', 'pond', 'waterway',
        'atlantic', 'pacific', 'indian', 'mediterranean', 'gulf',
      ];

      if (
        waterTypes.includes(type) ||
        waterTypes.includes(category) ||
        waterKeywords.some(kw => displayName.includes(kw))
      ) {
        return NextResponse.json({
          isWater: true,
          waterBodyName: data.name || data.display_name?.split(',')[0] || 'Waterway',
          waterType: type || category || 'water',
          source: 'Nominatim Geo-Registry',
        });
      }
    }
  } catch (err) {
    console.warn('Nominatim note:', err instanceof Error ? err.message : 'timeout');
  }

  // Not detected on water
  return NextResponse.json({
    isWater: false,
    waterBodyName: null,
    waterType: null,
    source: 'terrestrial_surface',
  });
}
