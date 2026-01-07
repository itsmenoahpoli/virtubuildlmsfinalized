import { DataSource, Repository, type DataSourceOptions } from "typeorm";
import { User as UserEntity, UserRole as UserRoleEntity, Module as ModuleEntity, LabActivity as LabActivityEntity, Assessment as AssessmentEntity, Grade as GradeEntity, PerformanceAnalytics as PerformanceAnalyticsEntity, ModuleActivation as ModuleActivationEntity, StudentGroup as StudentGroupEntity, StudentGroupAssignment as StudentGroupAssignmentEntity, StudentProgress as StudentProgressEntity, Simulation as SimulationEntity, ModulePrerequisite as ModulePrerequisiteEntity, AssessmentSubmission as AssessmentSubmissionEntity, AuditLog as AuditLogEntity, Notification as NotificationEntity, NotificationPreference as NotificationPreferenceEntity, SystemSettings as SystemSettingsEntity } from "./entities";
import { SETTINGS } from "@/configs";

const createDatabaseIfNotExists = async () => {
  const tempDataSource = new DataSource({
    type: SETTINGS.APP_DB_TYPE,
    host: SETTINGS.APP_DB_HOST,
    port: Number(SETTINGS.APP_DB_PORT),
    username: SETTINGS.APP_DB_USERNAME,
    password: SETTINGS.APP_DB_PASSWORD,
    database: SETTINGS.APP_DB_TYPE,
    extra: {
      charset: "utf8mb4",
    },
  } as DataSourceOptions);

  try {
    await tempDataSource.initialize();
    await tempDataSource.query(`CREATE DATABASE ${SETTINGS.APP_DB_DATABASE}`);
    await tempDataSource.destroy();
  } catch (error: any) {
    if (error.code !== "42P04") {
      console.error("Error creating database:", error);
    }
  }
};

const DBDataSource = new DataSource({
  type: SETTINGS.APP_DB_TYPE,
  host: SETTINGS.APP_DB_HOST,
  port: Number(SETTINGS.APP_DB_PORT),
  username: SETTINGS.APP_DB_USERNAME,
  password: SETTINGS.APP_DB_PASSWORD,
  database: SETTINGS.APP_DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [UserEntity, UserRoleEntity, ModuleEntity, LabActivityEntity, AssessmentEntity, GradeEntity, PerformanceAnalyticsEntity, ModuleActivationEntity, StudentGroupEntity, StudentGroupAssignmentEntity, StudentProgressEntity, SimulationEntity, ModulePrerequisiteEntity, AssessmentSubmissionEntity, AuditLogEntity, NotificationEntity, NotificationPreferenceEntity, SystemSettingsEntity],
  migrations: [__dirname + "/migrations/*.migration.ts"],
  subscribers: [],
  extra: {
    charset: "utf8mb4",
  },
} as DataSourceOptions);

let usersRepository: Repository<UserEntity>;
let userRolesRepository: Repository<UserRoleEntity>;
let modulesRepository: Repository<ModuleEntity>;
let labActivitiesRepository: Repository<LabActivityEntity>;
let assessmentsRepository: Repository<AssessmentEntity>;
let gradesRepository: Repository<GradeEntity>;
let performanceAnalyticsRepository: Repository<PerformanceAnalyticsEntity>;
let moduleActivationsRepository: Repository<ModuleActivationEntity>;
let studentGroupsRepository: Repository<StudentGroupEntity>;
let studentGroupAssignmentsRepository: Repository<StudentGroupAssignmentEntity>;
let studentProgressRepository: Repository<StudentProgressEntity>;
let simulationsRepository: Repository<SimulationEntity>;
let modulePrerequisitesRepository: Repository<ModulePrerequisiteEntity>;
let assessmentSubmissionsRepository: Repository<AssessmentSubmissionEntity>;
let auditLogsRepository: Repository<AuditLogEntity>;
let notificationsRepository: Repository<NotificationEntity>;
let notificationPreferencesRepository: Repository<NotificationPreferenceEntity>;
let systemSettingsRepository: Repository<SystemSettingsEntity>;

const initializeDatabase = async () => {
  await createDatabaseIfNotExists();

  return DBDataSource.initialize()
    .then(() => {
      console.info("Database successfully synced!");
      usersRepository = DBDataSource.getRepository(UserEntity);
      userRolesRepository = DBDataSource.getRepository(UserRoleEntity);
      modulesRepository = DBDataSource.getRepository(ModuleEntity);
      labActivitiesRepository = DBDataSource.getRepository(LabActivityEntity);
      assessmentsRepository = DBDataSource.getRepository(AssessmentEntity);
      gradesRepository = DBDataSource.getRepository(GradeEntity);
      performanceAnalyticsRepository = DBDataSource.getRepository(PerformanceAnalyticsEntity);
      moduleActivationsRepository = DBDataSource.getRepository(ModuleActivationEntity);
      studentGroupsRepository = DBDataSource.getRepository(StudentGroupEntity);
      studentGroupAssignmentsRepository = DBDataSource.getRepository(StudentGroupAssignmentEntity);
      studentProgressRepository = DBDataSource.getRepository(StudentProgressEntity);
      simulationsRepository = DBDataSource.getRepository(SimulationEntity);
      modulePrerequisitesRepository = DBDataSource.getRepository(ModulePrerequisiteEntity);
      assessmentSubmissionsRepository = DBDataSource.getRepository(AssessmentSubmissionEntity);
      auditLogsRepository = DBDataSource.getRepository(AuditLogEntity);
      notificationsRepository = DBDataSource.getRepository(NotificationEntity);
      notificationPreferencesRepository = DBDataSource.getRepository(NotificationPreferenceEntity);
      systemSettingsRepository = DBDataSource.getRepository(SystemSettingsEntity);
    })
    .catch((error) => {
      console.error("Failed to sync database");
      console.error(error);
    });
};

export {
  DBDataSource,
  initializeDatabase,
  usersRepository,
  UserEntity,
  userRolesRepository,
  UserRoleEntity,
  modulesRepository,
  ModuleEntity,
  labActivitiesRepository,
  LabActivityEntity,
  assessmentsRepository,
  AssessmentEntity,
  gradesRepository,
  GradeEntity,
  performanceAnalyticsRepository,
  PerformanceAnalyticsEntity,
  moduleActivationsRepository,
  ModuleActivationEntity,
  studentGroupsRepository,
  StudentGroupEntity,
  studentGroupAssignmentsRepository,
  StudentGroupAssignmentEntity,
  studentProgressRepository,
  StudentProgressEntity,
  simulationsRepository,
  SimulationEntity,
  modulePrerequisitesRepository,
  ModulePrerequisiteEntity,
  assessmentSubmissionsRepository,
  AssessmentSubmissionEntity,
  auditLogsRepository,
  AuditLogEntity,
  notificationsRepository,
  NotificationEntity,
  notificationPreferencesRepository,
  NotificationPreferenceEntity,
  systemSettingsRepository,
  SystemSettingsEntity,
};
