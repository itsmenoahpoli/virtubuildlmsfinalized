import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { ActivationsService } from "./activations.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class ActivationsController extends BaseController {
	public activationsService: ActivationsService;

	constructor() {
		super();
		this.activationsService = new ActivationsService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /api/activations/module/{moduleId}:
	 *   get:
	 *     summary: List activations by module
	 *     description: Retrieve all activations for a specific module
	 *     tags: [Activations]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: moduleId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Module ID
	 *     responses:
	 *       200:
	 *         description: List of module activations
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/ModuleActivation'
	 *       401:
	 *         $ref: '#/components/responses/UnauthorizedError'
	 *       404:
	 *         $ref: '#/components/responses/NotFoundError'
	 */
	public async listByModuleHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.activationsService.listByModule(+request.params.moduleId);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}

	/**
	 * @swagger
	 * /api/activations/module/{moduleId}/groups/{groupName}:
	 *   post:
	 *     summary: Activate module for group
	 *     description: Activate a module for a specific student group
	 *     tags: [Activations]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: moduleId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Module ID
	 *       - in: path
	 *         name: groupName
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Group name
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               isActive:
	 *                 type: boolean
	 *                 default: true
	 *                 description: Whether the activation is active
	 *     responses:
	 *       200:
	 *         description: Module activated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ModuleActivation'
	 *       400:
	 *         $ref: '#/components/responses/ValidationError'
	 *       401:
	 *         $ref: '#/components/responses/UnauthorizedError'
	 *       404:
	 *         $ref: '#/components/responses/NotFoundError'
	 */
	public async activateHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.activationsService.activate(+request.params.moduleId, request.params.groupName);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}

	/**
	 * @swagger
	 * /api/activations/module/{moduleId}/groups/{groupName}:
	 *   delete:
	 *     summary: Deactivate module for group
	 *     description: Deactivate a module for a specific student group
	 *     tags: [Activations]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: moduleId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Module ID
	 *       - in: path
	 *         name: groupName
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Group name
	 *     responses:
	 *       200:
	 *         description: Module deactivated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *                   example: "Module deactivated successfully"
	 *       401:
	 *         $ref: '#/components/responses/UnauthorizedError'
	 *       404:
	 *         $ref: '#/components/responses/NotFoundError'
	 */
	public async deactivateHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.activationsService.deactivate(+request.params.moduleId, request.params.groupName);
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}
}


