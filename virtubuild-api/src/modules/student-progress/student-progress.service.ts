import { studentProgressRepository, labActivitiesRepository, studentGroupAssignmentsRepository } from "@/database";

export class StudentProgressService {
	public async createProgress(progressData: any) {
		const progress = studentProgressRepository.create(progressData);
		return studentProgressRepository.save(progress);
	}

	public async getStudentProgress(studentId: number) {
		return studentProgressRepository.find({
			where: { studentId },
			relations: ["activity"],
			order: { createdAt: "DESC" }
		});
	}

	public async getProgressByActivity(activityId: number) {
		return studentProgressRepository.find({
			where: { activityId },
			relations: ["student"],
			order: { createdAt: "DESC" }
		});
	}

	public async getStudentProgressForActivity(studentId: number, activityId: number) {
		return studentProgressRepository.findOne({
			where: { studentId, activityId },
			relations: ["activity"]
		});
	}

	public async updateProgress(id: number, updateData: any) {
		await studentProgressRepository.update(id, updateData);
		return studentProgressRepository.findOne({
			where: { id },
			relations: ["student", "activity"]
		});
	}

	public async submitProgress(studentId: number, activityId: number, progressData: any) {
		const existing = await this.getStudentProgressForActivity(studentId, activityId);
		
		if (existing) {
			return this.updateProgress(existing.id, progressData);
		}

		return this.createProgress({
			studentId,
			activityId,
			...progressData
		});
	}

	public async getAssignedActivities(studentId: number) {
		// Since LabActivity is now standalone, return all enabled lab activities
		return labActivitiesRepository.find({
			where: { isEnabled: true }
		});
	}

	public async getAssignedModules(studentId: number) {
		// Since LabActivity is now standalone, return all enabled lab activities
		return labActivitiesRepository.find({
			where: { isEnabled: true }
		});
	}

	public async getInstructorStudentProgress() {
		return studentProgressRepository.find({
			relations: ["student", "activity"],
			order: { createdAt: "DESC" }
		});
	}

	public async getStudentCompletionStats(studentId: number) {
		const progress = await this.getStudentProgress(studentId);
		const total = progress.length;
		const completed = progress.filter(p => p.isCompleted).length;
		
		return {
			total,
			completed,
			completionRate: total > 0 ? (completed / total) * 100 : 0,
			averageScore: total > 0 ? progress.reduce((sum, p) => sum + p.score, 0) / total : 0
		};
	}
}
