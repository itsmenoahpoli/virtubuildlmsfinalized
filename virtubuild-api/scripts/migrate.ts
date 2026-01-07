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
  synchronize: false, // Disable auto-sync for migrations
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

async function runMigrations() {
  try {
    console.log("Initializing database connection...");
    await AppDataSource.initialize();
    
    console.log("Running pending migrations...");
    const migrations = await AppDataSource.runMigrations();
    
    if (migrations.length === 0) {
      console.log("✅ No pending migrations found.");
    } else {
      console.log(`✅ Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach(migration => {
        console.log(`  - ${migration.name}`);
      });
    }
    
    await AppDataSource.destroy();
    console.log("Migration process completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
