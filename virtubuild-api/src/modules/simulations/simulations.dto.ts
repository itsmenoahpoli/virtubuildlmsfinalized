import { IsNumber, IsString, IsOptional, IsObject, IsNotEmpty, IsArray } from "class-validator";

export class StartSimulationDTO {
	@IsNumber()
	@IsNotEmpty()
	activityId: number;
}

export class PlaceComponentDTO {
	@IsString()
	@IsNotEmpty()
	componentId: string;

	@IsNumber()
	@IsNotEmpty()
	x: number;

	@IsNumber()
	@IsNotEmpty()
	y: number;

	@IsNumber()
	@IsNotEmpty()
	z: number;

	@IsObject()
	@IsOptional()
	rotation?: any;

	@IsObject()
	@IsOptional()
	metadata?: any;
}

export class UpdateSimulationStateDTO {
	@IsString()
	@IsOptional()
	status?: string;

	@IsObject()
	@IsOptional()
	simulationState?: any;

	@IsArray()
	@IsOptional()
	componentPlacements?: any[];

	@IsNumber()
	@IsOptional()
	score?: number;

	@IsNumber()
	@IsOptional()
	timeSpentSeconds?: number;

	@IsNumber()
	@IsOptional()
	errors?: number;

	@IsObject()
	@IsOptional()
	steps?: any;
}

export class CompleteSimulationDTO {
	@IsNumber()
	@IsNotEmpty()
	score: number;

	@IsNumber()
	@IsNotEmpty()
	timeSpentSeconds: number;

	@IsNumber()
	@IsOptional()
	errors?: number;

	@IsObject()
	@IsOptional()
	finalState?: any;
}
