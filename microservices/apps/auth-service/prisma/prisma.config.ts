import { defineConfig } from '@prisma/cli';
import 'dotenv/config';

export default defineConfig({
  datasources: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL, // читає з .env
    },
  },
});
