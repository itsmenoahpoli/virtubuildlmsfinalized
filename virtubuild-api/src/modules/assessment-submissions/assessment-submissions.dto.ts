import { IsNumber, IsObject, IsBoolean, IsOptional, IsNotEmpty } from "class-validator";

export class SubmitAssessmentDTO {
	@IsNumber()
	@IsNotEmpty()
	assessmentId: number;

	@IsObject()
	@IsNotEmpty()
	answers: any;

	@IsNumber()
	@IsOptional()
	timeSpentSeconds?: number;
}

export class UpdateSubmissionDTO {
	@IsObject()
	@IsOptional()
	answers?: any;

	@IsNumber()
	@IsOptional()
	score?: number;

	@IsNumber()
	@IsOptional()
	timeSpentSeconds?: number;

	@IsBoolean()
	@IsOptional()
	isSubmitted?: boolean;

	@IsObject()
	@IsOptional()
	feedback?: any;
}
