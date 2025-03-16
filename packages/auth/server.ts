import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { organization } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { database } from '@repo/database/index';

// First define our auth instance
export const auth = betterAuth({
  user: {
    modelName: 'User',
  },
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
  },
  hooks: {},
  advanced: {
    generateId: false,
  },
  emailVerification: {},
  database: prismaAdapter(database, {
    provider: 'postgresql',
  }),
  plugins: [nextCookies(), organization()],
  //...add more options here
});

export { toNextJsHandler } from 'better-auth/next-js';
