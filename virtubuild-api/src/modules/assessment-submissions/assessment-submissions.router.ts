import { Router } from "express";
import { AssessmentSubmissionsController } from "./assessment-submissions.controller";
import { CheckAuthMiddleware, CheckRoleMiddleware } from "@/middlewares/check-auth.middleware";

export class AssessmentSubmissionsRouter {
	private router: Router;
	private controller: AssessmentSubmissionsController;

	constructor() {
		this.router = Router();
		this.controller = new AssessmentSubmissionsController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.post("/submit", CheckAuthMiddleware, (req, res) => this.controller.submitAssessment(req, res));
		this.router.get("/me", CheckAuthMiddleware, (req, res) => this.controller.getMySubmissions(req, res));
		this.router.get("/history/me", CheckAuthMiddleware, (req, res) => this.controller.getMyHistory(req, res));
		this.router.get("/:id", CheckAuthMiddleware, (req, res) => this.controller.getSubmissionById(req, res));
		this.router.get("/assessment/:assessmentId", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.getSubmissionsByAssessment(req, res));
		this.router.post("/:id/feedback", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.addFeedback(req, res));
		this.router.get("/results/:assessmentId", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.getAssessmentResults(req, res));
	}
}
