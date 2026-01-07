import { IsEmail, IsString, IsBoolean, IsOptional, IsNotEmpty, IsNumber } from "class-validator";
import { User as UserEntity } from "@/database/entities";
import { type OmitDbFields } from "@/types";

export type User = OmitDbFields<UserEntity>;

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
