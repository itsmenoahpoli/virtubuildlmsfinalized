import "reflect-metadata";
import { initializeDatabase } from "../src/database";

async function checkDatabaseStatus() {
  try {
    console.log("🔍 Checking database status...");
    
    await initializeDatabase();
    console.log("✅ Database connection: OK");
    console.log("✅ Database schema: Synced");
    
    console.log("\n📋 Available database commands:");
    console.log("  npm run db:migrate     - Run pending migrations");
    console.log("  npm run db:seed       - Run database seeders");
    console.log("  npm run db:setup      - Complete setup (migrate + seed)");
    console.log("  npm run db:reset      - Reset database (⚠️ DESTRUCTIVE)");
    console.log("  npm run migration:generate <name> - Generate new migration");
    
    console.log("\n🚀 Application commands:");
    console.log("  npm run dev           - Start development server (no auto-seeding)");
    console.log("  npm start            - Start production server");
    
    console.log("\n✅ Database is ready for manual operations!");
    
  } catch (error) {
    console.error("❌ Database status check failed:", error);
    process.exit(1);
  }
}

checkDatabaseStatus();
