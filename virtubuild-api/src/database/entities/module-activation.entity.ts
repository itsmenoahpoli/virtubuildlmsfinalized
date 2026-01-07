import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";

@Entity()
export class ModuleActivation extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	moduleId: number;

	@Column()
	groupName: string;

	@Column({ type: "boolean", default: true })
	isActive: boolean;
}


