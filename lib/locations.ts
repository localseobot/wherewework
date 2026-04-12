// Simple in-memory location store
// On Vercel serverless, this persists within a single function invocation's warm instance
// For production, swap with Vercel KV, Upstash Redis, or a database

interface StoredLocation {
  userId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

const locationStore = new Map<string, StoredLocation>();

export function storeLocation(
  userId: string,
  locationName: string,
  latitude: number,
  longitude: number
) {
  locationStore.set(userId, {
    userId,
    locationName,
    latitude,
    longitude,
    updatedAt: new Date().toISOString(),
  });
}

export function getLocation(userId: string): StoredLocation | undefined {
  return locationStore.get(userId);
}

export function getAllLocations(): StoredLocation[] {
  return Array.from(locationStore.values());
}
