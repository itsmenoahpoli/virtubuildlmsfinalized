import { UserRole } from "./user-role.dto";
import { userRolesRepository } from "@/database";
import { ListFilterKeys } from "@/types";

export class UserRolesService {
	public async fetchList(query: ListFilterKeys) {
		return userRolesRepository.find({ withDeleted: query.withDeleted as boolean });
	}

	public async fetchById(id: number) {
		const role = userRolesRepository.findOneBy({ id });

		return role;
	}

	public async updateById(id: number, data: UserRole) {
		const role = await userRolesRepository.update(id, data);

		if (role.affected) {
			return await this.fetchById(id);
		}

		return null;
	}

	public async deleteById(id: number) {
		const role = userRolesRepository.softDelete(id);

		return role;
	}

	public async create(data: UserRole) {
		if (await this.checkRoleExistence(data.name)) {
			return null;
		}

		const role = userRolesRepository.create(data);
		await userRolesRepository.save(role);

		return role;
	}

	public async checkRoleExistence(name: string) {
		const role = await userRolesRepository.findOneBy({ name });

		return role !== null;
	}
}
