import { simulationsRepository, labActivitiesRepository } from "@/database";

export class SimulationsService {
	public async startSimulation(studentId: number, activityId: number) {
		const existing = await simulationsRepository.findOne({
			where: { studentId, activityId }
		});

		if (existing) {
			return existing;
		}

		const simulation = simulationsRepository.create({
			studentId,
			activityId,
			status: "in_progress",
			simulationState: {
				components: [],
				placedComponents: [],
				score: 0,
				errors: 0,
				startTime: new Date()
			}
		});

		return simulationsRepository.save(simulation);
	}

	public async getSimulation(simulationId: number) {
		return simulationsRepository.findOne({
			where: { id: simulationId },
			relations: ["student", "activity"]
		});
	}

	public async getStudentSimulations(studentId: number) {
		return simulationsRepository.find({
			where: { studentId },
			relations: ["activity"],
			order: { createdAt: "DESC" }
		});
	}

	public async updateSimulationState(simulationId: number, updateData: any) {
		await simulationsRepository.update(simulationId, updateData);
		return this.getSimulation(simulationId);
	}

	public async placeComponent(simulationId: number, componentData: any) {
		const simulation = await this.getSimulation(simulationId);
		if (!simulation) {
			throw new Error("Simulation not found");
		}

		const currentState = simulation.simulationState || {};
		const placedComponents = currentState.placedComponents || [];
		
		placedComponents.push({
			...componentData,
			placedAt: new Date()
		});

		const updatedState = {
			...currentState,
			placedComponents,
			lastAction: "component_placed"
		};

		return this.updateSimulationState(simulationId, {
			simulationState: updatedState,
			componentPlacements: placedComponents
		});
	}

	public async completeSimulation(simulationId: number, completionData: any) {
		const simulation = await this.getSimulation(simulationId);
		if (!simulation) {
			throw new Error("Simulation not found");
		}

		const finalState = {
			...simulation.simulationState,
			completedAt: new Date(),
			score: completionData.score,
			errors: completionData.errors || 0,
			finalState: completionData.finalState
		};

		const updatedSimulation = await this.updateSimulationState(simulationId, {
			status: "completed",
			score: completionData.score,
			timeSpentSeconds: completionData.timeSpentSeconds,
			errors: completionData.errors || 0,
			simulationState: finalState
		});

		return updatedSimulation;
	}

	public async getSimulationScore(simulationId: number) {
		const simulation = await this.getSimulation(simulationId);
		if (!simulation) {
			throw new Error("Simulation not found");
		}

		return {
			score: simulation.score,
			timeSpent: simulation.timeSpentSeconds,
			errors: simulation.errors,
			status: simulation.status,
			completedAt: simulation.updatedAt
		};
	}

	public async getSimulationLeaderboard(activityId?: number) {
		const whereClause = activityId ? { activityId, status: "completed" } : { status: "completed" };
		
		const simulations = await simulationsRepository.find({
			where: whereClause,
			relations: ["student", "activity"],
			order: { score: "DESC" }
		});

		return simulations.map(sim => ({
			studentId: sim.studentId,
			studentName: `${sim.student.firstName} ${sim.student.lastName}`,
			activityId: sim.activityId,
			activityTitle: sim.activity.title,
			score: sim.score,
			timeSpent: sim.timeSpentSeconds,
			errors: sim.errors,
			completedAt: sim.updatedAt
		}));
	}


	public async getSimulationComponents(activityId: number) {
		const activity = await labActivitiesRepository.findOne({
			where: { id: activityId }
		});

		if (!activity) {
			throw new Error("Activity not found");
		}

		return {
			components: activity.componentsMetadata || [],
			instructions: activity.description,
			objectives: []
		};
	}
}
