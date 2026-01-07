import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { Assessment } from "./assessment.entity";

@Entity()
export class LabActivity extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ type: "text", nullable: true })
	description?: string;

	@Column({ type: "varchar", length: 100, nullable: true })
	location?: string;

	@Column({ type: "varchar", length: 50, nullable: true })
	capacity?: string;

	@Column({ type: "jsonb", nullable: true })
	equipment?: any;

	@Column({ type: "jsonb", nullable: true })
	componentsMetadata?: any;

	@Column({ type: "boolean", default: true })
	isEnabled: boolean;

	@OneToMany(() => Assessment, assessment => assessment.labActivity)
	assessments?: Assessment[];

}


