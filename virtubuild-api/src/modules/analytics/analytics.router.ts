import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { CheckAuthMiddleware } from "@/middlewares/check-auth.middleware";

export class AnalyticsRouter {
	private router: Router;
	private controller: AnalyticsController;

	constructor() {
		this.router = Router();
		this.controller = new AnalyticsController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.get("/me", CheckAuthMiddleware, this.controller.getMineHandler);
	}
}


