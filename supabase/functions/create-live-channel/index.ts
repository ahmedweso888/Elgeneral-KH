import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

import {
  IVSClient,
  CreateChannelCommand,
  CreateStreamKeyCommand,
} from "npm:@aws-sdk/client-ivs";
import { requireAdmin } from "../_shared/require-admin.ts";

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    const authorization = await requireAdmin(ctx);

    if (!authorization.ok) {
      return authorization.response;
    }

    try {
      const client = new IVSClient({
        region: Deno.env.get("AWS_REGION"),
        credentials: {
          accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
          secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
        },
      });

      const channel = await client.send(
        new CreateChannelCommand({
          latencyMode: "LOW",
          type: "STANDARD",
          authorized: false,
          name: `live-${crypto.randomUUID()}`,
        }),
      );

      if (!channel.channel?.arn) {
        throw new Error("Channel creation failed");
      }

      const streamKey = await client.send(
        new CreateStreamKeyCommand({
          channelArn: channel.channel.arn,
        }),
      );

      return Response.json({
        success: true,
        streamKey: streamKey.streamKey?.value,
        playbackUrl: channel.channel.playbackUrl,
        channelArn: channel.channel.arn,
      });
    } catch (error) {
      console.error("Live channel creation failed", error);
      return Response.json(
        { success: false, error: "Unable to create live channel" },
        { status: 500 },
      );
    }
  }),
};
