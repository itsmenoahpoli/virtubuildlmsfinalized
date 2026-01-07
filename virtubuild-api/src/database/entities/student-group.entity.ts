import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { DateFieldsEntity } from "./shared.entity";
import { StudentGroupAssignment } from "./student-group-assignment.entity";

@Entity()
export class StudentGroup extends DateFieldsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ type: "text", nullable: true })
	description?: string;

	@Column({ type: "boolean", default: true })
	isActive: boolean;

	@OneToMany(() => StudentGroupAssignment, assignment => assignment.studentGroup)
	assignments: StudentGroupAssignment[];
}
