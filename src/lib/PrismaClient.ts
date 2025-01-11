// Because of hot module reload(means as we make changes to our code, it recompile our complete code), So Connection like "Prisma" and "Pusher" will start the new connection instance. But "Postgres" database and "Pusher" allows limited number of connection instance we are creating.
// So to avoid creating multiple instance coz of hot module reloading, we will only create one instance, even though our code reCompile multiple times.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Optional: Useful for debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
