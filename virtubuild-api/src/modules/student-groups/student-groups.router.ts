import { Router } from "express";
import { StudentGroupsController } from "./student-groups.controller";
import { CheckAuthMiddleware, CheckRoleMiddleware } from "@/middlewares/check-auth.middleware";

export class StudentGroupsRouter {
	private router: Router;
	private controller: StudentGroupsController;

	constructor() {
		this.router = Router();
		this.controller = new StudentGroupsController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.post("/", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.createGroup(req, res));
		this.router.get("/", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.getAllGroups(req, res));
		this.router.get("/:id", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.getGroupById(req, res));
		this.router.put("/:id", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.updateGroup(req, res));
		this.router.delete("/:id", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.deleteGroup(req, res));
		
		this.router.post("/:groupId/students/:studentId", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.assignStudentToGroup(req, res));
		this.router.delete("/:groupId/students/:studentId", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.removeStudentFromGroup(req, res));
		this.router.get("/:id/students", CheckAuthMiddleware, CheckRoleMiddleware(["instructor", "admin"]), (req, res) => this.controller.getStudentsInGroup(req, res));
		this.router.get("/student/:studentId", CheckAuthMiddleware, (req, res) => this.controller.getStudentGroups(req, res));
	}
}
