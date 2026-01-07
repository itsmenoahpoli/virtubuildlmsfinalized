import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { User } from "./user.entity";
import { StudentGroup } from "./student-group.entity";

@Entity()
export class StudentGroupAssignment extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	studentId: number;

	@Column()
	studentGroupId: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "studentId" })
	student: User;

	@ManyToOne(() => StudentGroup)
	@JoinColumn({ name: "studentGroupId" })
	studentGroup: StudentGroup;
}
