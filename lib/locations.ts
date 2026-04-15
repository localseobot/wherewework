import { supabase } from "./supabase";

interface StoredLocation {
  userId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export async function storeLocation(
  userId: string,
  locationName: string,
  latitude: number,
  longitude: number
) {
  await supabase.from("user_locations").upsert(
    {
      user_id: userId,
      location_name: locationName,
      latitude,
      longitude,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
}

export async function getLocation(userId: string): Promise<StoredLocation | undefined> {
  const { data } = await supabase
    .from("user_locations")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return undefined;

  return {
    userId: data.user_id,
    locationName: data.location_name,
    latitude: data.latitude,
    longitude: data.longitude,
    updatedAt: data.updated_at,
  };
}

export async function getAllLocations(): Promise<StoredLocation[]> {
  const { data } = await supabase.from("user_locations").select("*");

  return (data || []).map((row) => ({
    userId: row.user_id,
    locationName: row.location_name,
    latitude: row.latitude,
    longitude: row.longitude,
    updatedAt: row.updated_at,
  }));
}
