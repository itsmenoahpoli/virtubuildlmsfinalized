import { Router } from "express";
import { SimulationsController } from "./simulations.controller";
import { CheckAuthMiddleware } from "@/middlewares/check-auth.middleware";

export class SimulationsRouter {
	private router: Router;
	private controller: SimulationsController;

	constructor() {
		this.router = Router();
		this.controller = new SimulationsController();
		this.initializeRoutes();
	}

	get routerRoutes() {
		return this.router;
	}

	private initializeRoutes() {
		this.router.post("/start", CheckAuthMiddleware, (req, res) => this.controller.startSimulation(req, res));
		this.router.get("/me", CheckAuthMiddleware, (req, res) => this.controller.getMySimulations(req, res));
		this.router.get("/:id", CheckAuthMiddleware, (req, res) => this.controller.getSimulation(req, res));
		this.router.post("/:id/components", CheckAuthMiddleware, (req, res) => this.controller.placeComponent(req, res));
		this.router.post("/:id/complete", CheckAuthMiddleware, (req, res) => this.controller.completeSimulation(req, res));
		this.router.get("/:id/score", CheckAuthMiddleware, (req, res) => this.controller.getSimulationScore(req, res));
		this.router.get("/leaderboard", CheckAuthMiddleware, (req, res) => this.controller.getLeaderboard(req, res));
		this.router.get("/activity/:activityId/components", CheckAuthMiddleware, (req, res) => this.controller.getSimulationComponents(req, res));
	}
}
