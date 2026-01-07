import { IsEmail, IsString, IsBoolean, IsOptional, IsNotEmpty, IsNumber, IsObject, IsArray, Min, Max } from "class-validator";
import { User as UserEntity, UserRole as UserRoleEntity, Module as ModuleEntity, LabActivity as LabActivityEntity, Assessment as AssessmentEntity, Grade as GradeEntity, PerformanceAnalytics as PerformanceAnalyticsEntity, ModuleActivation as ModuleActivationEntity } from "@/database/entities";
import { type OmitDbFields } from "@/types";

export type User = OmitDbFields<UserEntity>;
export type UserRole = OmitDbFields<UserRoleEntity>;
export type Module = OmitDbFields<ModuleEntity>;
export type LabActivity = OmitDbFields<LabActivityEntity>;
export type Assessment = OmitDbFields<AssessmentEntity>;
export type Grade = OmitDbFields<GradeEntity>;
export type PerformanceAnalytics = OmitDbFields<PerformanceAnalyticsEntity>;
export type ModuleActivation = OmitDbFields<ModuleActivationEntity>;

export class UserDataDTO implements User {
	@IsOptional()
	@IsNumber()
	userRoleId?: number;

	@IsNotEmpty()
	@IsString()
	firstName: string;

	@IsOptional()
	@IsString()
	middleName?: string;

	@IsNotEmpty()
	@IsString()
	lastName: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@IsOptional()
	@IsBoolean()
	isEnabled: boolean;

	@IsOptional()
	@IsBoolean()
	isEmailVerified: boolean;

	@IsOptional()
	@IsBoolean()
	twoFactorEnabled: boolean;

	@IsOptional()
	@IsNumber()
	failedLoginAttempts: number;
}

export class UserRoleDataDTO implements UserRole {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsBoolean()
	isEnabled?: boolean;
}

export class ModuleDataDTO implements Module {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsObject()
	steps?: any;

	@IsOptional()
	@IsBoolean()
	isEnabled: boolean;
}

export class LabActivityDataDTO implements LabActivity {
	@IsNotEmpty()
	@IsNumber()
	moduleId: number;

	@IsNotEmpty()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsObject()
	componentsMetadata?: any;


	@IsOptional()
	@IsBoolean()
	isEnabled: boolean;
}


export class AssessmentDataDTO implements Omit<Assessment, 'labActivity'> {
	@IsNotEmpty()
	@IsNumber()
	labActivityId: number;

	@IsNotEmpty()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsNumber()
	@Min(1)
	@Max(180)
	timeLimitMinutes: number;

	@IsNotEmpty()
	@IsObject()
	questions: any;

	@IsBoolean()
	isEnabled: boolean;
}

export class GradeDataDTO implements Omit<Grade, 'user' | 'activity'> {
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsNumber()
	activityId: number;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(100)
	score: number;

	@IsOptional()
	@IsObject()
	breakdown?: any;
}

export class PerformanceAnalyticsDataDTO implements PerformanceAnalytics {
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsNumber()
	activityId: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	timeSpentSeconds: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	errorCount: number;

	@IsOptional()
	@IsObject()
	trends?: any;
}

export class ModuleActivationDataDTO implements ModuleActivation {
	@IsNotEmpty()
	@IsNumber()
	moduleId: number;

	@IsNotEmpty()
	@IsString()
	groupName: string;

	@IsOptional()
	@IsBoolean()
	isActive: boolean;
}

export class DashboardStatsDTO {
	@IsOptional()
	@IsString()
	period?: string;
}

