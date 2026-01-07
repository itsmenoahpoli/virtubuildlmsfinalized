import { Request, Response } from "express";
import { BaseController } from "../base.controller";
import { AdminService } from "./admin.service";
import { HttpStatusCode } from "@/types";
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

export class AdminController extends BaseController {
	private adminService: AdminService;

	constructor() {
		super();
		this.adminService = new AdminService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /admin/dashboard/stats:
	 *   get:
	 *     summary: Get dashboard statistics
	 *     description: Retrieve comprehensive dashboard statistics including user counts, module statistics, performance metrics, and recent activity
	 *     tags: [Admin]
	 *     parameters:
	 *       - in: query
	 *         name: period
	 *         schema:
	 *           type: string
	 *           enum: [week, month, year, all]
	 *         description: Time period for statistics filtering
	 *     responses:
	 *       200:
	 *         description: Dashboard statistics retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/DashboardStats'
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 */
	public async getDashboardStats(req: Request, res: Response) {
		try {
			const { period } = req.query;
			const stats = await this.adminService.getDashboardStats(period as string);
			this.sendHttpResponse(res, stats);
		} catch (error) {
			console.error("Error getting dashboard stats:", error);
			this.sendHttpResponse(res, { error: "Failed to get dashboard stats" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /admin/users:
	 *   get:
	 *     summary: Get all users
	 *     description: Retrieve a list of all users with their roles
	 *     tags: [Admin]
	 *     responses:
	 *       200:
	 *         description: Users retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/User'
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 */
	public async getAllUsers(req: Request, res: Response) {
		try {
			const users = await this.adminService.getAllUsers();
			this.sendHttpResponse(res, users);
		} catch (error) {
			console.error("Error getting users:", error);
			this.sendHttpResponse(res, { error: "Failed to get users" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /admin/users/{id}:
	 *   get:
	 *     summary: Get user by ID
	 *     description: Retrieve a specific user by their ID
	 *     tags: [Admin]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: User ID
	 *     responses:
	 *       200:
	 *         description: User retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 *       404:
	 *         description: User not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 */
	public async getUserById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const user = await this.adminService.getUserById(parseInt(id));
			if (!user) {
				this.sendHttpResponse(res, { error: "User not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, user);
		} catch (error) {
			console.error("Error getting user:", error);
			this.sendHttpResponse(res, { error: "Failed to get user" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /admin/users:
	 *   post:
	 *     summary: Create a new user
	 *     description: Create a new user with the provided data. Password will be automatically encrypted.
	 *     tags: [Admin]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required: [firstName, lastName, email, password]
	 *             properties:
	 *               userRoleId:
	 *                 type: integer
	 *                 description: User role ID
	 *               firstName:
	 *                 type: string
	 *                 description: User first name
	 *               middleName:
	 *                 type: string
	 *                 description: User middle name (optional)
	 *               lastName:
	 *                 type: string
	 *                 description: User last name
	 *               email:
	 *                 type: string
	 *                 format: email
	 *                 description: User email address
	 *               password:
	 *                 type: string
	 *                 description: User password
	 *               isEnabled:
	 *                 type: boolean
	 *                 description: Whether the user is enabled
	 *     responses:
	 *       201:
	 *         description: User created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 *       400:
	 *         description: Bad request - validation error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 */
	public async createUser(req: Request, res: Response) {
		try {
			const userData = req.body as UserDataDTO;
			const user = await this.adminService.createUser(userData);
			this.sendHttpResponse(res, user, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error creating user:", error);
			this.sendHttpResponse(res, { error: "Failed to create user" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /admin/users/{id}:
	 *   put:
	 *     summary: Update user
	 *     description: Update an existing user with the provided data. Password will be automatically encrypted if provided.
	 *     tags: [Admin]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: User ID
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserData'
	 *     responses:
	 *       200:
	 *         description: User updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 *       404:
	 *         description: User not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 *       400:
	 *         description: Bad request - validation error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 */
	public async updateUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const userData = req.body as Partial<UserDataDTO>;
			const user = await this.adminService.updateUser(parseInt(id), userData);
			if (!user) {
				this.sendHttpResponse(res, { error: "User not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, user);
		} catch (error) {
			console.error("Error updating user:", error);
			this.sendHttpResponse(res, { error: "Failed to update user" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /admin/users/{id}:
	 *   delete:
	 *     summary: Delete user
	 *     description: Delete a user by their ID
	 *     tags: [Admin]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: User ID
	 *     responses:
	 *       200:
	 *         description: User deleted successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *                   example: "User deleted successfully"
	 *       404:
	 *         description: User not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 */
	public async deleteUser(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await this.adminService.deleteUser(parseInt(id));
			if (!deleted) {
				this.sendHttpResponse(res, { error: "User not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, { message: "User deleted successfully" });
		} catch (error) {
			console.error("Error deleting user:", error);
			this.sendHttpResponse(res, { error: "Failed to delete user" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getAllUserRoles(req: Request, res: Response) {
		try {
			const userRoles = await this.adminService.getAllUserRoles();
			this.sendHttpResponse(res, userRoles);
		} catch (error) {
			console.error("Error getting user roles:", error);
			this.sendHttpResponse(res, { error: "Failed to get user roles" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getUserRoleById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const userRole = await this.adminService.getUserRoleById(parseInt(id));
			if (!userRole) {
				this.sendHttpResponse(res, { error: "User role not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, userRole);
		} catch (error) {
			console.error("Error getting user role:", error);
			this.sendHttpResponse(res, { error: "Failed to get user role" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async createUserRole(req: Request, res: Response) {
		try {
			const userRoleData = req.body as UserRoleDataDTO;
			const userRole = await this.adminService.createUserRole(userRoleData);
			this.sendHttpResponse(res, userRole, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error creating user role:", error);
			this.sendHttpResponse(res, { error: "Failed to create user role" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async updateUserRole(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const userRoleData = req.body as Partial<UserRoleDataDTO>;
			const userRole = await this.adminService.updateUserRole(parseInt(id), userRoleData);
			if (!userRole) {
				this.sendHttpResponse(res, { error: "User role not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, userRole);
		} catch (error) {
			console.error("Error updating user role:", error);
			this.sendHttpResponse(res, { error: "Failed to update user role" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async deleteUserRole(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await this.adminService.deleteUserRole(parseInt(id));
			if (!deleted) {
				this.sendHttpResponse(res, { error: "User role not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, { message: "User role deleted successfully" });
		} catch (error) {
			console.error("Error deleting user role:", error);
			this.sendHttpResponse(res, { error: "Failed to delete user role" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /admin/modules:
	 *   get:
	 *     summary: Get all modules
	 *     description: Retrieve a list of all modules
	 *     tags: [Admin]
	 *     responses:
	 *       200:
	 *         description: Modules retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/Module'
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 */
	public async getAllModules(req: Request, res: Response) {
		try {
			const modules = await this.adminService.getAllModules();
			this.sendHttpResponse(res, modules);
		} catch (error) {
			console.error("Error getting modules:", error);
			this.sendHttpResponse(res, { error: "Failed to get modules" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getModuleById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const module = await this.adminService.getModuleById(parseInt(id));
			if (!module) {
				this.sendHttpResponse(res, { error: "Module not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, module);
		} catch (error) {
			console.error("Error getting module:", error);
			this.sendHttpResponse(res, { error: "Failed to get module" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /admin/modules:
	 *   post:
	 *     summary: Create a new module
	 *     description: Create a new module with the provided data
	 *     tags: [Admin]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/ModuleData'
	 *     responses:
	 *       201:
	 *         description: Module created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Module'
	 *       400:
	 *         description: Bad request - validation error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 *       500:
	 *         description: Internal server error
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Error'
	 */
	public async createModule(req: Request, res: Response) {
		try {
			const moduleData = req.body as ModuleDataDTO;
			const module = await this.adminService.createModule(moduleData);
			this.sendHttpResponse(res, module, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error creating module:", error);
			this.sendHttpResponse(res, { error: "Failed to create module" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async updateModule(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const moduleData = req.body as Partial<ModuleDataDTO>;
			const module = await this.adminService.updateModule(parseInt(id), moduleData);
			if (!module) {
				this.sendHttpResponse(res, { error: "Module not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, module);
		} catch (error) {
			console.error("Error updating module:", error);
			this.sendHttpResponse(res, { error: "Failed to update module" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async deleteModule(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await this.adminService.deleteModule(parseInt(id));
			if (!deleted) {
				this.sendHttpResponse(res, { error: "Module not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, { message: "Module deleted successfully" });
		} catch (error) {
			console.error("Error deleting module:", error);
			this.sendHttpResponse(res, { error: "Failed to delete module" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getAllLabActivities(req: Request, res: Response) {
		try {
			const labActivities = await this.adminService.getAllLabActivities();
			this.sendHttpResponse(res, labActivities);
		} catch (error) {
			console.error("Error getting lab activities:", error);
			this.sendHttpResponse(res, { error: "Failed to get lab activities" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getLabActivityById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const labActivity = await this.adminService.getLabActivityById(parseInt(id));
			if (!labActivity) {
				this.sendHttpResponse(res, { error: "Lab activity not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, labActivity);
		} catch (error) {
			console.error("Error getting lab activity:", error);
			this.sendHttpResponse(res, { error: "Failed to get lab activity" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async createLabActivity(req: Request, res: Response) {
		try {
			const labActivityData = req.body as LabActivityDataDTO;
			const labActivity = await this.adminService.createLabActivity(labActivityData);
			this.sendHttpResponse(res, labActivity, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error creating lab activity:", error);
			this.sendHttpResponse(res, { error: "Failed to create lab activity" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async updateLabActivity(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const labActivityData = req.body as Partial<LabActivityDataDTO>;
			const labActivity = await this.adminService.updateLabActivity(parseInt(id), labActivityData);
			if (!labActivity) {
				this.sendHttpResponse(res, { error: "Lab activity not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, labActivity);
		} catch (error) {
			console.error("Error updating lab activity:", error);
			this.sendHttpResponse(res, { error: "Failed to update lab activity" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async deleteLabActivity(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await this.adminService.deleteLabActivity(parseInt(id));
			if (!deleted) {
				this.sendHttpResponse(res, { error: "Lab activity not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, { message: "Lab activity deleted successfully" });
		} catch (error) {
			console.error("Error deleting lab activity:", error);
			this.sendHttpResponse(res, { error: "Failed to delete lab activity" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}



	public async getAllAssessments(req: Request, res: Response) {
		try {
			const assessments = await this.adminService.getAllAssessments();
			this.sendHttpResponse(res, assessments);
		} catch (error) {
			console.error("Error getting assessments:", error);
			this.sendHttpResponse(res, { error: "Failed to get assessments" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getAssessmentById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const assessment = await this.adminService.getAssessmentById(parseInt(id));
			if (!assessment) {
				this.sendHttpResponse(res, { error: "Assessment not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, assessment);
		} catch (error) {
			console.error("Error getting assessment:", error);
			this.sendHttpResponse(res, { error: "Failed to get assessment" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getAssessmentSubmissions(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const submissions = await this.adminService.getAssessmentSubmissions(parseInt(id));
			this.sendHttpResponse(res, submissions);
		} catch (error) {
			console.error("Error getting assessment submissions:", error);
			this.sendHttpResponse(res, { error: "Failed to get assessment submissions" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async createAssessment(req: Request, res: Response) {
		try {
			const assessmentData = req.body as AssessmentDataDTO;
			const assessment = await this.adminService.createAssessment(assessmentData);
			this.sendHttpResponse(res, assessment, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error creating assessment:", error);
			this.sendHttpResponse(res, { error: "Failed to create assessment" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async updateAssessment(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const assessmentData = req.body as Partial<AssessmentDataDTO>;
			const assessment = await this.adminService.updateAssessment(parseInt(id), assessmentData);
			if (!assessment) {
				this.sendHttpResponse(res, { error: "Assessment not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, assessment);
		} catch (error) {
			console.error("Error updating assessment:", error);
			this.sendHttpResponse(res, { error: "Failed to update assessment" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async deleteAssessment(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await this.adminService.deleteAssessment(parseInt(id));
			if (!deleted) {
				this.sendHttpResponse(res, { error: "Assessment not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, { message: "Assessment deleted successfully" });
		} catch (error) {
			console.error("Error deleting assessment:", error);
			this.sendHttpResponse(res, { error: "Failed to delete assessment" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getAllGrades(req: Request, res: Response) {
		try {
			const grades = await this.adminService.getAllGrades();
			this.sendHttpResponse(res, grades);
		} catch (error) {
			console.error("Error getting grades:", error);
			this.sendHttpResponse(res, { error: "Failed to get grades" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getGradeById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const grade = await this.adminService.getGradeById(parseInt(id));
			if (!grade) {
				this.sendHttpResponse(res, { error: "Grade not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, grade);
		} catch (error) {
			console.error("Error getting grade:", error);
			this.sendHttpResponse(res, { error: "Failed to get grade" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async createGrade(req: Request, res: Response) {
		try {
			const gradeData = req.body as GradeDataDTO;
			const grade = await this.adminService.createGrade(gradeData);
			this.sendHttpResponse(res, grade, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error creating grade:", error);
			this.sendHttpResponse(res, { error: "Failed to create grade" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async updateGrade(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const gradeData = req.body as Partial<GradeDataDTO>;
			const grade = await this.adminService.updateGrade(parseInt(id), gradeData);
			if (!grade) {
				this.sendHttpResponse(res, { error: "Grade not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, grade);
		} catch (error) {
			console.error("Error updating grade:", error);
			this.sendHttpResponse(res, { error: "Failed to update grade" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async deleteGrade(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await this.adminService.deleteGrade(parseInt(id));
			if (!deleted) {
				this.sendHttpResponse(res, { error: "Grade not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, { message: "Grade deleted successfully" });
		} catch (error) {
			console.error("Error deleting grade:", error);
			this.sendHttpResponse(res, { error: "Failed to delete grade" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getAllPerformanceAnalytics(req: Request, res: Response) {
		try {
			const performanceAnalytics = await this.adminService.getAllPerformanceAnalytics();
			this.sendHttpResponse(res, performanceAnalytics);
		} catch (error) {
			console.error("Error getting performance analytics:", error);
			this.sendHttpResponse(res, { error: "Failed to get performance analytics" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getPerformanceAnalyticsById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const performanceAnalytics = await this.adminService.getPerformanceAnalyticsById(parseInt(id));
			if (!performanceAnalytics) {
				this.sendHttpResponse(res, { error: "Performance analytics not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, performanceAnalytics);
		} catch (error) {
			console.error("Error getting performance analytics:", error);
			this.sendHttpResponse(res, { error: "Failed to get performance analytics" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async createPerformanceAnalytics(req: Request, res: Response) {
		try {
			const performanceAnalyticsData = req.body as PerformanceAnalyticsDataDTO;
			const performanceAnalytics = await this.adminService.createPerformanceAnalytics(performanceAnalyticsData);
			this.sendHttpResponse(res, performanceAnalytics, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error creating performance analytics:", error);
			this.sendHttpResponse(res, { error: "Failed to create performance analytics" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async updatePerformanceAnalytics(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const performanceAnalyticsData = req.body as Partial<PerformanceAnalyticsDataDTO>;
			const performanceAnalytics = await this.adminService.updatePerformanceAnalytics(parseInt(id), performanceAnalyticsData);
			if (!performanceAnalytics) {
				this.sendHttpResponse(res, { error: "Performance analytics not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, performanceAnalytics);
		} catch (error) {
			console.error("Error updating performance analytics:", error);
			this.sendHttpResponse(res, { error: "Failed to update performance analytics" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async deletePerformanceAnalytics(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await this.adminService.deletePerformanceAnalytics(parseInt(id));
			if (!deleted) {
				this.sendHttpResponse(res, { error: "Performance analytics not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, { message: "Performance analytics deleted successfully" });
		} catch (error) {
			console.error("Error deleting performance analytics:", error);
			this.sendHttpResponse(res, { error: "Failed to delete performance analytics" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getAllModuleActivations(req: Request, res: Response) {
		try {
			const moduleActivations = await this.adminService.getAllModuleActivations();
			this.sendHttpResponse(res, moduleActivations);
		} catch (error) {
			console.error("Error getting module activations:", error);
			this.sendHttpResponse(res, { error: "Failed to get module activations" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async getModuleActivationById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const moduleActivation = await this.adminService.getModuleActivationById(parseInt(id));
			if (!moduleActivation) {
				this.sendHttpResponse(res, { error: "Module activation not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, moduleActivation);
		} catch (error) {
			console.error("Error getting module activation:", error);
			this.sendHttpResponse(res, { error: "Failed to get module activation" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async createModuleActivation(req: Request, res: Response) {
		try {
			const moduleActivationData = req.body as ModuleActivationDataDTO;
			const moduleActivation = await this.adminService.createModuleActivation(moduleActivationData);
			this.sendHttpResponse(res, moduleActivation, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error creating module activation:", error);
			this.sendHttpResponse(res, { error: "Failed to create module activation" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async updateModuleActivation(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const moduleActivationData = req.body as Partial<ModuleActivationDataDTO>;
			const moduleActivation = await this.adminService.updateModuleActivation(parseInt(id), moduleActivationData);
			if (!moduleActivation) {
				this.sendHttpResponse(res, { error: "Module activation not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, moduleActivation);
		} catch (error) {
			console.error("Error updating module activation:", error);
			this.sendHttpResponse(res, { error: "Failed to update module activation" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	public async deleteModuleActivation(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const deleted = await this.adminService.deleteModuleActivation(parseInt(id));
			if (!deleted) {
				this.sendHttpResponse(res, { error: "Module activation not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, { message: "Module activation deleted successfully" });
		} catch (error) {
			console.error("Error deleting module activation:", error);
			this.sendHttpResponse(res, { error: "Failed to delete module activation" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}
}
