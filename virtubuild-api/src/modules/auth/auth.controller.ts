import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { AuthService } from "./auth.service";
import {
  SigninCredentialsDTO,
  SigninCredentials,
  SignupDataDTO,
  SignupData,
} from "./auth.dto";
import { ValidatePayload } from "@/decorators";
import { HttpErrorTypes, HttpStatusCode } from "@/types";

export class AuthController extends BaseController {
  public authService: AuthService;

  constructor() {
    super();

    this.authService = new AuthService();
    this.bindClassMethods(this);
  }

  /**
   * @swagger
   * /auth/signin:
   *   post:
   *     summary: Sign in user
   *     description: Authenticate user with email and password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SigninCredentials'
   *     responses:
   *       200:
   *         description: User successfully authenticated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       422:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @ValidatePayload(SigninCredentialsDTO)
  public async signinHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const result = await this.authService.signinAccount(
      request.body as SigninCredentials
    );

    if (!result) {
      return this.sendHttpResponse(
        response,
        HttpErrorTypes.UNAUTHORIZED_ERROR,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    this.sendHttpResponse(response, result, HttpStatusCode.OK);
  }

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Sign up new user
   *     description: Create a new user account
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignupData'
   *     responses:
   *       201:
   *         description: User successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       422:
   *         description: User already exists or validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @ValidatePayload(SignupDataDTO)
  public async signupHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const result = await this.authService.signupAccount(
      request.body as SignupData
    );

    if (result.accountExists) {
      return this.sendHttpResponse(
        response,
        HttpErrorTypes.ALREADY_EXISTS,
        HttpStatusCode.UNPROCESSABLE_ENTITY
      );
    }

    this.sendHttpResponse(response, result, HttpStatusCode.CREATED);
  }
}
