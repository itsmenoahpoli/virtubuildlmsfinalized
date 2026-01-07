import { moduleActivationsRepository } from "@/database";

export class ActivationsService {
	public async listByModule(moduleId: number) {
		return moduleActivationsRepository.find({ where: { moduleId } });
	}

	public async activate(moduleId: number, groupName: string) {
		const existing = await moduleActivationsRepository.findOneBy({ moduleId, groupName });
		if (existing) {
			await moduleActivationsRepository.update(existing.id, { isActive: true });
			return moduleActivationsRepository.findOneBy({ id: existing.id });
		}
		const created = moduleActivationsRepository.create({ moduleId, groupName, isActive: true });
		return moduleActivationsRepository.save(created);
	}

	public async deactivate(moduleId: number, groupName: string) {
		const existing = await moduleActivationsRepository.findOneBy({ moduleId, groupName });
		if (!existing) return null;
		await moduleActivationsRepository.update(existing.id, { isActive: false });
		return moduleActivationsRepository.findOneBy({ id: existing.id });
	}
}


