import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { UsersService } from "./users.service";
import { ValidateUrlParams, ValidatePayload } from "@/decorators";
import { SendHttpResponse } from "@/utils";
import { HttpStatusCode, ListFilterKeys } from "@/types";
import { User, UserDataDTO } from "./user.dto";

export class UsersController extends BaseController {
  public usersService: UsersService;

  constructor() {
    super();

    this.usersService = new UsersService();
    this.bindClassMethods(this);
  }

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users
   *     description: Retrieve a paginated list of all users with optional filtering
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of items per page
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search term for filtering users
   *       - in: query
   *         name: userRoleId
   *         schema:
   *           type: integer
   *         description: Filter by user role ID
   *       - in: query
   *         name: isEnabled
   *         schema:
   *           type: boolean
   *         description: Filter by enabled status
   *     responses:
   *       200:
   *         description: List of users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  public async fetchListHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const filtersFromQuery = this.generateListFilters(
      request.query as ListFilterKeys
    );
    const result = await this.usersService.fetchList(filtersFromQuery);

    return SendHttpResponse(response, result, HttpStatusCode.OK);
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     description: Retrieve a specific user by their ID
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  @ValidateUrlParams("id")
  public async fetchByIdHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const result = await this.usersService.fetchById(+request.params?.id);
    return SendHttpResponse(response, result, HttpStatusCode.OK);
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create new user
   *     description: Create a new user account
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       409:
   *         description: User already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @ValidatePayload(UserDataDTO)
  public async createHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const result = await this.usersService.createUser(request.body as User);

    if (!result) {
      return SendHttpResponse(
        response,
        "ALREADY_EXISTS",
        HttpStatusCode.UNPROCESSABLE_ENTITY
      );
    }

    return SendHttpResponse(response, result, HttpStatusCode.CREATED);
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update user
   *     description: Update an existing user by ID
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  @ValidateUrlParams("id")
  public async updateByIdHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const result = await this.usersService.updateById(
      +request.params?.id,
      request.body as User
    );

    return SendHttpResponse(response, result, HttpStatusCode.OK);
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete user
   *     description: Delete a user by ID
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  @ValidateUrlParams("id")
  public async deleteByIdHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const result = await this.usersService.deleteById(+request.params?.id);

    return SendHttpResponse(response, result, HttpStatusCode.OK);
  }

  /**
   * @swagger
   * /api/users/me:
   *   get:
   *     summary: Get my profile
   *     description: Retrieve the current authenticated user's profile
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  public async getMyProfileHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const userId = (request as any).user?.user?.id as number;
    const result = await this.usersService.fetchById(userId);
    return SendHttpResponse(response, result, HttpStatusCode.OK);
  }

  /**
   * @swagger
   * /api/users/me:
   *   put:
   *     summary: Update my profile
   *     description: Update the current authenticated user's profile
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *               middleName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  public async updateMyProfileHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const userId = (request as any).user?.user?.id as number;
    const result = await this.usersService.updateById(userId, request.body as User);
    return SendHttpResponse(response, result, HttpStatusCode.OK);
  }
}
