import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { AssessmentSubmissionsService } from "./assessment-submissions.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class AssessmentSubmissionsController extends BaseController {
	public assessmentSubmissionsService: AssessmentSubmissionsService;

	constructor() {
		super();
		this.assessmentSubmissionsService = new AssessmentSubmissionsService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /assessment-submissions/submit:
	 *   post:
	 *     summary: Submit assessment
	 *     description: Submit answers for a post-lab assessment
	 *     tags: [Assessment Submissions]
	 *     security:
	 *       - BearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - assessmentId
	 *               - answers
	 *             properties:
	 *               assessmentId:
	 *                 type: integer
	 *                 description: Assessment ID
	 *               answers:
	 *                 type: object
	 *                 description: Student's answers
	 *               timeSpentSeconds:
	 *                 type: number
	 *                 description: Time spent on assessment
	 *     responses:
	 *       200:
	 *         description: Assessment submitted successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/AssessmentSubmission'
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	public async submitAssessment(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const { assessmentId, ...submissionData } = req.body;
			const result = await this.assessmentSubmissionsService.submitAssessment(studentId, assessmentId, submissionData);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error submitting assessment:", error);
			this.sendHttpResponse(res, { error: "Failed to submit assessment" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /assessment-submissions/me:
	 *   get:
	 *     summary: Get my assessment submissions
	 *     description: Retrieve all assessment submissions for the current user
	 *     tags: [Assessment Submissions]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Assessment submissions retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/AssessmentSubmission'
	 *       500:
	 *         description: Internal server error
	 */
	public async getMySubmissions(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const result = await this.assessmentSubmissionsService.getStudentSubmissions(studentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting assessment submissions:", error);
			this.sendHttpResponse(res, { error: "Failed to get assessment submissions" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /assessment-submissions/history/me:
	 *   get:
	 *     summary: Get my assessment history
	 *     description: Retrieve assessment history for the current user
	 *     tags: [Assessment Submissions]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Assessment history retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 type: object
	 *                 properties:
	 *                   id:
	 *                     type: number
	 *                   assessmentId:
	 *                     type: number
	 *                   assessmentTitle:
	 *                     type: string
	 *                   score:
	 *                     type: number
	 *                   timeSpent:
	 *                     type: number
	 *                   isSubmitted:
	 *                     type: boolean
	 *                   feedback:
	 *                     type: object
	 *                   submittedAt:
	 *                     type: string
	 *                     format: date-time
	 *       500:
	 *         description: Internal server error
	 */
	public async getMyHistory(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const result = await this.assessmentSubmissionsService.getStudentAssessmentHistory(studentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting assessment history:", error);
			this.sendHttpResponse(res, { error: "Failed to get assessment history" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /assessment-submissions/{id}:
	 *   get:
	 *     summary: Get submission by ID
	 *     description: Retrieve a specific assessment submission
	 *     tags: [Assessment Submissions]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Submission ID
	 *     responses:
	 *       200:
	 *         description: Assessment submission retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/AssessmentSubmission'
	 *       404:
	 *         description: Submission not found
	 *       500:
	 *         description: Internal server error
	 */
	public async getSubmissionById(req: Request, res: Response) {
		try {
			const result = await this.assessmentSubmissionsService.getSubmissionById(+req.params.id);
			if (!result) {
				this.sendHttpResponse(res, { error: "Submission not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting submission:", error);
			this.sendHttpResponse(res, { error: "Failed to get submission" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /assessment-submissions/assessment/{assessmentId}:
	 *   get:
	 *     summary: Get submissions for assessment
	 *     description: Retrieve all submissions for a specific assessment (instructor view)
	 *     tags: [Assessment Submissions]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: assessmentId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Assessment ID
	 *     responses:
	 *       200:
	 *         description: Assessment submissions retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/AssessmentSubmission'
	 *       500:
	 *         description: Internal server error
	 */
	public async getSubmissionsByAssessment(req: Request, res: Response) {
		try {
			const result = await this.assessmentSubmissionsService.getSubmissionsByAssessment(+req.params.assessmentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting submissions by assessment:", error);
			this.sendHttpResponse(res, { error: "Failed to get submissions by assessment" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /assessment-submissions/{id}/feedback:
	 *   post:
	 *     summary: Add feedback to submission
	 *     description: Add instructor feedback to an assessment submission
	 *     tags: [Assessment Submissions]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Submission ID
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - feedback
	 *             properties:
	 *               feedback:
	 *                 type: object
	 *                 description: Instructor feedback
	 *     responses:
	 *       200:
	 *         description: Feedback added successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/AssessmentSubmission'
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	public async addFeedback(req: Request, res: Response) {
		try {
			const result = await this.assessmentSubmissionsService.addFeedback(+req.params.id, req.body.feedback);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error adding feedback:", error);
			this.sendHttpResponse(res, { error: "Failed to add feedback" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /assessment-submissions/results/{assessmentId}:
	 *   get:
	 *     summary: Get assessment results
	 *     description: Retrieve comprehensive results and statistics for an assessment
	 *     tags: [Assessment Submissions]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: assessmentId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Assessment ID
	 *     responses:
	 *       200:
	 *         description: Assessment results retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 submissions:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/AssessmentSubmission'
	 *                 stats:
	 *                   type: object
	 *                   properties:
	 *                     totalSubmissions:
	 *                       type: number
	 *                     averageScore:
	 *                       type: number
	 *                     averageTimeSpent:
	 *                       type: number
	 *                     completionRate:
	 *                       type: number
	 *       500:
	 *         description: Internal server error
	 */
	public async getAssessmentResults(req: Request, res: Response) {
		try {
			const result = await this.assessmentSubmissionsService.getAssessmentResults(+req.params.assessmentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting assessment results:", error);
			this.sendHttpResponse(res, { error: "Failed to get assessment results" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}
}
