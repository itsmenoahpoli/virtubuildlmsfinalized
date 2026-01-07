import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { Module } from "./module.entity";

@Entity()
export class ModulePrerequisite extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	moduleId: number;

	@Column()
	prerequisiteModuleId: number;

	@Column({ type: "boolean", default: true })
	isRequired: boolean;

	@ManyToOne(() => Module)
	@JoinColumn({ name: "moduleId" })
	module: Module;

	@ManyToOne(() => Module)
	@JoinColumn({ name: "prerequisiteModuleId" })
	prerequisiteModule: Module;
}
