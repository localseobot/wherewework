import crypto from "crypto";

export async function verifySlackSignature(
  body: string,
  headers: Headers
): Promise<boolean> {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) return false;

  const timestamp = headers.get("x-slack-request-timestamp") || "";
  const signature = headers.get("x-slack-signature") || "";

  if (!timestamp || !signature) return false;

  // Reject requests older than 5 minutes (replay attack protection)
  const time = Math.floor(Date.now() / 1000);
  if (Math.abs(time - parseInt(timestamp)) > 300) return false;

  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", signingSecret)
      .update(sigBasestring, "utf8")
      .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(mySignature, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}
