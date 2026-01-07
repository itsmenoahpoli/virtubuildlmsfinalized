import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";

@Entity()
export class Module extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ type: "text", nullable: true })
	description?: string;

	@Column({ type: "jsonb", nullable: true })
	steps?: any;

	@Column({ type: "boolean", default: true })
	isEnabled: boolean;
}


