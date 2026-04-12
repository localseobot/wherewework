export interface DemoMember {
  id: number;
  workspaceId: number;
  slackUserId: string;
  displayName: string;
  avatarUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isOnline: boolean;
  lastUpdated: string;
  status: string;
  team: string;
}

export const TEAMS = [
  "Engineering",
  "Design",
  "Marketing",
  "Product",
  "Sales",
  "Operations",
] as const;

export type Team = (typeof TEAMS)[number];

export const DEMO_MEMBERS: DemoMember[] = [
  {
    id: 1, workspaceId: 1, slackUserId: "U001", displayName: "Sarah Chen",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen",
    locationName: "San Francisco, CA", latitude: 37.7749, longitude: -122.4194,
    timezone: "America/Los_Angeles", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "In a meeting", team: "Engineering",
  },
  {
    id: 2, workspaceId: 1, slackUserId: "U002", displayName: "James Wilson",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=JamesWilson",
    locationName: "London, UK", latitude: 51.5074, longitude: -0.1278,
    timezone: "Europe/London", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "Available", team: "Marketing",
  },
  {
    id: 3, workspaceId: 1, slackUserId: "U003", displayName: "Yuki Tanaka",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=YukiTanaka",
    locationName: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503,
    timezone: "Asia/Tokyo", isOnline: false, lastUpdated: new Date().toISOString(),
    status: "On PTO", team: "Engineering",
  },
  {
    id: 4, workspaceId: 1, slackUserId: "U004", displayName: "Priya Sharma",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma",
    locationName: "Mumbai, India", latitude: 19.076, longitude: 72.8777,
    timezone: "Asia/Kolkata", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "Focus mode", team: "Product",
  },
  {
    id: 5, workspaceId: 1, slackUserId: "U005", displayName: "Marcus Santos",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusSantos",
    locationName: "São Paulo, Brazil", latitude: -23.5505, longitude: -46.6333,
    timezone: "America/Sao_Paulo", isOnline: false, lastUpdated: new Date().toISOString(),
    status: "Away", team: "Sales",
  },
  {
    id: 6, workspaceId: 1, slackUserId: "U006", displayName: "Emma Johansson",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaJohansson",
    locationName: "Stockholm, Sweden", latitude: 59.3293, longitude: 18.0686,
    timezone: "Europe/Stockholm", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "Available", team: "Design",
  },
  {
    id: 7, workspaceId: 1, slackUserId: "U007", displayName: "Alex Petrov",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexPetrov",
    locationName: "Berlin, Germany", latitude: 52.52, longitude: 13.405,
    timezone: "Europe/Berlin", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "In a huddle", team: "Engineering",
  },
  {
    id: 8, workspaceId: 1, slackUserId: "U008", displayName: "Amara Okafor",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AmaraOkafor",
    locationName: "Lagos, Nigeria", latitude: 6.5244, longitude: 3.3792,
    timezone: "Africa/Lagos", isOnline: false, lastUpdated: new Date().toISOString(),
    status: "Offline", team: "Operations",
  },
  {
    id: 9, workspaceId: 1, slackUserId: "U009", displayName: "Liam O'Brien",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=LiamOBrien",
    locationName: "Toronto, Canada", latitude: 43.6532, longitude: -79.3832,
    timezone: "America/Toronto", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "Available", team: "Engineering",
  },
  {
    id: 10, workspaceId: 1, slackUserId: "U010", displayName: "Fatima Al-Rashid",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=FatimaAlRashid",
    locationName: "Dubai, UAE", latitude: 25.2048, longitude: 55.2708,
    timezone: "Asia/Dubai", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "In a meeting", team: "Sales",
  },
  {
    id: 11, workspaceId: 1, slackUserId: "U011", displayName: "Wei Zhang",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=WeiZhang",
    locationName: "Singapore", latitude: 1.3521, longitude: 103.8198,
    timezone: "Asia/Singapore", isOnline: false, lastUpdated: new Date().toISOString(),
    status: "Do not disturb", team: "Product",
  },
  {
    id: 12, workspaceId: 1, slackUserId: "U012", displayName: "Sofia Hernandez",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaHernandez",
    locationName: "Mexico City, Mexico", latitude: 19.4326, longitude: -99.1332,
    timezone: "America/Mexico_City", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "Available", team: "Marketing",
  },
  {
    id: 13, workspaceId: 1, slackUserId: "U013", displayName: "Thabo Molefe",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ThaboMolefe",
    locationName: "Cape Town, South Africa", latitude: -33.9249, longitude: 18.4241,
    timezone: "Africa/Johannesburg", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "Commuting", team: "Design",
  },
  {
    id: 14, workspaceId: 1, slackUserId: "U014", displayName: "Min-jun Park",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MinjunPark",
    locationName: "Seoul, South Korea", latitude: 37.5665, longitude: 126.978,
    timezone: "Asia/Seoul", isOnline: false, lastUpdated: new Date().toISOString(),
    status: "Offline", team: "Engineering",
  },
  {
    id: 15, workspaceId: 1, slackUserId: "U015", displayName: "Olivia Martin",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=OliviaMartin",
    locationName: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093,
    timezone: "Australia/Sydney", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "Available", team: "Operations",
  },
  {
    id: 16, workspaceId: 1, slackUserId: "U016", displayName: "Noah Fischer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=NoahFischer",
    locationName: "Zurich, Switzerland", latitude: 47.3769, longitude: 8.5417,
    timezone: "Europe/Zurich", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "On a call", team: "Product",
  },
  {
    id: 17, workspaceId: 1, slackUserId: "U017", displayName: "Aisha Patel",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=AishaPatel",
    locationName: "Nairobi, Kenya", latitude: -1.2921, longitude: 36.8219,
    timezone: "Africa/Nairobi", isOnline: false, lastUpdated: new Date().toISOString(),
    status: "On PTO", team: "Marketing",
  },
  {
    id: 18, workspaceId: 1, slackUserId: "U018", displayName: "Carlos Rivera",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosRivera",
    locationName: "Buenos Aires, Argentina", latitude: -34.6037, longitude: -58.3816,
    timezone: "America/Argentina/Buenos_Aires", isOnline: true, lastUpdated: new Date().toISOString(),
    status: "Available", team: "Engineering",
  },
];
