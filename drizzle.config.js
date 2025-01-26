/**@type { import("drizzle-kit").Config }*/
export default {
  schema: "./utils/schema.js", // Path to your database schema
  dialect: "postgresql",        // Output directory for migrations
  dbCredentials: {
    url:"postgresql://neondb_owner:npg_3hxIv0bJNsGr@ep-restless-haze-a8k6kixb-pooler.eastus2.azure.neon.tech/neondb?sslmode=require", // Database connection URL
  },
};
