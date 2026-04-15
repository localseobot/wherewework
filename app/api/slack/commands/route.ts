import { NextResponse, after } from "next/server";
import { verifySlackSignature } from "@/lib/verify-slack";

function getUtcOffsetHours(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    if (!tzPart) return 0;
    const match = tzPart.value.match(/GMT([+-]?)(\d+)?(?::(\d+))?/);
    if (!match) return 0;
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2] || "0", 10);
    const minutes = parseInt(match[3] || "0", 10);
    return sign * (hours + minutes / 60);
  } catch {
    return 0;
  }
}

function formatTimeInTz(date: Date, timezone: string): string {
  try {
    return date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "??";
  }
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Parse date strings like "Apr 16", "April 16", "2026-04-16", "tomorrow", "Apr 16-18", "Apr 16 - Apr 20"
function parseDates(text: string): { startDate: Date; endDate: Date } {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  // Default: tomorrow
  let startDate = tomorrow;
  let endDate = tomorrow;

  const cleaned = text.toLowerCase().trim();

  // "today"
  if (cleaned.includes("today")) {
    startDate = today;
    endDate = today;
    return { startDate, endDate };
  }

  // "tomorrow"
  if (cleaned.includes("tomorrow")) {
    return { startDate, endDate };
  }

  // "next week" — next Monday through Friday
  if (cleaned.includes("next week")) {
    const dayOfWeek = today.getUTCDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    startDate = new Date(today);
    startDate.setUTCDate(today.getUTCDate() + daysUntilMonday);
    endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 4);
    return { startDate, endDate };
  }

  // "this week" — today through Friday
  if (cleaned.includes("this week")) {
    startDate = today;
    const dayOfWeek = today.getUTCDay();
    const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 0;
    endDate = new Date(today);
    endDate.setUTCDate(today.getUTCDate() + daysUntilFriday);
    return { startDate, endDate };
  }

  const months: Record<string, number> = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5,
    jul: 6, july: 6, aug: 7, august: 7, sep: 8, september: 8,
    oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
  };

  // Try "Month Day - Month Day" range (e.g. "Apr 16 - Apr 20" or "Apr 16-20")
  const rangeMatch = cleaned.match(
    /(\w+)\s+(\d{1,2})\s*[-–to]+\s*(?:(\w+)\s+)?(\d{1,2})/
  );
  if (rangeMatch) {
    const m1 = months[rangeMatch[1]];
    const d1 = parseInt(rangeMatch[2], 10);
    const m2 = rangeMatch[3] ? months[rangeMatch[3]] : m1;
    const d2 = parseInt(rangeMatch[4], 10);
    if (m1 !== undefined && m2 !== undefined) {
      const year = today.getUTCFullYear();
      startDate = new Date(Date.UTC(year, m1, d1));
      endDate = new Date(Date.UTC(year, m2, d2));
      // If dates are in the past, assume next year
      if (endDate < today) {
        startDate.setUTCFullYear(year + 1);
        endDate.setUTCFullYear(year + 1);
      }
      return { startDate, endDate };
    }
  }

  // Try single "Month Day" (e.g. "Apr 16")
  const singleMatch = cleaned.match(/(\w+)\s+(\d{1,2})/);
  if (singleMatch) {
    const m = months[singleMatch[1]];
    const d = parseInt(singleMatch[2], 10);
    if (m !== undefined) {
      const year = today.getUTCFullYear();
      startDate = new Date(Date.UTC(year, m, d));
      endDate = new Date(startDate);
      if (startDate < today) {
        startDate.setUTCFullYear(year + 1);
        endDate.setUTCFullYear(year + 1);
      }
      return { startDate, endDate };
    }
  }

  // Try ISO date "2026-04-16"
  const isoMatch = cleaned.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    startDate = new Date(`${isoMatch[0]}T00:00:00Z`);
    endDate = new Date(startDate);
    return { startDate, endDate };
  }

  return { startDate, endDate };
}

interface MeetSlot {
  startUtc: Date;
  endUtc: Date;
  score: number;
  dateLabel: string;
}

function findBestMeetingSlots(
  participants: { name: string; timezone: string }[],
  startDate: Date,
  endDate: Date,
  durationMinutes: number = 30
): MeetSlot[] {
  const durationMs = durationMinutes * 60 * 1000;
  const allSlots: MeetSlot[] = [];

  // Iterate over each day in the range
  const current = new Date(startDate);
  while (current <= endDate) {
    const dateStr = current.toISOString().split("T")[0];
    const dayStart = new Date(`${dateStr}T00:00:00Z`);
    const dateLabel = formatDateShort(current);

    for (let m = 0; m < 24 * 60; m += 30) {
      const slotStart = new Date(dayStart.getTime() + m * 60000);
      const slotEnd = new Date(slotStart.getTime() + durationMs);

      let score = 0;
      for (const p of participants) {
        const offset = getUtcOffsetHours(p.timezone);
        const localHour = (slotStart.getUTCHours() + offset + 24) % 24;
        if (localHour >= 9 && localHour < 17) {
          score += 2;
        } else if (localHour >= 8 && localHour < 18) {
          score += 1;
        }
      }

      if (score > 0) {
        allSlots.push({ startUtc: slotStart, endUtc: slotEnd, score, dateLabel });
      }
    }

    current.setUTCDate(current.getUTCDate() + 1);
  }

  allSlots.sort((a, b) => b.score - a.score);

  // If multi-day, pick best slot per day (up to 5 days), then top slots
  const dayCount = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  if (dayCount > 1) {
    // Get top 2 slots per day, max 8 total
    const byDay = new Map<string, MeetSlot[]>();
    for (const slot of allSlots) {
      const key = slot.startUtc.toISOString().split("T")[0];
      if (!byDay.has(key)) byDay.set(key, []);
      const daySlots = byDay.get(key)!;
      if (daySlots.length < 2) daySlots.push(slot);
    }
    const result: MeetSlot[] = [];
    for (const slots of byDay.values()) {
      result.push(...slots);
    }
    result.sort((a, b) => b.score - a.score);
    return result.slice(0, 8);
  }

  return allSlots.slice(0, 5);
}

// Build a Google Calendar URL for a time slot
function buildGoogleCalendarUrl(
  slot: MeetSlot,
  participantNames: string[],
  participantEmails: string[],
  durationMinutes: number = 30
): string {
  const start = slot.startUtc.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = slot.endUtc.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const title = encodeURIComponent(`Team Meeting — ${participantNames.join(", ")}`);
  const details = encodeURIComponent(
    `Meeting scheduled via WhereWeWork\nParticipants: ${participantNames.join(", ")}`
  );
  const guests = participantEmails.filter(Boolean).map(encodeURIComponent).join(",");

  let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  if (guests) {
    url += `&add=${guests}`;
  }
  return url;
}

export async function POST(request: Request) {
  const body = await request.text();
  const headers = request.headers;

  // Verify the request is from Slack
  const isValid = await verifySlackSignature(body, headers);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const params = new URLSearchParams(body);
  const command = params.get("command");
  const text = (params.get("text") || "").trim();
  const userId = params.get("user_id");
  const channelId = params.get("channel_id");

  if (command !== "/wherewework") {
    return NextResponse.json({ error: "Unknown command" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";
  const globeUrl = `${appUrl}/globe`;
  const botToken = process.env.SLACK_BOT_TOKEN;

  // /wherewework meet @user1 @user2 [date] — find meeting times
  if (text.startsWith("meet")) {
    if (!botToken) {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Bot token not configured. Please reinstall the app.",
      });
    }

    const responseUrl = params.get("response_url");

    // Schedule the heavy work to run AFTER the response is sent (Slack needs a reply within 3s)
    after(async () => {
      try {
        await handleMeetCommand(text, userId!, channelId!, botToken, responseUrl!, globeUrl);
      } catch (err) {
        console.error("Meet command error:", err);
        if (responseUrl) {
          await fetch(responseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              response_type: "ephemeral",
              text: "Something went wrong finding meeting times. Please try again.",
            }),
          });
        }
      }
    });

    // Immediately acknowledge to Slack
    return NextResponse.json({
      response_type: "ephemeral",
      text: ":hourglass_flowing_sand: Finding the best meeting times...",
    });
  }

  // /wherewework set <location> — set your location
  if (text.startsWith("set ")) {
    const location = text.slice(4).trim();
    if (!location) {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Please provide a location. Example: `/wherewework set London, UK`",
      });
    }

    // Geocode to validate the location
    try {
      const geoUrl = new URL("https://nominatim.openstreetmap.org/search");
      geoUrl.searchParams.set("q", location);
      geoUrl.searchParams.set("format", "json");
      geoUrl.searchParams.set("limit", "1");

      const geoRes = await fetch(geoUrl.toString(), {
        headers: { "User-Agent": "WhereWeWork/1.0" },
      });
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        return NextResponse.json({
          response_type: "ephemeral",
          text: `Couldn't find "${location}" on the map. Try a more specific city name, like "London, UK" or "San Francisco, CA".`,
        });
      }

      const resolvedName = geoData[0].display_name.split(",").slice(0, 2).join(",").trim();

      if (botToken) {
        const { storeLocation } = await import("@/lib/locations");
        await storeLocation(userId!, location, parseFloat(geoData[0].lat), parseFloat(geoData[0].lon));
      }

      return NextResponse.json({
        response_type: "ephemeral",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `:white_check_mark: Your location has been set to *${resolvedName}*`,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Open Globe", emoji: true },
                url: globeUrl,
                style: "primary",
                action_id: "open_globe_after_set",
              },
            ],
          },
        ],
      });
    } catch {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Something went wrong setting your location. Please try again.",
      });
    }
  }

  // /wherewework (no args) — show message with buttons
  return NextResponse.json({
    response_type: "ephemeral",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:globe_with_meridians: *WhereWeWork* — See where your team is right now!`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Open Globe", emoji: true },
            url: globeUrl,
            style: "primary",
            action_id: "open_globe_btn",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Set My Location", emoji: true },
            action_id: "set_location_btn",
            value: "set_location",
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "Tips:\n`/wherewework set London, UK` — set your location\n`/wherewework meet @Alex @Sarah` — find the best meeting time (tomorrow)\n`/wherewework meet @Alex Apr 16-18` — find times in a date range\n`/wherewework meet @Alex next week` — find times next week",
          },
        ],
      },
    ],
  });
}

async function handleMeetCommand(
  text: string,
  userId: string,
  channelId: string,
  botToken: string,
  responseUrl: string,
  globeUrl: string
) {
  // Parse mentioned user IDs: Slack sends them as <@U12345> or <@U12345|name>
  const mentionRegex = /<@(U[A-Z0-9]+)(?:\|[^>]*)?>/g;
  const mentionedIds: string[] = [];
  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    mentionedIds.push(match[1]);
  }

  // If no <@ID> mentions found, try to match plain text names
  if (mentionedIds.length === 0) {
    // Strip out date-like tokens before name matching
    const meetText = text
      .replace(/^meet\s*/i, "")
      .replace(/\b(today|tomorrow|next\s+week|this\s+week)\b/gi, "")
      .replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2}(?:\s*[-–to]+\s*(?:\w+\s+)?\d{1,2})?/gi, "")
      .replace(/\d{4}-\d{2}-\d{2}/g, "")
      .trim();

    const nameTokens = meetText
      .split(/(?:,|\band\b|\b&\b)+/)
      .map((s) => s.trim().replace(/^@/, ""))
      .filter((s) => s.length > 0 && s.toLowerCase() !== "me");

    if (nameTokens.length > 0) {
      try {
        const usersRes = await fetch("https://slack.com/api/users.list", {
          headers: { Authorization: `Bearer ${botToken}` },
        });
        const usersData = await usersRes.json();
        if (usersData.ok && usersData.members) {
          for (const token of nameTokens) {
            const lower = token.toLowerCase();
            const found = usersData.members.find(
              (u: { id: string; name: string; deleted: boolean; is_bot: boolean; profile?: { display_name?: string; real_name?: string } }) =>
                !u.deleted &&
                !u.is_bot &&
                (u.name?.toLowerCase() === lower ||
                  u.profile?.display_name?.toLowerCase() === lower ||
                  u.profile?.real_name?.toLowerCase() === lower ||
                  u.profile?.display_name?.toLowerCase().startsWith(lower) ||
                  u.profile?.real_name?.toLowerCase().startsWith(lower))
            );
            if (found && !mentionedIds.includes(found.id)) {
              mentionedIds.push(found.id);
            }
          }
        }
      } catch {
        // Fall through
      }
    }
  }

  // Always include the requesting user
  if (!mentionedIds.includes(userId)) {
    mentionedIds.unshift(userId);
  }

  if (mentionedIds.length < 2) {
    await fetch(responseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_type: "ephemeral",
        replace_original: true,
        text: "Couldn't find those users. Mention one or more people: `/wherewework meet @Alex @Sarah @Bob`",
      }),
    });
    return;
  }

  // Parse dates from the text (after removing user mentions)
  const textWithoutMentions = text
    .replace(/<@U[A-Z0-9]+(?:\|[^>]*)?>/g, "")
    .replace(/^meet\s*/i, "")
    .trim();
  const { startDate, endDate } = parseDates(textWithoutMentions);

  // Look up each user's info, timezone, and email
  const participants: { id: string; name: string; timezone: string; email: string }[] = [];
  for (const uid of mentionedIds) {
    try {
      const userRes = await fetch(
        `https://slack.com/api/users.info?user=${uid}`,
        { headers: { Authorization: `Bearer ${botToken}` } }
      );
      const userData = await userRes.json();
      if (userData.ok && userData.user) {
        const u = userData.user;
        participants.push({
          id: uid,
          name: u.profile?.display_name || u.profile?.real_name || u.name || uid,
          timezone: u.tz || "UTC",
          email: u.profile?.email || "",
        });
      }
    } catch {
      participants.push({ id: uid, name: uid, timezone: "UTC", email: "" });
    }
  }

  // Find best meeting slots
  const slots = findBestMeetingSlots(participants, startDate, endDate);

  // Format date range label
  const isSingleDay = startDate.getTime() === endDate.getTime();
  const dateRangeLabel = isSingleDay
    ? formatDateShort(startDate)
    : `${formatDateShort(startDate)} — ${formatDateShort(endDate)}`;

  if (slots.length === 0) {
    await fetch(responseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_type: "ephemeral",
        replace_original: true,
        text: "No overlapping working hours found for those dates. Your team might be spread across too many timezones!",
      }),
    });
    return;
  }

  // Build the participant timezone summary
  const tzSummary = participants
    .map((p) => `<@${p.id}> — ${p.timezone.replace(/_/g, " ")}`)
    .join("\n");

  // Build time slot blocks with Google Calendar links
  const maxScore = participants.length * 2;
  const participantNames = participants.map((p) => p.name);
  const participantEmails = participants.map((p) => p.email);

  const slotBlocks: object[] = [];
  for (const slot of slots) {
    const ratio = slot.score / maxScore;
    const label =
      ratio >= 0.8
        ? ":large_green_circle: Ideal"
        : ratio >= 0.5
          ? ":large_blue_circle: Good"
          : ":large_yellow_circle: Possible";

    const localTimes = participants
      .map((p) => `${p.name}: *${formatTimeInTz(slot.startUtc, p.timezone)}*`)
      .join("  ·  ");

    const dayPrefix = isSingleDay ? "" : `*${slot.dateLabel}*  `;
    const calUrl = buildGoogleCalendarUrl(slot, participantNames, participantEmails);

    slotBlocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `${label}  ${dayPrefix}${localTimes}` },
      accessory: {
        type: "button",
        text: { type: "plain_text", text: ":calendar: Add to Calendar", emoji: true },
        url: calUrl,
        action_id: `gcal_${slot.startUtc.getTime()}`,
      },
    });
  }

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `:calendar: Best meeting times · ${dateRangeLabel}`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Participants & Timezones:*\n${tzSummary}`,
      },
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Top ${slots.length} time slots (30 min):*`,
      },
    },
    ...slotBlocks,
    { type: "divider" },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `:globe_with_meridians: Powered by <${globeUrl}|WhereWeWork> · Click "Add to Calendar" to create a Google Calendar event you can edit`,
        },
      ],
    },
  ];

  // Post results visible to the whole channel via response_url
  await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response_type: "in_channel",
      replace_original: true,
      text: `Best meeting times for ${participantNames.join(", ")} · ${dateRangeLabel}`,
      blocks,
    }),
  });
}
