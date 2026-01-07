import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { ModulesService } from "./modules.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class ModulesController extends BaseController {
	public modulesService: ModulesService;

	constructor() {
		super();
		this.modulesService = new ModulesService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /modules:
	 *   get:
	 *     summary: List learning modules
	 *     tags: [Modules]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: OK
	 */
	public async listHandler(request: Request, response: Response, next: NextFunction): Promise<any> {
		const result = await this.modulesService.list();
		return SendHttpResponse(response, result, HttpStatusCode.OK);
	}
}


