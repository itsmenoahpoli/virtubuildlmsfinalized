import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";

@Entity()
export class PerformanceAnalytics extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@Column()
	activityId: number;

	@Column({ type: "int", default: 0 })
	timeSpentSeconds: number;

	@Column({ type: "int", default: 0 })
	errorCount: number;

	@Column({ type: "jsonb", nullable: true })
	trends?: any;
}


