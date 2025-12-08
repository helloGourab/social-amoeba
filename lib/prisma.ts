// lib/prisma.ts

// 1. Import necessary components
import { PrismaClient } from '../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'

// 2. Get the database URL and ensure it's defined
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable must be set');
}

// 3. Instantiate the adapter
const adapter = new PrismaPg({connectionString: DATABASE_URL}); // Pass the URL directly to the adapter constructor

// Standard global setup to prevent multiple client instances
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // 4. Pass the adapter to the Prisma Client constructor
    adapter, 
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}