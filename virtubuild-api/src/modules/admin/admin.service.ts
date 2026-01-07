import { 
	usersRepository, 
	userRolesRepository, 
	modulesRepository, 
	labActivitiesRepository,
	assessmentsRepository, 
	assessmentSubmissionsRepository,
	gradesRepository, 
	performanceAnalyticsRepository, 
	moduleActivationsRepository,
	UserEntity,
	UserRoleEntity,
	ModuleEntity,
	LabActivityEntity,
	AssessmentEntity,
	AssessmentSubmissionEntity,
	GradeEntity,
	PerformanceAnalyticsEntity,
	ModuleActivationEntity
} from "@/database";
import { 
	UserDataDTO, 
	UserRoleDataDTO, 
	ModuleDataDTO, 
	LabActivityDataDTO, 
	AssessmentDataDTO, 
	GradeDataDTO, 
	PerformanceAnalyticsDataDTO, 
	ModuleActivationDataDTO,
	DashboardStatsDTO
} from "./admin.dto";
import { encryptPassword } from "@/utils";

export class AdminService {
	public async getAllUsers(): Promise<UserEntity[]> {
		return await usersRepository.find({
			relations: ["userRole"],
			order: { createdAt: "DESC" }
		});
	}

	public async getUserById(id: number): Promise<UserEntity | null> {
		return await usersRepository.findOne({
			where: { id },
			relations: ["userRole"]
		});
	}

	public async createUser(data: UserDataDTO): Promise<UserEntity> {
		const user = usersRepository.create({
			...data,
			password: await encryptPassword(data.password),
		});
		return await usersRepository.save(user);
	}

	public async updateUser(id: number, data: Partial<UserDataDTO>): Promise<UserEntity | null> {
		const user = await usersRepository.findOne({ where: { id } });
		if (!user) return null;

		if (data.password) {
			data.password = await encryptPassword(data.password);
		}

		Object.assign(user, data);
		return await usersRepository.save(user);
	}

	public async deleteUser(id: number): Promise<boolean> {
		const result = await usersRepository.delete(id);
		return result.affected !== 0;
	}

	public async getAllUserRoles(): Promise<UserRoleEntity[]> {
		return await userRolesRepository.find({
			order: { createdAt: "DESC" }
		});
	}

	public async getUserRoleById(id: number): Promise<UserRoleEntity | null> {
		return await userRolesRepository.findOne({ where: { id } });
	}

	public async createUserRole(data: UserRoleDataDTO): Promise<UserRoleEntity> {
		const userRole = userRolesRepository.create(data);
		return await userRolesRepository.save(userRole);
	}

	public async updateUserRole(id: number, data: Partial<UserRoleDataDTO>): Promise<UserRoleEntity | null> {
		const userRole = await userRolesRepository.findOne({ where: { id } });
		if (!userRole) return null;

		Object.assign(userRole, data);
		return await userRolesRepository.save(userRole);
	}

	public async deleteUserRole(id: number): Promise<boolean> {
		const result = await userRolesRepository.delete(id);
		return result.affected !== 0;
	}

	public async getAllModules(): Promise<ModuleEntity[]> {
		return await modulesRepository.find({
			order: { createdAt: "DESC" }
		});
	}

	public async getModuleById(id: number): Promise<ModuleEntity | null> {
		return await modulesRepository.findOne({ where: { id } });
	}

	public async createModule(data: ModuleDataDTO): Promise<ModuleEntity> {
		const module = modulesRepository.create(data);
		return await modulesRepository.save(module);
	}

	public async updateModule(id: number, data: Partial<ModuleDataDTO>): Promise<ModuleEntity | null> {
		const module = await modulesRepository.findOne({ where: { id } });
		if (!module) return null;

		Object.assign(module, data);
		return await modulesRepository.save(module);
	}

	public async deleteModule(id: number): Promise<boolean> {
		const result = await modulesRepository.delete(id);
		return result.affected !== 0;
	}

	public async getAllLabActivities(): Promise<LabActivityEntity[]> {
		try {
			console.log("Fetching lab activities...");
			const result = await labActivitiesRepository.find({
				order: { createdAt: "DESC" }
			});
			console.log("Found lab activities:", result.length);
			return result;
		} catch (error) {
			console.error("Error fetching lab activities:", error);
			return [];
		}
	}

	public async getLabActivityById(id: number): Promise<LabActivityEntity | null> {
		return await labActivitiesRepository.findOne({
			where: { id },
			relations: ["module"]
		});
	}

	public async createLabActivity(data: LabActivityDataDTO): Promise<LabActivityEntity> {
		const labActivity = labActivitiesRepository.create(data);
		return await labActivitiesRepository.save(labActivity);
	}

	public async updateLabActivity(id: number, data: Partial<LabActivityDataDTO>): Promise<LabActivityEntity | null> {
		const labActivity = await labActivitiesRepository.findOne({ where: { id } });
		if (!labActivity) return null;

		Object.assign(labActivity, data);
		return await labActivitiesRepository.save(labActivity);
	}

	public async deleteLabActivity(id: number): Promise<boolean> {
		const result = await labActivitiesRepository.delete(id);
		return result.affected !== 0;
	}


	public async getAllAssessments(): Promise<any[]> {
		try {
			const assessments = await assessmentsRepository.find({
				order: { createdAt: "DESC" },
				relations: ["assessmentSubmissions", "assessmentSubmissions.student"]
			});

			// Transform the data to include submission counts and basic submission info
			return assessments.map(assessment => ({
				...assessment,
				submissionCount: assessment.assessmentSubmissions?.length || 0,
				hasSubmissions: (assessment.assessmentSubmissions?.length || 0) > 0,
				recentSubmissions: assessment.assessmentSubmissions?.slice(0, 3).map((sub: AssessmentSubmissionEntity) => ({
					id: sub.id,
					score: sub.score,
					timeSpentSeconds: sub.timeSpentSeconds,
					isSubmitted: sub.isSubmitted,
					submittedAt: sub.submittedAt,
					student: sub.student ? {
						firstName: sub.student.firstName,
						lastName: sub.student.lastName,
						email: sub.student.email
					} : null
				})) || []
			}));
		} catch (error) {
			console.error("Error fetching assessments:", error);
			return [];
		}
	}

	public async getAssessmentById(id: number): Promise<AssessmentEntity | null> {
		return await assessmentsRepository.findOne({
			where: { id },
			relations: ["labActivity"]
		});
	}

	public async getAssessmentSubmissions(assessmentId: number): Promise<any[]> {
		try {
			const submissions = await assessmentSubmissionsRepository.find({
				where: { assessmentId },
				relations: ["student", "assessment"],
				order: { submittedAt: "DESC" }
			});

			return submissions.map((submission: AssessmentSubmissionEntity) => ({
				id: submission.id,
				score: submission.score,
				timeSpentSeconds: submission.timeSpentSeconds,
				isSubmitted: submission.isSubmitted,
				submittedAt: submission.submittedAt,
				answers: submission.answers,
				feedback: submission.feedback,
				student: submission.student ? {
					id: submission.student.id,
					firstName: submission.student.firstName,
					lastName: submission.student.lastName,
					email: submission.student.email
				} : null,
				assessment: submission.assessment ? {
					id: submission.assessment.id,
					title: submission.assessment.title,
					questions: submission.assessment.questions
				} : null
			}));
		} catch (error) {
			console.error("Error fetching assessment submissions:", error);
			return [];
		}
	}

	public async createAssessment(data: AssessmentDataDTO): Promise<AssessmentEntity> {
		const assessment = assessmentsRepository.create(data);
		return await assessmentsRepository.save(assessment);
	}

	public async updateAssessment(id: number, data: Partial<AssessmentDataDTO>): Promise<AssessmentEntity | null> {
		const assessment = await assessmentsRepository.findOne({ where: { id } });
		if (!assessment) return null;

		Object.assign(assessment, data);
		return await assessmentsRepository.save(assessment);
	}

	public async deleteAssessment(id: number): Promise<boolean> {
		const result = await assessmentsRepository.delete(id);
		return result.affected !== 0;
	}

	public async getAllGrades(): Promise<GradeEntity[]> {
		return await gradesRepository.find({
			relations: ["user", "activity"],
			order: { createdAt: "DESC" }
		});
	}

	public async getGradeById(id: number): Promise<GradeEntity | null> {
		return await gradesRepository.findOne({
			where: { id },
			relations: ["user", "activity"]
		});
	}

	public async createGrade(data: GradeDataDTO): Promise<GradeEntity> {
		const grade = gradesRepository.create(data);
		return await gradesRepository.save(grade);
	}

	public async updateGrade(id: number, data: Partial<GradeDataDTO>): Promise<GradeEntity | null> {
		const grade = await gradesRepository.findOne({ where: { id } });
		if (!grade) return null;

		Object.assign(grade, data);
		return await gradesRepository.save(grade);
	}

	public async deleteGrade(id: number): Promise<boolean> {
		const result = await gradesRepository.delete(id);
		return result.affected !== 0;
	}

	public async getAllPerformanceAnalytics(): Promise<PerformanceAnalyticsEntity[]> {
		return await performanceAnalyticsRepository.find({
			relations: ["user", "activity"],
			order: { createdAt: "DESC" }
		});
	}

	public async getPerformanceAnalyticsById(id: number): Promise<PerformanceAnalyticsEntity | null> {
		return await performanceAnalyticsRepository.findOne({
			where: { id },
			relations: ["user", "activity"]
		});
	}

	public async createPerformanceAnalytics(data: PerformanceAnalyticsDataDTO): Promise<PerformanceAnalyticsEntity> {
		const performanceAnalytics = performanceAnalyticsRepository.create(data);
		return await performanceAnalyticsRepository.save(performanceAnalytics);
	}

	public async updatePerformanceAnalytics(id: number, data: Partial<PerformanceAnalyticsDataDTO>): Promise<PerformanceAnalyticsEntity | null> {
		const performanceAnalytics = await performanceAnalyticsRepository.findOne({ where: { id } });
		if (!performanceAnalytics) return null;

		Object.assign(performanceAnalytics, data);
		return await performanceAnalyticsRepository.save(performanceAnalytics);
	}

	public async deletePerformanceAnalytics(id: number): Promise<boolean> {
		const result = await performanceAnalyticsRepository.delete(id);
		return result.affected !== 0;
	}

	public async getAllModuleActivations(): Promise<ModuleActivationEntity[]> {
		return await moduleActivationsRepository.find({
			relations: ["module"],
			order: { createdAt: "DESC" }
		});
	}

	public async getModuleActivationById(id: number): Promise<ModuleActivationEntity | null> {
		return await moduleActivationsRepository.findOne({
			where: { id },
			relations: ["module"]
		});
	}

	public async createModuleActivation(data: ModuleActivationDataDTO): Promise<ModuleActivationEntity> {
		const moduleActivation = moduleActivationsRepository.create(data);
		return await moduleActivationsRepository.save(moduleActivation);
	}

	public async updateModuleActivation(id: number, data: Partial<ModuleActivationDataDTO>): Promise<ModuleActivationEntity | null> {
		const moduleActivation = await moduleActivationsRepository.findOne({ where: { id } });
		if (!moduleActivation) return null;

		Object.assign(moduleActivation, data);
		return await moduleActivationsRepository.save(moduleActivation);
	}

	public async deleteModuleActivation(id: number): Promise<boolean> {
		const result = await moduleActivationsRepository.delete(id);
		return result.affected !== 0;
	}

	public async getDashboardStats(period?: string) {
		try {
			const [
				totalUsers,
				activeUsers,
				totalModules,
				totalActivities,
				totalAssessments,
				totalGrades
			] = await Promise.all([
				usersRepository.count().catch(() => 0),
				usersRepository.count({ where: { isEnabled: true } }).catch(() => 0),
				modulesRepository.count().catch(() => 0),
				labActivitiesRepository.count().catch(() => 0),
				assessmentsRepository.count().catch(() => 0),
				gradesRepository.count().catch(() => 0)
			]);

			const averageGrade = await gradesRepository
				.createQueryBuilder("grade")
				.select("AVG(grade.score)", "average")
				.getRawOne()
				.catch(() => ({ average: "0" }));

			return {
				overview: {
					totalUsers: totalUsers || 0,
					activeUsers: activeUsers || 0,
					totalModules: totalModules || 0,
					activeModules: totalModules || 0,
					totalActivities: totalActivities || 0,
					activeActivities: totalActivities || 0,
					totalAssessments: totalAssessments || 0,
					activeAssessments: totalAssessments || 0,
					totalGrades: totalGrades || 0,
					averageGrade: parseFloat(averageGrade?.average || "0"),
					totalAnalytics: 0,
					averageTimeSpent: 0,
					totalActivations: 0,
					activeActivations: 0
				},
				recentActivity: {
					recentUsers: [],
					recentGrades: []
				},
				topPerformers: [],
				period: period || 'all'
			};
		} catch (error) {
			console.error("Error in getDashboardStats:", error);
			throw error;
		}
	}
}
