import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { GradesService } from "./grades.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class GradesController extends BaseController {
	public gradesService: GradesService;

	constructor() {
		super();
		this.gradesService = new GradesService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /grades/me:
	 *   get:
	 *     summary: Get my grades
	 *     tags: [Grades]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async listMineHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const userId = (request as any).user?.user?.id as number;
		const result = await this.gradesService.listForUser(userId);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}

	/**
	 * @swagger
	 * /grades/activity/{activityId}:
	 *   get:
	 *     summary: Get grades for activity (instructor)
	 *     tags: [Grades]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async listForActivityHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.gradesService.listForActivity(+request.params.activityId);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}
}


