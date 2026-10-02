import { NextResponse } from 'next/server';
import sharp from 'sharp';

function latLngToTilePixel(lat: number, lng: number, zoom = 16) {
  const n = Math.pow(2, zoom);
  const xExact = ((lng + 180) / 360) * n;
  const rad = (lat * Math.PI) / 180;
  const yExact = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;

  const tileX = Math.floor(xExact);
  const tileY = Math.floor(yExact);
  const pixelX = Math.floor((xExact - tileX) * 256);
  const pixelY = Math.floor((yExact - tileY) * 256);

  return { tileX, tileY, pixelX, pixelY };
}

async function inspectSatellitePixel(lat: number, lng: number) {
  try {
    const { tileX, tileY, pixelX, pixelY } = latLngToTilePixel(lat, lng, 16);
    const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/${tileY}/${tileX}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });

    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const px = Math.max(0, Math.min(255, pixelX + dx));
        const py = Math.max(0, Math.min(255, pixelY + dy));
        const idx = (py * info.width + px) * info.channels;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
        count++;
      }
    }

    const r = rSum / count;
    const g = gSum / count;
    const b = bSum / count;
    const brightness = (r + g + b) / 3;
    const grwi = (g - r) / (g + r + 0.001);

    return { r, g, b, brightness, grwi };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');

  if (!latStr || !lngStr) {
    return NextResponse.json({ isWater: false, waterBodyName: null, waterType: null, source: 'error' });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ isWater: false, waterBodyName: null, waterType: null, source: 'invalid_coords' });
  }

  // =========================================================================
  // STEP 1: Satellite Optical Pixel Inspection (ESRI World Imagery Ground Truth)
  // Samples the true optical reflectance of the exact coordinate.
  // =========================================================================
  const opt = await inspectSatellitePixel(lat, lng);

  // If the optical sample shows dry terrain (high brightness, soil/rock red, negative water index)
  // it is DEFINITIVELY LAND — rocks, trees, roads, fields, or buildings.
  if (opt) {
    const isObviousLand = (opt.grwi < -0.03 && opt.brightness > 115) || opt.brightness > 165;
    if (isObviousLand) {
      return NextResponse.json({
        isWater: false,
        waterBodyName: null,
        waterType: null,
        opticalReflectance: opt,
        source: 'satellite_optical_spectral_ground_truth',
      });
    }
  }

  // =========================================================================
  // STEP 2: OpenStreetMap Overpass Micro-Search (Tight 60m radius)
  // Only triggers if immediately on or within 60m of a cataloged waterway.
  // =========================================================================
  try {
    const query = `[out:json][timeout:3];(
      way["waterway"](around:60,${lat},${lng});
      way["natural"="water"](around:60,${lat},${lng});
      relation["waterway"](around:60,${lat},${lng});
      relation["natural"="water"](around:60,${lat},${lng});
    );out tags 2;`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

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
        let chosenName = null;
        let chosenType = 'river';

        for (const el of elements) {
          const tags = el.tags || {};
          const n = tags.name || tags['name:en'] || tags['name:fr'] || tags['name:es'];
          if (n && !chosenName) {
            chosenName = n;
          }
          if (tags.waterway) chosenType = tags.waterway;
          else if (tags.natural) chosenType = tags.natural;
        }

        return NextResponse.json({
          isWater: true,
          waterBodyName: chosenName || `River Channel (${chosenType})`,
          waterType: chosenType,
          source: 'OpenStreetMap Overpass',
        });
      }
    }
  } catch (err) {
    console.warn('Overpass micro-search note:', err instanceof Error ? err.message : 'timeout');
  }

  // =========================================================================
  // STEP 3: Ocean / Coastal Geocode Check
  // Off-shore oceanic coordinates return 'Unable to geocode' in Nominatim.
  // =========================================================================
  try {
    const nomController = new AbortController();
    const nomTimeout = setTimeout(() => nomController.abort(), 2000);

    const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14`;
    const nomRes = await fetch(nomUrl, {
      signal: nomController.signal,
      headers: { 'User-Agent': 'AquaLens-Sentinel/1.0 (water-detect; contact@aqualens.org)' }
    });
    clearTimeout(nomTimeout);

    if (nomRes.ok) {
      const data = await nomRes.json();
      if (data.error === 'Unable to geocode') {
        return NextResponse.json({
          isWater: true,
          waterBodyName: 'Open Ocean / Coastal Sea',
          waterType: 'ocean',
          source: 'Ocean Geo-Inference',
        });
      }

      const category = (data.category || data.class || '').toLowerCase();
      const type = (data.type || '').toLowerCase();

      // If Nominatim explicitly identifies a waterway polygon
      if (['waterway', 'natural'].includes(category) && ['water', 'river', 'lake', 'stream', 'canal', 'bay', 'ocean', 'sea'].includes(type)) {
        return NextResponse.json({
          isWater: true,
          waterBodyName: data.name || data.display_name?.split(',')[0] || 'Waterway',
          waterType: type,
          source: 'Nominatim Waterway Registry',
        });
      }
    }
  } catch (err) {
    console.warn('Nominatim note:', err instanceof Error ? err.message : 'timeout');
  }

  // =========================================================================
  // STEP 4: Optical Water Signature Confirmation
  // If the optical satellite reflectance shows water characteristics (low brightness, positive green/red)
  // =========================================================================
  if (opt && opt.grwi > 0.08 && opt.brightness < 105) {
    return NextResponse.json({
      isWater: true,
      waterBodyName: 'Water Surface Channel',
      waterType: 'water_body',
      opticalReflectance: opt,
      source: 'satellite_optical_spectral_detection',
    });
  }

  // =========================================================================
  // DEFAULT: No water detected -> Land
  // =========================================================================
  return NextResponse.json({
    isWater: false,
    waterBodyName: null,
    waterType: null,
    source: 'terrestrial_surface',
  });
}
