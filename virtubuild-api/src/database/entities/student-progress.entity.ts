import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { User } from "./user.entity";
import { LabActivity } from "./lab-activity.entity";

@Entity()
export class StudentProgress extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	studentId: number;

	@Column()
	activityId: number;

	@Column({ type: "boolean", default: false })
	isCompleted: boolean;

	@Column({ type: "int", default: 0 })
	score: number;

	@Column({ type: "int", default: 0 })
	timeSpentSeconds: number;

	@Column({ type: "int", default: 0 })
	attempts: number;

	@Column({ type: "jsonb", nullable: true })
	progressData?: any;

	@Column({ type: "jsonb", nullable: true })
	componentPlacements?: any;

	@ManyToOne(() => User)
	@JoinColumn({ name: "studentId" })
	student: User;

	@ManyToOne(() => LabActivity)
	@JoinColumn({ name: "activityId" })
	activity: LabActivity;
}
