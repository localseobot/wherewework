interface GeoResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

// Simple in-memory cache for geocoding results
const geoCache = new Map<string, GeoResult>();

export async function geocode(query: string): Promise<GeoResult | null> {
  const normalized = query.trim().toLowerCase();

  if (geoCache.has(normalized)) {
    return geoCache.get(normalized)!;
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "WhereWeWork/1.0 (contact@wherewework.io)",
      },
    });

    const data = await res.json();

    if (!data || data.length === 0) return null;

    const result: GeoResult = {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };

    geoCache.set(normalized, result);
    return result;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Approximate coordinates from timezone (fallback)
const timezoneCoords: Record<string, [number, number]> = {
  "America/New_York": [40.7128, -74.006],
  "America/Chicago": [41.8781, -87.6298],
  "America/Denver": [39.7392, -104.9903],
  "America/Los_Angeles": [34.0522, -118.2437],
  "America/Toronto": [43.6532, -79.3832],
  "America/Vancouver": [49.2827, -123.1207],
  "Europe/London": [51.5074, -0.1278],
  "Europe/Paris": [48.8566, 2.3522],
  "Europe/Berlin": [52.52, 13.405],
  "Europe/Amsterdam": [52.3676, 4.9041],
  "Asia/Tokyo": [35.6762, 139.6503],
  "Asia/Shanghai": [31.2304, 121.4737],
  "Asia/Kolkata": [28.6139, 77.209],
  "Asia/Singapore": [1.3521, 103.8198],
  "Australia/Sydney": [-33.8688, 151.2093],
  "Pacific/Auckland": [-36.8485, 174.7633],
  "America/Sao_Paulo": [-23.5505, -46.6333],
  "Africa/Lagos": [6.5244, 3.3792],
  "Africa/Johannesburg": [-26.2041, 28.0473],
};

export function coordsFromTimezone(
  tz: string
): { latitude: number; longitude: number } | null {
  const coords = timezoneCoords[tz];
  if (!coords) return null;
  return { latitude: coords[0], longitude: coords[1] };
}
