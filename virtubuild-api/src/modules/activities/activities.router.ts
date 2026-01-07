import { Router } from "express";
import { ActivitiesController } from "./activities.controller";
import { CheckAuthMiddleware } from "@/middlewares/check-auth.middleware";

export class ActivitiesRouter {
	private router: Router;
	private controller: ActivitiesController;

	constructor() {
		this.router = Router();
		this.controller = new ActivitiesController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.get("/", CheckAuthMiddleware, this.controller.listAllHandler);
		this.router.get("/:id", CheckAuthMiddleware, this.controller.getByIdHandler);
		this.router.put("/:id", CheckAuthMiddleware, this.controller.updateHandler);
	}
}


