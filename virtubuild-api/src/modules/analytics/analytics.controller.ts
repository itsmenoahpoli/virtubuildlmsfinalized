import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { AnalyticsService } from "./analytics.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class AnalyticsController extends BaseController {
	public analyticsService: AnalyticsService;

	constructor() {
		super();
		this.analyticsService = new AnalyticsService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /api/analytics/me:
	 *   get:
	 *     summary: Get my performance analytics
	 *     description: Retrieve performance analytics for the authenticated user
	 *     tags: [Analytics]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Performance analytics retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 userId:
	 *                   type: integer
	 *                 totalActivities:
	 *                   type: integer
	 *                 completedActivities:
	 *                   type: integer
	 *                 averageScore:
	 *                   type: number
	 *                 timeSpent:
	 *                   type: integer
	 *                 trends:
	 *                   type: object
	 *                   properties:
	 *                     scoreImprovement:
	 *                       type: number
	 *                     timeReduction:
	 *                       type: number
	 *                     errorReduction:
	 *                       type: number
	 *       401:
	 *         $ref: '#/components/responses/UnauthorizedError'
	 */
	public async getMineHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const userId = (request as any).user?.user?.id as number;
		const result = await this.analyticsService.getForUser(userId);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}

	/**
	 * @swagger
	 * /api/analytics/dashboard:
	 *   get:
	 *     summary: Get analytics dashboard data
	 *     description: Retrieve comprehensive analytics data for the dashboard
	 *     tags: [Analytics]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - name: dateFrom
	 *         in: query
	 *         schema:
	 *           type: string
	 *           format: date
	 *         description: Start date for analytics (YYYY-MM-DD)
	 *       - name: dateTo
	 *         in: query
	 *         schema:
	 *           type: string
	 *           format: date
	 *         description: End date for analytics (YYYY-MM-DD)
	 *       - name: moduleId
	 *         in: query
	 *         schema:
	 *           type: integer
	 *         description: Filter by specific module
	 *     responses:
	 *       200:
	 *         description: Analytics dashboard data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 overview:
	 *                   type: object
	 *                   properties:
	 *                     totalUsers:
	 *                       type: integer
	 *                     activeUsers:
	 *                       type: integer
	 *                     totalModules:
	 *                       type: integer
	 *                     completedActivities:
	 *                       type: integer
	 *                 performance:
	 *                   type: object
	 *                   properties:
	 *                     averageScore:
	 *                       type: number
	 *                     completionRate:
	 *                       type: number
	 *                     timeSpent:
	 *                       type: number
	 *                 trends:
	 *                   type: array
	 *                   items:
	 *                     type: object
	 *                     properties:
	 *                       date:
	 *                         type: string
	 *                         format: date
	 *                       value:
	 *                         type: number
	 *       401:
	 *         $ref: '#/components/responses/UnauthorizedError'
	 */
	public async getDashboardHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.analyticsService.getDashboard();
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}
}


