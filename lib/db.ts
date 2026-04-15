import { supabase } from "./supabase";

// Workspace operations

export async function upsertWorkspace(teamId: string, teamName: string, botToken: string) {
  const { data: existing } = await supabase
    .from("workspaces")
    .select("id")
    .eq("team_id", teamId)
    .single();

  if (existing) {
    await supabase
      .from("workspaces")
      .update({ bot_token: botToken, team_name: teamName })
      .eq("id", existing.id);
    return existing.id;
  } else {
    const { data } = await supabase
      .from("workspaces")
      .insert({ team_id: teamId, team_name: teamName, bot_token: botToken })
      .select("id")
      .single();
    return data?.id;
  }
}

export async function getWorkspaceByTeamId(teamId: string) {
  const { data } = await supabase
    .from("workspaces")
    .select("*")
    .eq("team_id", teamId)
    .single();
  return data;
}
