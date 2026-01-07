import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { ActivitiesService } from "./activities.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class ActivitiesController extends BaseController {
	public activitiesService: ActivitiesService;

	constructor() {
		super();
		this.activitiesService = new ActivitiesService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /activities:
	 *   get:
	 *     summary: List all activities
	 *     tags: [Activities]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async listAllHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.activitiesService.listAll();
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}

	/**
	 * @swagger
	 * /activities/{id}:
	 *   get:
	 *     summary: Get activity by id
	 *     tags: [Activities]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async getByIdHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.activitiesService.getById(+request.params.id);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}

	/**
	 * @swagger
	 * /activities/{id}:
	 *   put:
	 *     summary: Update activity by id
	 *     tags: [Activities]
	 *     security:
	 *       - BearerAuth: []
	 */
	public async updateHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.activitiesService.update(+request.params.id, request.body);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}
}


