import type { SupabaseContext } from "@supabase/server";

type RequireAdminResult =
  | { ok: true; userId: string }
  | { ok: false; response: Response };

function authorizationError(status: 401 | 403, error: string): RequireAdminResult {
  return {
    ok: false,
    response: Response.json({ error }, { status }),
  };
}

/**
 * Authorizes an authenticated Admin user before privileged work begins.
 *
 * `withSupabase({ auth: "user" })` has already verified the JWT before this
 * helper runs. The role check deliberately uses the caller-scoped client so
 * the service-role client is never used to establish identity or privilege.
 */
export async function requireAdmin(
  ctx: SupabaseContext<any>,
): Promise<RequireAdminResult> {
  const userId = ctx.userClaims?.id;

  if (!userId) {
    return authorizationError(401, "Unauthorized");
  }

  const { data: student, error } = await ctx.supabase
    .from("students")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Admin authorization lookup failed", error);
    return {
      ok: false,
      response: Response.json({ error: "Unable to authorize request" }, { status: 500 }),
    };
  }

  if (!student?.is_admin) {
    return authorizationError(403, "Forbidden");
  }

  return { ok: true, userId };
}
