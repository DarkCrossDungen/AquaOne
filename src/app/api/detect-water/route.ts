import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ isWater: false, waterBodyName: null, waterType: null, source: 'error' });
  }

  // Method 1: OpenStreetMap Overpass API — checks for water features within 50m radius
  try {
    const query = `[out:json][timeout:5];(way["natural"="water"](around:50,${lat},${lng});way["waterway"](around:50,${lat},${lng});way["water"](around:50,${lat},${lng});relation["natural"="water"](around:50,${lat},${lng});relation["waterway"](around:50,${lat},${lng}););out tags 1;`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

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
        const name = tags.name || tags.waterway || tags.natural || 'Water Body';
        const waterType = tags.waterway || tags.natural || tags.water || 'water';
        return NextResponse.json({
          isWater: true,
          waterBodyName: name,
          waterType,
          source: 'OpenStreetMap Overpass API',
        });
      } else {
        // Overpass found no water features — confirmed dry land
        return NextResponse.json({
          isWater: false,
          waterBodyName: null,
          waterType: null,
          source: 'OpenStreetMap Overpass API',
        });
      }
    }
  } catch (err) {
    console.warn('Overpass API note:', err instanceof Error ? err.message : 'timeout');
  }

  // Method 2: Nominatim Reverse Geocoding Fallback
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18`,
      {
        signal: controller.signal,
        headers: { 'User-Agent': 'AquaLens-Sentinel/1.0 (IEEE-Hackathon)' },
      }
    );

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const category = (data.category || '').toLowerCase();
      const type = (data.type || '').toLowerCase();

      const waterCategories = ['waterway', 'natural'];
      const waterTypes = ['water', 'river', 'lake', 'stream', 'canal', 'reservoir', 'pond', 'sea', 'ocean', 'wetland', 'riverbank', 'drain', 'ditch', 'dock', 'basin'];

      const isWater = (waterCategories.includes(category) && waterTypes.includes(type)) || waterTypes.includes(category);
      const name = data.name || data.display_name?.split(',')[0] || null;

      return NextResponse.json({
        isWater,
        waterBodyName: isWater ? name : null,
        waterType: isWater ? type : category,
        source: 'Nominatim',
      });
    }
  } catch (err) {
    console.warn('Nominatim note:', err instanceof Error ? err.message : 'timeout');
  }

  // Both APIs failed — return unknown (conservative: treat as land)
  return NextResponse.json({ isWater: false, waterBodyName: null, waterType: null, source: 'fallback' });
}
