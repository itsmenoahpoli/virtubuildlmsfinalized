import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { UserRole } from "./user-role.entity";

@Entity()
export class User extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		nullable: true,
	})
	userRoleId?: number;

	@ManyToOne(() => UserRole, { nullable: true })
	@JoinColumn({ name: 'userRoleId' })
	userRole?: UserRole;

	@Column()
	firstName: string;

	@Column({
		nullable: true,
	})
	middleName?: string;

	@Column()
	lastName: string;

	@Column({
		unique: true,
	})
	email: string;

	@Column()
	password: string;

	@Column({
		type: "boolean",
		default: false,
	})
	isEnabled: boolean;

	@Column({
		type: "boolean",
		default: false,
	})
	isEmailVerified: boolean;

	@Column({
		type: "boolean",
		default: false,
	})
	twoFactorEnabled: boolean;

	@Column({
		type: "varchar",
		length: 255,
		nullable: true,
	})
	twoFactorSecret?: string;

	@Column({
		type: "timestamp",
		nullable: true,
	})
	lastLoginAt?: Date;

	@Column({
		type: "varchar",
		length: 45,
		nullable: true,
	})
	lastLoginIp?: string;

	@Column({
		type: "int",
		default: 0,
	})
	failedLoginAttempts: number;

	@Column({
		type: "timestamp",
		nullable: true,
	})
	lockedUntil?: Date;

	@Column({
		type: "varchar",
		length: 255,
		nullable: true,
	})
	passwordResetToken?: string;

	@Column({
		type: "timestamp",
		nullable: true,
	})
	passwordResetExpires?: Date;

	@Column({
		type: "varchar",
		length: 255,
		nullable: true,
	})
	emailVerificationToken?: string;

	@Column({
		type: "timestamp",
		nullable: true,
	})
	emailVerificationExpires?: Date;
}
