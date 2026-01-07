import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { UserRolesService } from "./user-roles.service";
import { ValidateUrlParams, ValidatePayload } from "@/decorators";
import { SendHttpResponse } from "@/utils";
import { HttpStatusCode, ListFilterKeys } from "@/types";
import { UserRole, UserRoleDTO } from "./user-role.dto";

export class UserRolesController extends BaseController {
  public userRolesService: UserRolesService;

  constructor() {
    super();

    this.userRolesService = new UserRolesService();
    this.bindClassMethods(this);
  }

  /**
   * @swagger
   * /user-roles:
   *   get:
   *     summary: Get all user roles
   *     description: Retrieve a list of all user roles with optional filtering
   *     tags: [User Roles]
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
   *         description: Search term for filtering roles
   *     responses:
   *       200:
   *         description: List of user roles retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   */
  public async fetchListHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const filtersFromQuery = this.generateListFilters(
      request.query as ListFilterKeys
    );
    const result = await this.userRolesService.fetchList(filtersFromQuery);

    return SendHttpResponse(response, result, HttpStatusCode.OK);
  }

  /**
   * @swagger
   * /user-roles/{id}:
   *   get:
   *     summary: Get user role by ID
   *     description: Retrieve a specific user role by its ID
   *     tags: [User Roles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User role ID
   *     responses:
   *       200:
   *         description: User role retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       404:
   *         description: User role not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @ValidateUrlParams("id")
  public async fetchByIdHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    //
  }

  /**
   * @swagger
   * /user-roles/{id}:
   *   patch:
   *     summary: Update user role
   *     description: Update an existing user role by ID
   *     tags: [User Roles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User role ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRole'
   *     responses:
   *       200:
   *         description: User role updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       404:
   *         description: User role not found
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
  @ValidateUrlParams("id")
  public async updateByIdHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const result = await this.userRolesService.updateById(
      +request.params?.id,
      request.body as UserRole
    );

    return SendHttpResponse(response, result, HttpStatusCode.OK);
  }

  /**
   * @swagger
   * /user-roles/{id}:
   *   delete:
   *     summary: Delete user role
   *     description: Delete a user role by ID
   *     tags: [User Roles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User role ID
   *     responses:
   *       200:
   *         description: User role deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       404:
   *         description: User role not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @ValidateUrlParams("id")
  public async deleteByIdHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const result = await this.userRolesService.deleteById(+request.params?.id);

    return SendHttpResponse(response, result, HttpStatusCode.OK);
  }

  /**
   * @swagger
   * /user-roles:
   *   post:
   *     summary: Create new user role
   *     description: Create a new user role
   *     tags: [User Roles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRole'
   *     responses:
   *       201:
   *         description: User role created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       422:
   *         description: Role already exists or validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  @ValidatePayload(UserRoleDTO)
  public async createHandler(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const result = await this.userRolesService.create(request.body as UserRole);

    if (!result) {
      return SendHttpResponse(
        response,
        "ALREADY_EXISTS",
        HttpStatusCode.UNPROCESSABLE_ENTITY
      );
    }

    return SendHttpResponse(response, result, HttpStatusCode.CREATED);
  }
}
