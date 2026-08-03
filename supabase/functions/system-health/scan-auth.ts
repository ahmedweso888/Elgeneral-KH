import type { AuthResult } from "./types.ts";

export async function scanAuth(
  supabase: any,
): Promise<AuthResult> {
  try {
    //--------------------------------------------------
    // List Users
    //--------------------------------------------------

    const {
      data,
      error,
    } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    if (error) {
      throw error;
    }

    //--------------------------------------------------
    // Count
    //--------------------------------------------------

    const totalUsers =
      data?.users?.length ?? 0;

    //--------------------------------------------------
    // Success
    //--------------------------------------------------

    return {
      ok: true,

      users: totalUsers,

      message:
        totalUsers > 0
          ? `Supabase Auth يعمل بشكل طبيعي (${totalUsers} مستخدم ظاهر في أول صفحة)`
          : "Supabase Auth يعمل بشكل طبيعي",

      details: {
        adminApi: true,
        usersLoaded: true,
      },
    };
  } catch (error) {
    return {
      ok: false,

      users: 0,

      message:
        error instanceof Error
          ? error.message
          : "Auth Scan Failed",

      details: {
        adminApi: false,
        usersLoaded: false,
      },
    };
  }
}