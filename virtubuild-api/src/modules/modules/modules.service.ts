import { modulesRepository } from "@/database";

export class ModulesService {
	public async list() {
		return modulesRepository.find({ where: { isEnabled: true } });
	}
}


