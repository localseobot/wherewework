import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SlackMember {
  id: string;
  name: string;
  deleted: boolean;
  is_bot: boolean;
  profile: {
    display_name?: string;
    real_name?: string;
    image_192?: string;
    image_72?: string;
    fields?: Record<string, { label?: string; value?: string }>;
  };
  tz?: string;
}

interface SlackPresence {
  presence: "active" | "away";
}

// Approximate coordinates from timezone
const timezoneCoords: Record<string, [number, number]> = {
  "America/New_York": [40.7128, -74.006],
  "America/Chicago": [41.8781, -87.6298],
  "America/Denver": [39.7392, -104.9903],
  "America/Los_Angeles": [34.0522, -118.2437],
  "America/Toronto": [43.6532, -79.3832],
  "America/Vancouver": [49.2827, -123.1207],
  "America/Phoenix": [33.4484, -112.074],
  "America/Detroit": [42.3314, -83.0458],
  "America/Indiana/Indianapolis": [39.7684, -86.1581],
  "America/Sao_Paulo": [-23.5505, -46.6333],
  "America/Argentina/Buenos_Aires": [-34.6037, -58.3816],
  "America/Bogota": [4.711, -74.0721],
  "America/Mexico_City": [19.4326, -99.1332],
  "America/Lima": [-12.0464, -77.0428],
  "Europe/London": [51.5074, -0.1278],
  "Europe/Paris": [48.8566, 2.3522],
  "Europe/Berlin": [52.52, 13.405],
  "Europe/Amsterdam": [52.3676, 4.9041],
  "Europe/Madrid": [40.4168, -3.7038],
  "Europe/Rome": [41.9028, 12.4964],
  "Europe/Stockholm": [59.3293, 18.0686],
  "Europe/Zurich": [47.3769, 8.5417],
  "Europe/Dublin": [53.3498, -6.2603],
  "Europe/Warsaw": [52.2297, 21.0122],
  "Europe/Prague": [50.0755, 14.4378],
  "Europe/Vienna": [48.2082, 16.3738],
  "Europe/Helsinki": [60.1699, 24.9384],
  "Europe/Lisbon": [38.7223, -9.1393],
  "Europe/Moscow": [55.7558, 37.6173],
  "Europe/Istanbul": [41.0082, 28.9784],
  "Asia/Tokyo": [35.6762, 139.6503],
  "Asia/Shanghai": [31.2304, 121.4737],
  "Asia/Hong_Kong": [22.3193, 114.1694],
  "Asia/Kolkata": [28.6139, 77.209],
  "Asia/Singapore": [1.3521, 103.8198],
  "Asia/Seoul": [37.5665, 126.978],
  "Asia/Bangkok": [13.7563, 100.5018],
  "Asia/Dubai": [25.2048, 55.2708],
  "Asia/Taipei": [25.033, 121.5654],
  "Asia/Manila": [14.5995, 120.9842],
  "Asia/Jakarta": [-6.2088, 106.8456],
  "Asia/Karachi": [24.8607, 67.0011],
  "Asia/Tehran": [35.6892, 51.389],
  "Asia/Riyadh": [24.7136, 46.6753],
  "Australia/Sydney": [-33.8688, 151.2093],
  "Australia/Melbourne": [-37.8136, 144.9631],
  "Australia/Perth": [-31.9505, 115.8605],
  "Pacific/Auckland": [-36.8485, 174.7633],
  "Pacific/Honolulu": [21.3069, -157.8583],
  "Africa/Lagos": [6.5244, 3.3792],
  "Africa/Johannesburg": [-26.2041, 28.0473],
  "Africa/Cairo": [30.0444, 31.2357],
  "Africa/Nairobi": [-1.2921, 36.8219],
};

async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "WhereWeWork/1.0" },
      next: { revalidate: 86400 }, // Cache for 24h
    });

    const data = await res.json();
    if (!data || data.length === 0) return null;

    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const botToken = process.env.SLACK_BOT_TOKEN;

  if (!botToken) {
    return NextResponse.json(
      { error: "SLACK_BOT_TOKEN not configured" },
      { status: 500 }
    );
  }

  // Require API key for non-browser requests, or valid origin for browser requests
  const apiKey = process.env.WWW_API_KEY;
  const authHeader = request.headers.get("authorization");
  const origin = request.headers.get("origin") || request.headers.get("referer") || "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";

  const isValidOrigin = origin.startsWith(appUrl) || origin.startsWith("http://localhost");
  const isValidApiKey = apiKey && authHeader === `Bearer ${apiKey}`;

  if (!isValidOrigin && !isValidApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get team ID for deep links
    const authRes = await fetch("https://slack.com/api/auth.test", {
      headers: { Authorization: `Bearer ${botToken}` },
    });
    const authData = await authRes.json();
    const teamId = authData.ok ? authData.team_id : "";

    // Fetch all workspace members
    const usersRes = await fetch("https://slack.com/api/users.list", {
      headers: { Authorization: `Bearer ${botToken}` },
    });
    const usersData = await usersRes.json();

    if (!usersData.ok) {
      console.error("Slack users.list error:", usersData.error);
      return NextResponse.json(
        { error: usersData.error },
        { status: 500 }
      );
    }

    const slackMembers: SlackMember[] = usersData.members || [];

    // Build member list
    const members = await Promise.all(
      slackMembers
        .filter((m) => !m.is_bot && m.id !== "USLACKBOT" && !m.deleted)
        .map(async (m, index) => {
          const profile = m.profile;
          const displayName =
            profile?.display_name || profile?.real_name || m.name || "Unknown";
          const avatarUrl = profile?.image_192 || profile?.image_72;
          const tz = m.tz;

          // Try to get location from our location store first (user-set via /wherewework)
          let locationName: string | null = null;
          let latitude: number | null = null;
          let longitude: number | null = null;

          const { getLocation } = await import("@/lib/locations");
          const storedLoc = getLocation(m.id);
          if (storedLoc) {
            locationName = storedLoc.locationName;
            latitude = storedLoc.latitude;
            longitude = storedLoc.longitude;
          }

          // Then try Slack profile fields
          if (latitude === null && profile?.fields) {
            for (const field of Object.values(profile.fields)) {
              if (
                field.label?.toLowerCase().includes("location") &&
                field.value
              ) {
                locationName = field.value;
                const geo = await geocode(field.value);
                if (geo) {
                  latitude = geo.lat;
                  longitude = geo.lng;
                }
                break;
              }
            }
          }

          // Fallback to timezone coordinates
          if (latitude === null && tz) {
            const coords = timezoneCoords[tz];
            if (coords) {
              latitude = coords[0];
              longitude = coords[1];
              if (!locationName) {
                locationName = tz.replace(/_/g, " ").split("/").pop() || null;
              }
            }
          }

          // Get presence
          let isOnline = false;
          try {
            const presRes = await fetch(
              `https://slack.com/api/users.getPresence?user=${m.id}`,
              { headers: { Authorization: `Bearer ${botToken}` } }
            );
            const presData: SlackPresence & { ok: boolean } = await presRes.json();
            if (presData.ok) {
              isOnline = presData.presence === "active";
            }
          } catch {
            // Ignore presence errors
          }

          return {
            id: index + 1,
            workspaceId: 1,
            slackUserId: m.id,
            slackTeamId: teamId,
            displayName,
            avatarUrl,
            locationName,
            latitude,
            longitude,
            timezone: tz,
            isOnline,
            lastUpdated: new Date().toISOString(),
          };
        })
    );

    // Only return members that have a location
    const membersWithLocation = members.filter(
      (m) => m.latitude !== null && m.longitude !== null
    );

    return NextResponse.json(membersWithLocation);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json([], { status: 500 });
  }
}
