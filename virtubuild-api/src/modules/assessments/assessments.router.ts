import { Router } from "express";
import { AssessmentsController } from "./assessments.controller";
import { CheckAuthMiddleware, CheckRoleMiddleware } from "@/middlewares/check-auth.middleware";

export class AssessmentsRouter {
	private router: Router;
	private controller: AssessmentsController;

	constructor() {
		this.router = Router();
		this.controller = new AssessmentsController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.get("/", CheckAuthMiddleware, this.controller.listAllHandler);
		this.router.get("/lab-activity/:labActivityId", CheckAuthMiddleware, this.controller.getByLabActivityHandler);
		this.router.post("/", CheckAuthMiddleware, CheckRoleMiddleware(["admin", "instructor"]), this.controller.createHandler);
		this.router.put("/:id", CheckAuthMiddleware, CheckRoleMiddleware(["admin", "instructor"]), this.controller.updateHandler);
		this.router.delete("/:id", CheckAuthMiddleware, CheckRoleMiddleware(["admin", "instructor"]), this.controller.deleteHandler);
	}
}


