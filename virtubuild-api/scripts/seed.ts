import "reflect-metadata";
import { DataSource } from "typeorm";
import { SETTINGS } from "../src/configs";
import { User as UserEntity, UserRole as UserRoleEntity, Module as ModuleEntity, LabActivity as LabActivityEntity, Assessment as AssessmentEntity, Grade as GradeEntity, PerformanceAnalytics as PerformanceAnalyticsEntity, ModuleActivation as ModuleActivationEntity, StudentGroup as StudentGroupEntity, StudentGroupAssignment as StudentGroupAssignmentEntity, StudentProgress as StudentProgressEntity, Simulation as SimulationEntity, ModulePrerequisite as ModulePrerequisiteEntity, AssessmentSubmission as AssessmentSubmissionEntity, AuditLog as AuditLogEntity, Notification as NotificationEntity, NotificationPreference as NotificationPreferenceEntity, SystemSettings as SystemSettingsEntity } from "../src/database/entities";
import { runSeed } from "../src/seed";

const AppDataSource = new DataSource({
  type: SETTINGS.APP_DB_TYPE,
  host: SETTINGS.APP_DB_HOST,
  port: Number(SETTINGS.APP_DB_PORT),
  username: SETTINGS.APP_DB_USERNAME,
  password: SETTINGS.APP_DB_PASSWORD,
  database: SETTINGS.APP_DB_DATABASE,
  synchronize: false,
  logging: false,
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

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding process...");
    
    console.log("📡 Initializing database connection...");
    await AppDataSource.initialize();
    
    console.log("✅ Database connected successfully!");
    
    console.log("🌱 Running seeders...");
    await runSeed();
    
    console.log("✅ Database seeding completed successfully!");
    
    await AppDataSource.destroy();
    console.log("🔌 Database connection closed.");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
