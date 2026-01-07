import { assessmentsRepository } from "@/database";

export class AssessmentsService {
	public async getByLabActivity(labActivityId: number) {
		return assessmentsRepository.find({ where: { labActivityId } });
	}

	public async listAll() {
		return assessmentsRepository.find({ where: { isEnabled: true } });
	}

	public async create(labActivityId: number, assessmentData: any) {
		const created = assessmentsRepository.create({
			labActivityId,
			...assessmentData,
			isEnabled: true
		});
		return assessmentsRepository.save(created);
	}

	public async update(id: number, assessmentData: any) {
		await assessmentsRepository.update(id, assessmentData);
		return assessmentsRepository.findOneBy({ id });
	}

	public async delete(id: number) {
		return assessmentsRepository.delete(id);
	}

	public async getById(id: number) {
		return assessmentsRepository.findOneBy({ id });
	}
}


