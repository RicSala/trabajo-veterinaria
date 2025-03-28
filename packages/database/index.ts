// import 'server-only';

import { PrismaClient } from './generated/client';
import { keys } from './keys';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Determine if we should use Neon's WebSocket adapter
const useNeonAdapter = () => {
  const url = keys().DATABASE_URL;
  return url.includes('neon.tech') || process.env.USE_NEON_ADAPTER === 'true';
};

// Create the appropriate Prisma client based on the environment
const createPrismaClient = () => {
  if (useNeonAdapter()) {
    // For Neon database (production or if explicitly configured)

    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({ connectionString: keys().DATABASE_URL });
    const adapter = new PrismaNeon(pool);

    return new PrismaClient({ adapter });
  } else {
    // For standard PostgreSQL (local development with Docker)
    return new PrismaClient({
      datasources: {
        db: {
          url: keys().DATABASE_URL,
        },
      },
    });
  }
};

// Initialize Prisma client (with caching for development)
let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaClient = globalForPrisma.prisma || createPrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = await createPrismaClient();
  }
  prismaClient = globalForPrisma.prisma;
}

export const database = prismaClient;
export * from './generated/client';
