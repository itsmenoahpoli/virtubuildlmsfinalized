import "reflect-metadata";
import { initializeDatabase } from "../src/database";
import { runSeed } from "../src/seed";

async function setupDatabase() {
  try {
    console.log("🚀 Starting complete database setup...");
    
    console.log("📡 Initializing database connection...");
    await initializeDatabase();
    
    console.log("✅ Database connected successfully!");
    
    console.log("🌱 Running seeders...");
    await runSeed();
    
    console.log("✅ Database setup completed successfully!");
    console.log("🎉 Your database is ready to use!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
