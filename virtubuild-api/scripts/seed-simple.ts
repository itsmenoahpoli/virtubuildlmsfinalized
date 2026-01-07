import "reflect-metadata";
import { initializeDatabase } from "../src/database";
import { runSeed } from "../src/seed";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding process...");
    
    console.log("📡 Initializing database connection...");
    await initializeDatabase();
    
    console.log("✅ Database connected successfully!");
    
    console.log("🌱 Running seeders...");
    await runSeed();
    
    console.log("✅ Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
