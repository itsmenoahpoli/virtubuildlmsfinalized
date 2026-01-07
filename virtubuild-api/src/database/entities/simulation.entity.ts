import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { User } from "./user.entity";
import { LabActivity } from "./lab-activity.entity";

@Entity()
export class Simulation extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	studentId: number;

	@Column()
	activityId: number;

	@Column({ type: "varchar", default: "not_started" })
	status: string;

	@Column({ type: "jsonb", nullable: true })
	simulationState?: any;

	@Column({ type: "jsonb", nullable: true })
	componentPlacements?: any;

	@Column({ type: "int", default: 0 })
	score: number;

	@Column({ type: "int", default: 0 })
	timeSpentSeconds: number;

	@Column({ type: "int", default: 0 })
	errors: number;

	@Column({ type: "jsonb", nullable: true })
	steps?: any;

	@ManyToOne(() => User)
	@JoinColumn({ name: "studentId" })
	student: User;

	@ManyToOne(() => LabActivity)
	@JoinColumn({ name: "activityId" })
	activity: LabActivity;
}
