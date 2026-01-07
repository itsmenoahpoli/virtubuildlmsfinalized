import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { LabActivity } from "./lab-activity.entity";
import { AssessmentSubmission } from "./assessment-submission.entity";

@Entity()
export class Assessment extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	labActivityId: number;

	@Column()
	title: string;

	@Column({ type: "text", nullable: true })
	description?: string;

	@Column({ type: "int", default: 30 })
	timeLimitMinutes: number;

	@Column({ type: "jsonb" })
	questions: any;

	@Column({ type: "boolean", default: true })
	isEnabled: boolean;

	@ManyToOne(() => LabActivity)
	@JoinColumn({ name: 'labActivityId' })
	labActivity?: LabActivity;

	@OneToMany(() => AssessmentSubmission, submission => submission.assessment)
	assessmentSubmissions?: AssessmentSubmission[];
}


