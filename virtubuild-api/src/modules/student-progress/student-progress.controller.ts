import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { StudentProgressService } from "./student-progress.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class StudentProgressController extends BaseController {
	public studentProgressService: StudentProgressService;

	constructor() {
		super();
		this.studentProgressService = new StudentProgressService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /student-progress/me:
	 *   get:
	 *     summary: Get my progress
	 *     description: Retrieve the current user's progress across all activities
	 *     tags: [Student Progress]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Student progress retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/StudentProgress'
	 *       500:
	 *         description: Internal server error
	 */
	public async getMyProgress(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const result = await this.studentProgressService.getStudentProgress(studentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting student progress:", error);
			this.sendHttpResponse(res, { error: "Failed to get student progress" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-progress/assigned-activities:
	 *   get:
	 *     summary: Get my assigned activities
	 *     description: Retrieve activities assigned to the current user based on their group memberships
	 *     tags: [Student Progress]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Assigned activities retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/LabActivity'
	 *       500:
	 *         description: Internal server error
	 */
	public async getAssignedActivities(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const result = await this.studentProgressService.getAssignedActivities(studentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting assigned activities:", error);
			this.sendHttpResponse(res, { error: "Failed to get assigned activities" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-progress/assigned-modules:
	 *   get:
	 *     summary: Get my assigned modules
	 *     description: Retrieve modules assigned to the current user based on their group memberships
	 *     tags: [Student Progress]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Assigned modules retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/Module'
	 *       500:
	 *         description: Internal server error
	 */
	public async getAssignedModules(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const result = await this.studentProgressService.getAssignedModules(studentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting assigned modules:", error);
			this.sendHttpResponse(res, { error: "Failed to get assigned modules" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-progress/submit:
	 *   post:
	 *     summary: Submit activity progress
	 *     description: Submit or update progress for a specific activity
	 *     tags: [Student Progress]
	 *     security:
	 *       - BearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - activityId
	 *             properties:
	 *               activityId:
	 *                 type: integer
	 *                 description: Activity ID
	 *               isCompleted:
	 *                 type: boolean
	 *                 description: Whether the activity is completed
	 *               score:
	 *                 type: number
	 *                 description: Score achieved
	 *               timeSpentSeconds:
	 *                 type: number
	 *                 description: Time spent in seconds
	 *               progressData:
	 *                 type: object
	 *                 description: Additional progress data
	 *               componentPlacements:
	 *                 type: object
	 *                 description: Component placement data
	 *     responses:
	 *       200:
	 *         description: Progress submitted successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/StudentProgress'
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	public async submitProgress(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const { activityId, ...progressData } = req.body;
			const result = await this.studentProgressService.submitProgress(studentId, activityId, progressData);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error submitting progress:", error);
			this.sendHttpResponse(res, { error: "Failed to submit progress" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-progress/activity/{activityId}:
	 *   get:
	 *     summary: Get progress for activity
	 *     description: Retrieve progress for a specific activity (instructor view)
	 *     tags: [Student Progress]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: activityId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Activity ID
	 *     responses:
	 *       200:
	 *         description: Activity progress retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/StudentProgress'
	 *       500:
	 *         description: Internal server error
	 */
	public async getProgressByActivity(req: Request, res: Response) {
		try {
			const result = await this.studentProgressService.getProgressByActivity(+req.params.activityId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting progress by activity:", error);
			this.sendHttpResponse(res, { error: "Failed to get progress by activity" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-progress/instructor/overview:
	 *   get:
	 *     summary: Get instructor student progress overview
	 *     description: Retrieve all student progress for instructor review
	 *     tags: [Student Progress]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Student progress overview retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/StudentProgress'
	 *       500:
	 *         description: Internal server error
	 */
	public async getInstructorOverview(req: Request, res: Response) {
		try {
			const result = await this.studentProgressService.getInstructorStudentProgress();
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting instructor overview:", error);
			this.sendHttpResponse(res, { error: "Failed to get instructor overview" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-progress/stats/me:
	 *   get:
	 *     summary: Get my completion stats
	 *     description: Retrieve completion statistics for the current user
	 *     tags: [Student Progress]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Completion stats retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 total:
	 *                   type: number
	 *                   description: Total activities
	 *                 completed:
	 *                   type: number
	 *                   description: Completed activities
	 *                 completionRate:
	 *                   type: number
	 *                   description: Completion rate percentage
	 *                 averageScore:
	 *                   type: number
	 *                   description: Average score
	 *       500:
	 *         description: Internal server error
	 */
	public async getMyStats(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const result = await this.studentProgressService.getStudentCompletionStats(studentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting completion stats:", error);
			this.sendHttpResponse(res, { error: "Failed to get completion stats" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}
}
