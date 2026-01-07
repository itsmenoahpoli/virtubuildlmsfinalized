import { IsNumber, IsBoolean, IsOptional, IsObject, IsNotEmpty } from "class-validator";

export class CreateStudentProgressDTO {
	@IsNumber()
	@IsNotEmpty()
	studentId: number;

	@IsNumber()
	@IsNotEmpty()
	activityId: number;

	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean;

	@IsNumber()
	@IsOptional()
	score?: number;

	@IsNumber()
	@IsOptional()
	timeSpentSeconds?: number;

	@IsNumber()
	@IsOptional()
	attempts?: number;

	@IsObject()
	@IsOptional()
	progressData?: any;

	@IsObject()
	@IsOptional()
	componentPlacements?: any;
}

export class UpdateStudentProgressDTO {
	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean;

	@IsNumber()
	@IsOptional()
	score?: number;

	@IsNumber()
	@IsOptional()
	timeSpentSeconds?: number;

	@IsNumber()
	@IsOptional()
	attempts?: number;

	@IsObject()
	@IsOptional()
	progressData?: any;

	@IsObject()
	@IsOptional()
	componentPlacements?: any;
}

export class SubmitProgressDTO {
	@IsNumber()
	@IsNotEmpty()
	activityId: number;

	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean;

	@IsNumber()
	@IsOptional()
	score?: number;

	@IsNumber()
	@IsOptional()
	timeSpentSeconds?: number;

	@IsObject()
	@IsOptional()
	progressData?: any;

	@IsObject()
	@IsOptional()
	componentPlacements?: any;
}
