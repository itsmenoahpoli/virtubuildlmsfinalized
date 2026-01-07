import { Router } from "express";
import { GradesController } from "./grades.controller";
import { CheckAuthMiddleware, CheckRoleMiddleware } from "@/middlewares/check-auth.middleware";

export class GradesRouter {
	private router: Router;
	private controller: GradesController;

	constructor() {
		this.router = Router();
		this.controller = new GradesController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.get("/me", CheckAuthMiddleware, this.controller.listMineHandler);
		this.router.get("/activity/:activityId", CheckAuthMiddleware, CheckRoleMiddleware(["instructor"]), this.controller.listForActivityHandler);
	}
}


