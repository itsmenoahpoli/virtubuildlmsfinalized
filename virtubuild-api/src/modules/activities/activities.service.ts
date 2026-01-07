import { labActivitiesRepository } from "@/database";

export class ActivitiesService {
	public async listAll() {
		return labActivitiesRepository.find({ where: { isEnabled: true } });
	}

	public async getById(id: number) {
		return labActivitiesRepository.findOneBy({ id });
	}

	public async update(id: number, data: any) {
		await labActivitiesRepository.update(id, data);
		return labActivitiesRepository.findOneBy({ id });
	}
}


