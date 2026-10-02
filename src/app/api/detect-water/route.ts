import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ isWater: false, waterBodyName: null, waterType: null, source: 'error' });
  }

  // Method 1: OpenStreetMap Overpass API — expanded query with 200m radius
  // Checks rivers, lakes, canals, coastlines, bays, seas, reservoirs, wetlands
  try {
    const query = `[out:json][timeout:6];(
      way["natural"="water"](around:200,${lat},${lng});
      way["waterway"](around:200,${lat},${lng});
      way["water"](around:200,${lat},${lng});
      way["natural"="coastline"](around:200,${lat},${lng});
      way["natural"="bay"](around:200,${lat},${lng});
      way["natural"="strait"](around:200,${lat},${lng});
      way["natural"="wetland"](around:200,${lat},${lng});
      way["landuse"="reservoir"](around:200,${lat},${lng});
      way["landuse"="basin"](around:200,${lat},${lng});
      way["leisure"="marina"](around:200,${lat},${lng});
      relation["natural"="water"](around:200,${lat},${lng});
      relation["waterway"](around:200,${lat},${lng});
      relation["natural"="coastline"](around:200,${lat},${lng});
      relation["natural"="bay"](around:200,${lat},${lng});
      relation["place"="sea"](around:500,${lat},${lng});
      relation["place"="ocean"](around:500,${lat},${lng});
    );out tags 1;`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const elements = data.elements || [];
      if (elements.length > 0) {
        const tags = elements[0]?.tags || {};
        const name = tags.name || tags.waterway || tags.natural || tags.place || 'Water Body';
        const waterType = tags.waterway || tags.natural || tags.water || tags.place || tags.landuse || 'water';
        return NextResponse.json({
          isWater: true,
          waterBodyName: name,
          waterType,
          source: 'OpenStreetMap Overpass API',
        });
      }
      // Overpass found nothing — try Nominatim before declaring land
    }
  } catch (err) {
    console.warn('Overpass API note:', err instanceof Error ? err.message : 'timeout');
  }

  // Method 2: Nominatim Reverse Geocoding — broader water type detection
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14`,
      {
        signal: controller.signal,
        headers: { 'User-Agent': 'AquaLens-Sentinel/1.0 (IEEE-Hackathon)' },
      }
    );

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();

      // Check for Nominatim "error" responses — points in open ocean return this
      if (data.error === 'Unable to geocode') {
        return NextResponse.json({
          isWater: true,
          waterBodyName: 'Open Ocean / Sea',
          waterType: 'ocean',
          source: 'Nominatim (ocean inference)',
        });
      }

      const category = (data.category || '').toLowerCase();
      const type = (data.type || '').toLowerCase();
      const displayName = (data.display_name || '').toLowerCase();
      const addressKeys = Object.keys(data.address || {}).map(k => k.toLowerCase());

      // Direct category/type match
      const waterCategories = ['waterway', 'natural', 'place'];
      const waterTypes = [
        'water', 'river', 'lake', 'stream', 'canal', 'reservoir', 'pond',
        'sea', 'ocean', 'wetland', 'riverbank', 'drain', 'ditch', 'dock',
        'basin', 'bay', 'strait', 'coastline', 'beach', 'harbour', 'marina',
      ];

      const isDirectMatch = waterCategories.includes(category) && waterTypes.includes(type);
      const isTypeMatch = waterTypes.includes(type) || waterTypes.includes(category);

      // Check if display_name or address contains water keywords
      const waterKeywords = [
        'river', 'lake', 'ocean', 'sea', 'canal', 'bay', 'strait',
        'creek', 'stream', 'harbour', 'harbor', 'port', 'marina',
        'lagoon', 'estuary', 'delta', 'reservoir', 'pond', 'waterway',
        'atlantic', 'pacific', 'indian', 'mediterranean', 'gulf', 'fjord',
      ];
      const hasWaterKeyword = waterKeywords.some(kw => displayName.includes(kw));
      const hasWaterAddress = addressKeys.some(k => waterKeywords.includes(k));

      const isWater = isDirectMatch || isTypeMatch || hasWaterKeyword || hasWaterAddress;
      const name = data.name || data.display_name?.split(',')[0] || null;

      return NextResponse.json({
        isWater,
        waterBodyName: isWater ? name : null,
        waterType: isWater ? (type || category) : category,
        source: 'Nominatim',
      });
    }
  } catch (err) {
    console.warn('Nominatim note:', err instanceof Error ? err.message : 'timeout');
  }

  // Both APIs failed — conservative fallback
  return NextResponse.json({ isWater: false, waterBodyName: null, waterType: null, source: 'fallback' });
}
