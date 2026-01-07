import { assessmentSubmissionsRepository, assessmentsRepository } from "@/database";

export class AssessmentSubmissionsService {
	public async submitAssessment(studentId: number, assessmentId: number, submissionData: any) {
		const existing = await assessmentSubmissionsRepository.findOne({
			where: { studentId, assessmentId }
		});

		if (existing) {
			await assessmentSubmissionsRepository.update(existing.id, {
				answers: submissionData.answers,
				timeSpentSeconds: submissionData.timeSpentSeconds,
				isSubmitted: true,
				score: this.calculateScore(submissionData.answers, assessmentId)
			});
			return assessmentSubmissionsRepository.findOne({
				where: { id: existing.id },
				relations: ["student", "assessment"]
			});
		}

		const submission = assessmentSubmissionsRepository.create({
			studentId,
			assessmentId,
			answers: submissionData.answers,
			timeSpentSeconds: submissionData.timeSpentSeconds,
			isSubmitted: true,
			score: this.calculateScore(submissionData.answers, assessmentId)
		});

		return assessmentSubmissionsRepository.save(submission);
	}

	public async getStudentSubmissions(studentId: number) {
		return assessmentSubmissionsRepository.find({
			where: { studentId },
			relations: ["assessment"],
			order: { createdAt: "DESC" }
		});
	}

	public async getSubmissionById(submissionId: number) {
		return assessmentSubmissionsRepository.findOne({
			where: { id: submissionId },
			relations: ["student", "assessment"]
		});
	}

	public async getSubmissionsByAssessment(assessmentId: number) {
		return assessmentSubmissionsRepository.find({
			where: { assessmentId },
			relations: ["student"],
			order: { createdAt: "DESC" }
		});
	}

	public async updateSubmission(submissionId: number, updateData: any) {
		await assessmentSubmissionsRepository.update(submissionId, updateData);
		return this.getSubmissionById(submissionId);
	}

	public async addFeedback(submissionId: number, feedback: any) {
		await assessmentSubmissionsRepository.update(submissionId, { feedback });
		return this.getSubmissionById(submissionId);
	}

	public async getStudentAssessmentHistory(studentId: number) {
		const submissions = await this.getStudentSubmissions(studentId);
		
		return submissions.map(submission => ({
			id: submission.id,
			assessmentId: submission.assessmentId,
			assessmentTitle: submission.assessment.title || "Assessment",
			score: submission.score,
			timeSpent: submission.timeSpentSeconds,
			isSubmitted: submission.isSubmitted,
			feedback: submission.feedback,
			submittedAt: submission.updatedAt
		}));
	}

	public async getAssessmentResults(assessmentId: number) {
		const submissions = await this.getSubmissionsByAssessment(assessmentId);
		
		const stats = {
			totalSubmissions: submissions.length,
			averageScore: submissions.length > 0 ? submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length : 0,
			averageTimeSpent: submissions.length > 0 ? submissions.reduce((sum, s) => sum + s.timeSpentSeconds, 0) / submissions.length : 0,
			completionRate: submissions.length > 0 ? (submissions.filter(s => s.isSubmitted).length / submissions.length) * 100 : 0
		};

		return {
			submissions,
			stats
		};
	}

	private calculateScore(answers: any, assessmentId: number): number {
		// This is a simplified scoring algorithm
		// In a real implementation, you would compare answers against the correct answers
		// stored in the assessment entity
		const totalQuestions = Object.keys(answers).length;
		const correctAnswers = Object.values(answers).filter((answer: any) => answer.isCorrect).length;
		
		return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
	}
}
