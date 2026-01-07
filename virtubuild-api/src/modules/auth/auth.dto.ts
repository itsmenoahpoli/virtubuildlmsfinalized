import { IsNotEmpty, IsEmail, IsString, IsOptional } from "class-validator";
import { type RequestOtpType } from "@/types";

export type SigninCredentials = {
	email: string;
	password: string;
};

export type SignupData = {
	firstName: string;
	middleName?: string;
	lastName: string;
} & SigninCredentials;

export type RequestOtp = {
	type: RequestOtpType;
} & Pick<SigninCredentials, "email">;

export class SigninCredentialsDTO implements SigninCredentials {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}

export class SignupDataDTO extends SigninCredentialsDTO implements SignupData {
	@IsNotEmpty()
	@IsString()
	firstName: string;

	@IsOptional()
	@IsString()
	middleName?: string;

	@IsNotEmpty()
	@IsString()
	lastName: string;
}

export class RequestOtpDTO implements RequestOtp {
	@IsNotEmpty()
	@IsString()
	type: RequestOtpType;

	@IsNotEmpty()
	@IsEmail()
	email: string;
}
