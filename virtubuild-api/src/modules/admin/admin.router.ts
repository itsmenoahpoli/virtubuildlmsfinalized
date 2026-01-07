import { Router } from "express";
import { AdminController } from "./admin.controller";

export class AdminRouter {
	private router: Router;
	private adminController: AdminController;

	constructor() {
		this.router = Router();
		this.adminController = new AdminController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.get("/dashboard/stats", (req, res) => this.adminController.getDashboardStats(req, res));

		this.router.get("/users", (req, res) => this.adminController.getAllUsers(req, res));
		this.router.get("/users/:id", (req, res) => this.adminController.getUserById(req, res));
		this.router.post("/users", (req, res) => this.adminController.createUser(req, res));
		this.router.put("/users/:id", (req, res) => this.adminController.updateUser(req, res));
		this.router.delete("/users/:id", (req, res) => this.adminController.deleteUser(req, res));

		this.router.get("/user-roles", (req, res) => this.adminController.getAllUserRoles(req, res));
		this.router.get("/user-roles/:id", (req, res) => this.adminController.getUserRoleById(req, res));
		this.router.post("/user-roles", (req, res) => this.adminController.createUserRole(req, res));
		this.router.put("/user-roles/:id", (req, res) => this.adminController.updateUserRole(req, res));
		this.router.delete("/user-roles/:id", (req, res) => this.adminController.deleteUserRole(req, res));

		this.router.get("/modules", (req, res) => this.adminController.getAllModules(req, res));
		this.router.get("/modules/:id", (req, res) => this.adminController.getModuleById(req, res));
		this.router.post("/modules", (req, res) => this.adminController.createModule(req, res));
		this.router.put("/modules/:id", (req, res) => this.adminController.updateModule(req, res));
		this.router.delete("/modules/:id", (req, res) => this.adminController.deleteModule(req, res));

		this.router.get("/lab-activities", (req, res) => this.adminController.getAllLabActivities(req, res));
		this.router.get("/lab-activities/:id", (req, res) => this.adminController.getLabActivityById(req, res));
		this.router.post("/lab-activities", (req, res) => this.adminController.createLabActivity(req, res));
		this.router.put("/lab-activities/:id", (req, res) => this.adminController.updateLabActivity(req, res));
		this.router.delete("/lab-activities/:id", (req, res) => this.adminController.deleteLabActivity(req, res));


		this.router.get("/assessments", (req, res) => this.adminController.getAllAssessments(req, res));
		this.router.get("/assessments/:id", (req, res) => this.adminController.getAssessmentById(req, res));
		this.router.get("/assessments/:id/submissions", (req, res) => this.adminController.getAssessmentSubmissions(req, res));
		this.router.post("/assessments", (req, res) => this.adminController.createAssessment(req, res));
		this.router.put("/assessments/:id", (req, res) => this.adminController.updateAssessment(req, res));
		this.router.delete("/assessments/:id", (req, res) => this.adminController.deleteAssessment(req, res));

		this.router.get("/grades", (req, res) => this.adminController.getAllGrades(req, res));
		this.router.get("/grades/:id", (req, res) => this.adminController.getGradeById(req, res));
		this.router.post("/grades", (req, res) => this.adminController.createGrade(req, res));
		this.router.put("/grades/:id", (req, res) => this.adminController.updateGrade(req, res));
		this.router.delete("/grades/:id", (req, res) => this.adminController.deleteGrade(req, res));

		this.router.get("/performance-analytics", (req, res) => this.adminController.getAllPerformanceAnalytics(req, res));
		this.router.get("/performance-analytics/:id", (req, res) => this.adminController.getPerformanceAnalyticsById(req, res));
		this.router.post("/performance-analytics", (req, res) => this.adminController.createPerformanceAnalytics(req, res));
		this.router.put("/performance-analytics/:id", (req, res) => this.adminController.updatePerformanceAnalytics(req, res));
		this.router.delete("/performance-analytics/:id", (req, res) => this.adminController.deletePerformanceAnalytics(req, res));

		this.router.get("/module-activations", (req, res) => this.adminController.getAllModuleActivations(req, res));
		this.router.get("/module-activations/:id", (req, res) => this.adminController.getModuleActivationById(req, res));
		this.router.post("/module-activations", (req, res) => this.adminController.createModuleActivation(req, res));
		this.router.put("/module-activations/:id", (req, res) => this.adminController.updateModuleActivation(req, res));
		this.router.delete("/module-activations/:id", (req, res) => this.adminController.deleteModuleActivation(req, res));
	}
}
