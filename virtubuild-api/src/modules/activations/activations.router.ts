import { Router } from "express";
import { ActivationsController } from "./activations.controller";
import { CheckAuthMiddleware, CheckRoleMiddleware } from "@/middlewares/check-auth.middleware";

export class ActivationsRouter {
	private router: Router;
	private controller: ActivationsController;

	constructor() {
		this.router = Router();
		this.controller = new ActivationsController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.get("/module/:moduleId", CheckAuthMiddleware, CheckRoleMiddleware(["instructor"]), this.controller.listByModuleHandler);
		this.router.post("/module/:moduleId/groups/:groupName", CheckAuthMiddleware, CheckRoleMiddleware(["instructor"]), this.controller.activateHandler);
		this.router.delete("/module/:moduleId/groups/:groupName", CheckAuthMiddleware, CheckRoleMiddleware(["instructor"]), this.controller.deactivateHandler);
	}
}


