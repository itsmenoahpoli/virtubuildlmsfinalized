import { User } from "./user.dto";
import { usersRepository } from "@/database";
import { encryptPassword } from "@/utils";
import { ListFilterKeys } from "@/types";

export class UsersService {
	public async findByEmail(email: string): Promise<User | null> {
		const user = await usersRepository.findOneBy({ email });

		return user;
	}

	public async createUser(data: User): Promise<User> {
		const user = usersRepository.create({
			...data,
			password: await encryptPassword(data.password),
		});
		await usersRepository.save(user);

		return user;
	}

	public async fetchList(filters: ListFilterKeys): Promise<any> {
		const { page = 1, limit = 10, search, userRoleId, isEnabled } = filters as any;
		const queryBuilder = usersRepository.createQueryBuilder("user");

		if (search) {
			queryBuilder.where(
				"user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search",
				{ search: `%${search}%` }
			);
		}

		if (userRoleId) {
			queryBuilder.andWhere("user.userRoleId = :userRoleId", { userRoleId });
		}

		if (isEnabled !== undefined) {
			queryBuilder.andWhere("user.isEnabled = :isEnabled", { isEnabled });
		}

		const [users, total] = await queryBuilder
			.skip((page - 1) * limit)
			.take(limit)
			.getManyAndCount();

		return {
			data: users,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		};
	}

	public async fetchById(id: number): Promise<User | null> {
		const user = await usersRepository.findOneBy({ id });
		return user;
	}

	public async updateById(id: number, data: Partial<User>): Promise<User | null> {
		const user = await usersRepository.findOneBy({ id });
		if (!user) return null;

		if (data.password) {
			data.password = await encryptPassword(data.password);
		}

		Object.assign(user, data);
		await usersRepository.save(user);
		return user;
	}

	public async deleteById(id: number): Promise<boolean> {
		const result = await usersRepository.delete({ id });
		return result.affected !== 0;
	}
}
