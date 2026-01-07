import { type Request, type Response, type NextFunction } from "express";
import JWT from "jsonwebtoken";
import { SendHttpResponse } from "@/utils";
import { SETTINGS } from "@/configs";
import { HttpErrorTypes, HttpStatusCode } from "@/types";

interface AuthenticatedRequest extends Request {
	user?: any;
}

export const CheckAuthMiddleware = (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
	const header = request.header("Authorization");
	const token = header?.split(" ")[1];

	if (!header || !token) {
		SendHttpResponse(
			response,
			{
				message: HttpErrorTypes.UNAUTHORIZED_ERROR,
			},
			HttpStatusCode.UNAUTHORIZED,
		);

		return;
	}

	JWT.verify(token, SETTINGS.APP_JWT_SECRET_KEY, (error, user) => {
		if (error) {
			SendHttpResponse(response, { message: "FORBIDDEN" }, HttpStatusCode.FORBIDDEN);
			return;
		}

		request.user = user as any;
		next();
	});
};

export const CheckRoleMiddleware = (roles: string[]) => {
  return (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const currentUser = (request.user as any)?.user;
    if (!currentUser) {
      return SendHttpResponse(response, { message: HttpErrorTypes.UNAUTHORIZED_ERROR }, HttpStatusCode.UNAUTHORIZED);
    }

    if (!currentUser.userRoleId) {
      return SendHttpResponse(response, { message: HttpErrorTypes.FORBIDDEN_ERROR }, HttpStatusCode.FORBIDDEN);
    }

    const userRoleName = currentUser.roleName || currentUser.role || currentUser.userRoleName;
    if (userRoleName && roles.map(r => r.toLowerCase()).includes(String(userRoleName).toLowerCase())) {
      return next();
    }

    if (roles.includes(String(currentUser.userRoleId))) {
      return next();
    }

    return SendHttpResponse(response, { message: HttpErrorTypes.FORBIDDEN_ERROR }, HttpStatusCode.FORBIDDEN);
  };
};
