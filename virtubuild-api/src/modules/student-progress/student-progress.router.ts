import { Router } from "express";
import { StudentProgressController } from "./student-progress.controller";
import { CheckAuthMiddleware, CheckRoleMiddleware } from "@/middlewares/check-auth.middleware";

export class StudentProgressRouter {
	private router: Router;
	private controller: StudentProgressController;

	constructor() {
		this.router = Router();
		this.controller = new StudentProgressController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.get("/me", CheckAuthMiddleware, (req, res) => this.controller.getMyProgress(req, res));
		this.router.get("/assigned-activities", CheckAuthMiddleware, (req, res) => this.controller.getAssignedActivities(req, res));
		this.router.get("/assigned-modules", CheckAuthMiddleware, (req, res) => this.controller.getAssignedModules(req, res));
		this.router.post("/submit", CheckAuthMiddleware, (req, res) => this.controller.submitProgress(req, res));
		this.router.get("/activity/:activityId", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.getProgressByActivity(req, res));
		this.router.get("/instructor/overview", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.getInstructorOverview(req, res));
		this.router.get("/stats/me", CheckAuthMiddleware, (req, res) => this.controller.getMyStats(req, res));
	}
}
