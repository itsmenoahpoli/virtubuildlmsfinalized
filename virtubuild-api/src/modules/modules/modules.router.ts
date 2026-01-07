import { Router } from "express";
import { ModulesController } from "./modules.controller";
import { CheckAuthMiddleware } from "@/middlewares/check-auth.middleware";

export class ModulesRouter {
	private router: Router;
	private controller: ModulesController;

	constructor() {
		this.router = Router();
		this.controller = new ModulesController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.get("/", CheckAuthMiddleware, this.controller.listHandler);
	}
}


