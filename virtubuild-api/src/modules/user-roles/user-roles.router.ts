import { Router } from "express";
import { UserRolesController } from "./user-roles.controller";

export class UserRolesRouter {
	private router: Router;
	private userRolesController: UserRolesController;

	constructor() {
		this.router = Router();
		this.userRolesController = new UserRolesController();

		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.get("/", this.userRolesController.fetchListHandler);
		this.router.get("/:id", this.userRolesController.fetchByIdHandler);
		this.router.patch("/:id", this.userRolesController.updateByIdHandler);
		this.router.delete("/:id", this.userRolesController.deleteByIdHandler);
		this.router.post("/", this.userRolesController.createHandler);
	}
}
