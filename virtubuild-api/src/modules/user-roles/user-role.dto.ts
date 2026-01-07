import { IsString, IsBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { UserRole as UserRoleEntity } from "@/database/entities";
import { type OmitDbFields } from "@/types";

export type UserRole = OmitDbFields<UserRoleEntity>;

export class UserRoleDTO implements UserRole {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsBoolean()
	isEnabled?: boolean;
}
