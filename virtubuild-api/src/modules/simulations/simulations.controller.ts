import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { SimulationsService } from "./simulations.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class SimulationsController extends BaseController {
	public simulationsService: SimulationsService;

	constructor() {
		super();
		this.simulationsService = new SimulationsService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /simulations/start:
	 *   post:
	 *     summary: Start a new simulation
	 *     description: Start a new PC assembly simulation for a specific activity
	 *     tags: [Simulations]
	 *     security:
	 *       - BearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - activityId
	 *             properties:
	 *               activityId:
	 *                 type: integer
	 *                 description: Activity ID to start simulation for
	 *     responses:
	 *       201:
	 *         description: Simulation started successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Simulation'
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	public async startSimulation(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const { activityId } = req.body;
			const result = await this.simulationsService.startSimulation(studentId, activityId);
			this.sendHttpResponse(res, result, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error starting simulation:", error);
			this.sendHttpResponse(res, { error: "Failed to start simulation" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /simulations/{id}:
	 *   get:
	 *     summary: Get simulation details
	 *     description: Retrieve details of a specific simulation
	 *     tags: [Simulations]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Simulation ID
	 *     responses:
	 *       200:
	 *         description: Simulation details retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Simulation'
	 *       404:
	 *         description: Simulation not found
	 *       500:
	 *         description: Internal server error
	 */
	public async getSimulation(req: Request, res: Response) {
		try {
			const result = await this.simulationsService.getSimulation(+req.params.id);
			if (!result) {
				this.sendHttpResponse(res, { error: "Simulation not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting simulation:", error);
			this.sendHttpResponse(res, { error: "Failed to get simulation" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /simulations/me:
	 *   get:
	 *     summary: Get my simulations
	 *     description: Retrieve all simulations for the current user
	 *     tags: [Simulations]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: User simulations retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/Simulation'
	 *       500:
	 *         description: Internal server error
	 */
	public async getMySimulations(req: Request, res: Response) {
		try {
			const studentId = (req as any).user?.user?.id as number;
			const result = await this.simulationsService.getStudentSimulations(studentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting user simulations:", error);
			this.sendHttpResponse(res, { error: "Failed to get user simulations" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /simulations/{id}/components:
	 *   post:
	 *     summary: Place component in simulation
	 *     description: Place a component in the PC assembly simulation
	 *     tags: [Simulations]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Simulation ID
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - componentId
	 *               - x
	 *               - y
	 *               - z
	 *             properties:
	 *               componentId:
	 *                 type: string
	 *                 description: Component identifier
	 *               x:
	 *                 type: number
	 *                 description: X coordinate
	 *               y:
	 *                 type: number
	 *                 description: Y coordinate
	 *               z:
	 *                 type: number
	 *                 description: Z coordinate
	 *               rotation:
	 *                 type: object
	 *                 description: Component rotation
	 *               metadata:
	 *                 type: object
	 *                 description: Additional component metadata
	 *     responses:
	 *       200:
	 *         description: Component placed successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Simulation'
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	public async placeComponent(req: Request, res: Response) {
		try {
			const result = await this.simulationsService.placeComponent(+req.params.id, req.body);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error placing component:", error);
			this.sendHttpResponse(res, { error: "Failed to place component" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /simulations/{id}/complete:
	 *   post:
	 *     summary: Complete simulation
	 *     description: Complete the PC assembly simulation and calculate final score
	 *     tags: [Simulations]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Simulation ID
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - score
	 *               - timeSpentSeconds
	 *             properties:
	 *               score:
	 *                 type: number
	 *                 description: Final simulation score
	 *               timeSpentSeconds:
	 *                 type: number
	 *                 description: Time spent in seconds
	 *               errors:
	 *                 type: number
	 *                 description: Number of errors made
	 *               finalState:
	 *                 type: object
	 *                 description: Final simulation state
	 *     responses:
	 *       200:
	 *         description: Simulation completed successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Simulation'
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	public async completeSimulation(req: Request, res: Response) {
		try {
			const result = await this.simulationsService.completeSimulation(+req.params.id, req.body);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error completing simulation:", error);
			this.sendHttpResponse(res, { error: "Failed to complete simulation" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /simulations/{id}/score:
	 *   get:
	 *     summary: Get simulation score
	 *     description: Retrieve the score and performance metrics for a simulation
	 *     tags: [Simulations]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Simulation ID
	 *     responses:
	 *       200:
	 *         description: Simulation score retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 score:
	 *                   type: number
	 *                   description: Simulation score
	 *                 timeSpent:
	 *                   type: number
	 *                   description: Time spent in seconds
	 *                 errors:
	 *                   type: number
	 *                   description: Number of errors
	 *                 status:
	 *                   type: string
	 *                   description: Simulation status
	 *                 completedAt:
	 *                   type: string
	 *                   format: date-time
	 *                   description: Completion timestamp
	 *       404:
	 *         description: Simulation not found
	 *       500:
	 *         description: Internal server error
	 */
	public async getSimulationScore(req: Request, res: Response) {
		try {
			const result = await this.simulationsService.getSimulationScore(+req.params.id);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting simulation score:", error);
			this.sendHttpResponse(res, { error: "Failed to get simulation score" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /simulations/leaderboard:
	 *   get:
	 *     summary: Get simulation leaderboard
	 *     description: Retrieve the leaderboard for completed simulations
	 *     tags: [Simulations]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: query
	 *         name: activityId
	 *         schema:
	 *           type: integer
	 *         description: Filter by specific activity
	 *     responses:
	 *       200:
	 *         description: Leaderboard retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 type: object
	 *                 properties:
	 *                   studentId:
	 *                     type: number
	 *                   studentName:
	 *                     type: string
	 *                   activityId:
	 *                     type: number
	 *                   activityTitle:
	 *                     type: string
	 *                   score:
	 *                     type: number
	 *                   timeSpent:
	 *                     type: number
	 *                   errors:
	 *                     type: number
	 *                   completedAt:
	 *                     type: string
	 *                     format: date-time
	 *       500:
	 *         description: Internal server error
	 */
	public async getLeaderboard(req: Request, res: Response) {
		try {
			const activityId = req.query.activityId ? +req.query.activityId : undefined;
			const result = await this.simulationsService.getSimulationLeaderboard(activityId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting leaderboard:", error);
			this.sendHttpResponse(res, { error: "Failed to get leaderboard" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /simulations/activity/{activityId}/components:
	 *   get:
	 *     summary: Get simulation components
	 *     description: Retrieve available components and instructions for an activity
	 *     tags: [Simulations]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: activityId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Activity ID
	 *     responses:
	 *       200:
	 *         description: Simulation components retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 components:
	 *                   type: array
	 *                   description: Available components
	 *                 instructions:
	 *                   type: string
	 *                   description: Activity instructions
	 *                 objectives:
	 *                   type: array
	 *                   description: Learning objectives
	 *       404:
	 *         description: Activity not found
	 *       500:
	 *         description: Internal server error
	 */
	public async getSimulationComponents(req: Request, res: Response) {
		try {
			const result = await this.simulationsService.getSimulationComponents(+req.params.activityId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting simulation components:", error);
			this.sendHttpResponse(res, { error: "Failed to get simulation components" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}
}
