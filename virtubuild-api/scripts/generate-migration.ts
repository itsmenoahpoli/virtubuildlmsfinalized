import "reflect-metadata";
import { DataSource } from "typeorm";
import { SETTINGS } from "../src/configs";
import { User as UserEntity, UserRole as UserRoleEntity, Module as ModuleEntity, LabActivity as LabActivityEntity, Assessment as AssessmentEntity, Grade as GradeEntity, PerformanceAnalytics as PerformanceAnalyticsEntity, ModuleActivation as ModuleActivationEntity, StudentGroup as StudentGroupEntity, StudentGroupAssignment as StudentGroupAssignmentEntity, StudentProgress as StudentProgressEntity, Simulation as SimulationEntity, ModulePrerequisite as ModulePrerequisiteEntity, AssessmentSubmission as AssessmentSubmissionEntity, AuditLog as AuditLogEntity, Notification as NotificationEntity, NotificationPreference as NotificationPreferenceEntity, SystemSettings as SystemSettingsEntity } from "../src/database/entities";

const AppDataSource = new DataSource({
  type: SETTINGS.APP_DB_TYPE,
  host: SETTINGS.APP_DB_HOST,
  port: Number(SETTINGS.APP_DB_PORT),
  username: SETTINGS.APP_DB_USERNAME,
  password: SETTINGS.APP_DB_PASSWORD,
  database: SETTINGS.APP_DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [
    UserEntity, 
    UserRoleEntity, 
    ModuleEntity, 
    LabActivityEntity, 
    AssessmentEntity, 
    GradeEntity, 
    PerformanceAnalyticsEntity, 
    ModuleActivationEntity, 
    StudentGroupEntity, 
    StudentGroupAssignmentEntity, 
    StudentProgressEntity, 
    SimulationEntity, 
    ModulePrerequisiteEntity, 
    AssessmentSubmissionEntity, 
    AuditLogEntity, 
    NotificationEntity, 
    NotificationPreferenceEntity, 
    SystemSettingsEntity
  ],
  migrations: [__dirname + "/../src/database/migrations/*.ts"],
  subscribers: [],
});

async function generateMigration() {
  try {
    console.log("Initializing database connection...");
    await AppDataSource.initialize();
    
    const migrationName = process.argv[2];
    if (!migrationName) {
      console.error("❌ Please provide a migration name:");
      console.error("Usage: npm run migration:generate <migration-name>");
      process.exit(1);
    }
    
    console.log(`Generating migration: ${migrationName}`);
    
    const { execSync } = require('child_process');
    try {
      execSync(`npx typeorm migration:generate src/database/migrations/${migrationName} -d ${__dirname}/../src/database/index.ts`, {
        stdio: 'inherit',
        cwd: __dirname + "/../"
      });
      console.log(`✅ Migration generated successfully: ${migrationName}`);
    } catch (error) {
      console.log("ℹ️  No changes detected. No migration generated.");
    }
    
    await AppDataSource.destroy();
    
  } catch (error) {
    console.error("❌ Migration generation failed:", error);
    process.exit(1);
  }
}

generateMigration();
