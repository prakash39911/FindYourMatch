// Because of hot module reload(means as we make changes to our code, it recompile our complete code), So Connection like "Prisma" and "Pusher" will start the new connection instance. But "Postgres" database and "Pusher" allows limited number of connection instance we are creating.
// So to avoid creating multiple instance coz of hot module reloading, we will only create one instance, even though our code reCompile multiple times.

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
