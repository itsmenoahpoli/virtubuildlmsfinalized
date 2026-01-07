import { Router } from "express";
import { UsersController } from "./users.controller";
import { CheckAuthMiddleware } from "@/middlewares";

export class UsersRouter {
	private router: Router;
	private usersController: UsersController;

	constructor() {
		this.router = Router();
		this.usersController = new UsersController();

		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		// Apply authentication middleware to all routes
		this.router.use(CheckAuthMiddleware);

		// User management routes
		this.router.get("/", this.usersController.fetchListHandler.bind(this.usersController));
		this.router.get("/me", this.usersController.getMyProfileHandler.bind(this.usersController));
		this.router.get("/:id", this.usersController.fetchByIdHandler.bind(this.usersController));
		this.router.post("/", this.usersController.createHandler.bind(this.usersController));
		this.router.put("/me", this.usersController.updateMyProfileHandler.bind(this.usersController));
		this.router.put("/:id", this.usersController.updateByIdHandler.bind(this.usersController));
		this.router.delete("/:id", this.usersController.deleteByIdHandler.bind(this.usersController));
	}
}
