import { IsString, IsOptional, IsBoolean, IsNumber, IsNotEmpty } from "class-validator";

export class CreateStudentGroupDTO {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}

export class UpdateStudentGroupDTO {
	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}

export class AssignStudentToGroupDTO {
	@IsNumber()
	@IsNotEmpty()
	studentId: number;

	@IsNumber()
	@IsNotEmpty()
	studentGroupId: number;
}
