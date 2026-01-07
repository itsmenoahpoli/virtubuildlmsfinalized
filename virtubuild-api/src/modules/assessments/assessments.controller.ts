import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { AssessmentsService } from "./assessments.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class AssessmentsController extends BaseController {
	public assessmentsService: AssessmentsService;

	constructor() {
		super();
		this.assessmentsService = new AssessmentsService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /assessments/lab-activity/{labActivityId}:
	 *   get:
	 *     summary: Get assessments by lab activity
	 *     tags: [Assessments]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async getByLabActivityHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.assessmentsService.getByLabActivity(+request.params.labActivityId);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}

	/**
	 * @swagger
	 * /assessments:
	 *   get:
	 *     summary: List all assessments
	 *     tags: [Assessments]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async listAllHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.assessmentsService.listAll();
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}

	/**
	 * @swagger
	 * /assessments:
	 *   post:
	 *     summary: Create new assessment
	 *     tags: [Assessments]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async createHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.assessmentsService.create(request.body.labActivityId, request.body);
		return SendHttpResponse(response, result, HttpStatusCode.CREATED);
	}

	/**
	 * @swagger
	 * /assessments/{id}:
	 *   put:
	 *     summary: Update assessment
	 *     tags: [Assessments]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async updateHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.assessmentsService.update(+request.params.id, request.body);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}

	/**
	 * @swagger
	 * /assessments/{id}:
	 *   delete:
	 *     summary: Delete assessment
	 *     tags: [Assessments]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async deleteHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.assessmentsService.delete(+request.params.id);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}
}


