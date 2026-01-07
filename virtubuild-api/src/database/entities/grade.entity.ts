import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { User } from "./user.entity";
import { LabActivity } from "./lab-activity.entity";

@Entity()
export class Grade extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@Column()
	activityId: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;

	@ManyToOne(() => LabActivity)
	@JoinColumn({ name: 'activityId' })
	activity: LabActivity;

	@Column({ type: "float" })
	score: number;

	@Column({ type: "jsonb", nullable: true })
	breakdown?: any;
}


