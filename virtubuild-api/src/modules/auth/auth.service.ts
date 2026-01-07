import JWT from "jsonwebtoken";
import { UsersService } from "@/modules/users/users.service";
import { RequestOtp, type SigninCredentials, type SignupData } from "./auth.dto";
import { verifyPassword } from "@/utils";
import { SETTINGS } from "@/configs";
import { userRolesRepository, UserEntity } from "@/database";

export class AuthService {
	public usersService: UsersService;

	constructor() {
		this.usersService = new UsersService();
	}

	public async signinAccount(credentials: SigninCredentials) {
		const user = await this.usersService.findByEmail(credentials.email) as UserEntity | null;
		const isPasswordVerified = user ? await verifyPassword(credentials.password, user?.password) : false;

		if (!user || !isPasswordVerified) {
			return null;
		}

		delete (user as any).password;
		let roleName: string | undefined = undefined;
		if (user.userRoleId) {
			const role = await userRolesRepository.findOneBy({ id: user.userRoleId as number });
			roleName = role?.name;
		}
		const authToken = JWT.sign({ user: { ...user, roleName } }, SETTINGS.APP_JWT_SECRET_KEY, { expiresIn: "1h" });

		return {
			authToken,
			user: {
				id: user.id,
				email: user.email,
				name: user.firstName + (user.middleName ? ' ' + user.middleName : '') + ' ' + user.lastName,
				firstName: user.firstName,
				lastName: user.lastName,
				roleName: roleName,
				avatar: null
			}
		};
	}

	public async signupAccount(accountData: SignupData) {
		const user = await this.usersService.findByEmail(accountData.email);

		if (user) {
			return {
				accountExists: true,
			};
		}

		const createUser = await this.usersService.createUser({ 
			...accountData, 
			isEnabled: true,
			isEmailVerified: false,
			twoFactorEnabled: false,
			failedLoginAttempts: 0
		});
		delete (createUser as any).password;

		return {
			accountExists: false,
			user: createUser,
		};
	}

	public async requestOtp(data: RequestOtp) {
		//
	}
}
