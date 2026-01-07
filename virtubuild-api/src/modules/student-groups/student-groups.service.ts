import { studentGroupsRepository, studentGroupAssignmentsRepository, usersRepository } from "@/database";

export class StudentGroupsService {
	public async createGroup(groupData: any) {
		const group = studentGroupsRepository.create(groupData);
		return studentGroupsRepository.save(group);
	}

	public async getAllGroups() {
		return studentGroupsRepository.find({
			relations: ["assignments", "assignments.student"],
			order: { createdAt: "DESC" }
		});
	}

	public async getGroupById(id: number) {
		return studentGroupsRepository.findOne({
			where: { id },
			relations: ["assignments", "assignments.student"]
		});
	}

	public async updateGroup(id: number, updateData: any) {
		await studentGroupsRepository.update(id, updateData);
		return this.getGroupById(id);
	}

	public async deleteGroup(id: number) {
		await studentGroupAssignmentsRepository.delete({ studentGroupId: id });
		await studentGroupsRepository.delete(id);
		return { message: "Group deleted successfully" };
	}

	public async assignStudentToGroup(studentId: number, studentGroupId: number) {
		const existing = await studentGroupAssignmentsRepository.findOne({
			where: { studentId, studentGroupId }
		});

		if (existing) {
			return existing;
		}

		const assignment = studentGroupAssignmentsRepository.create({
			studentId,
			studentGroupId
		});

		return studentGroupAssignmentsRepository.save(assignment);
	}

	public async removeStudentFromGroup(studentId: number, studentGroupId: number) {
		await studentGroupAssignmentsRepository.delete({ studentId, studentGroupId });
		return { message: "Student removed from group successfully" };
	}

	public async getStudentsInGroup(studentGroupId: number) {
		return studentGroupAssignmentsRepository.find({
			where: { studentGroupId },
			relations: ["student"]
		});
	}

	public async getStudentGroups(studentId: number) {
		return studentGroupAssignmentsRepository.find({
			where: { studentId },
			relations: ["studentGroup"]
		});
	}
}
