// Because of hot module reload(means as we make changes to our code, it recompile our complete code), So Connection like "Prisma" and "Pusher" will start the new connection instance. But "Postgres" database and "Pusher" allows limited number of connection instance we are creating.
// So to avoid creating multiple instance coz of hot module reloading, we will only create one instance, even though our code reCompile multiple times.

import PusherServer from "pusher";
import PusherClient from "pusher-js";

declare global {
  var pusherServerInstance: PusherServer | undefined;
  var pusherClientInstance: PusherClient | undefined;
}

if (!global.pusherServerInstance) {
  global.pusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: "ap2",
    useTLS: true,
  });
}

if (!global.pusherClientInstance) {
  global.pusherClientInstance = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
      channelAuthorization: {
        endpoint: "/api/pusher-auth",
        transport: "ajax",
      },
      cluster: "ap2",
    }
  );
}

export const pusherServer = global.pusherServerInstance;
export const pusherClient = global.pusherClientInstance;
