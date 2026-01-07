import { Router } from "express";
import { AuthController } from "./auth.controller";

export class AuthRouter {
	private router: Router;
	private authController: AuthController;

	constructor() {
		this.router = Router();
		this.authController = new AuthController();

		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.post("/signin", this.authController.signinHandler);
		this.router.post("/signup", this.authController.signupHandler);
	}
}
