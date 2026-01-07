import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { User } from "./user.entity";
import { Assessment } from "./assessment.entity";

@Entity()
export class AssessmentSubmission extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	studentId: number;

	@Column()
	assessmentId: number;

	@Column({ type: "jsonb" })
	answers: any;

	@Column({ type: "int", default: 0 })
	score: number;

	@Column({ type: "int", default: 0 })
	timeSpentSeconds: number;

	@Column({ type: "boolean", default: false })
	isSubmitted: boolean;

	@Column({ type: "timestamp", nullable: true })
	submittedAt?: Date;

	@Column({ type: "jsonb", nullable: true })
	feedback?: any;

	@ManyToOne(() => User)
	@JoinColumn({ name: "studentId" })
	student: User;

	@ManyToOne(() => Assessment)
	@JoinColumn({ name: "assessmentId" })
	assessment: Assessment;
}
