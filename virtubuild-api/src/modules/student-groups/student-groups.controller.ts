import { type Request, type Response, type NextFunction } from "express";
import { BaseController } from "@/modules/base.controller";
import { StudentGroupsService } from "./student-groups.service";
import { HttpStatusCode } from "@/types";
import { SendHttpResponse } from "@/utils";

export class StudentGroupsController extends BaseController {
	public studentGroupsService: StudentGroupsService;

	constructor() {
		super();
		this.studentGroupsService = new StudentGroupsService();
		this.bindClassMethods(this);
	}

	/**
	 * @swagger
	 * /student-groups:
	 *   post:
	 *     summary: Create a new student group
	 *     description: Create a new student group for organizing students
	 *     tags: [Student Groups]
	 *     security:
	 *       - BearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - name
	 *             properties:
	 *               name:
	 *                 type: string
	 *                 description: Group name
	 *               description:
	 *                 type: string
	 *                 description: Group description
	 *               isActive:
	 *                 type: boolean
	 *                 description: Whether the group is active
	 *     responses:
	 *       201:
	 *         description: Student group created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/StudentGroup'
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	public async createGroup(req: Request, res: Response) {
		try {
			const result = await this.studentGroupsService.createGroup(req.body);
			this.sendHttpResponse(res, result, HttpStatusCode.CREATED);
		} catch (error) {
			console.error("Error creating student group:", error);
			this.sendHttpResponse(res, { error: "Failed to create student group" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-groups:
	 *   get:
	 *     summary: Get all student groups
	 *     description: Retrieve all student groups with their assigned students
	 *     tags: [Student Groups]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: Student groups retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/StudentGroup'
	 *       500:
	 *         description: Internal server error
	 */
	public async getAllGroups(req: Request, res: Response) {
		try {
			const result = await this.studentGroupsService.getAllGroups();
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting student groups:", error);
			this.sendHttpResponse(res, { error: "Failed to get student groups" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-groups/{id}:
	 *   get:
	 *     summary: Get student group by ID
	 *     description: Retrieve a specific student group with its assigned students
	 *     tags: [Student Groups]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Student group ID
	 *     responses:
	 *       200:
	 *         description: Student group retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/StudentGroup'
	 *       404:
	 *         description: Student group not found
	 *       500:
	 *         description: Internal server error
	 */
	public async getGroupById(req: Request, res: Response) {
		try {
			const result = await this.studentGroupsService.getGroupById(+req.params.id);
			if (!result) {
				this.sendHttpResponse(res, { error: "Student group not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting student group:", error);
			this.sendHttpResponse(res, { error: "Failed to get student group" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-groups/{id}:
	 *   put:
	 *     summary: Update student group
	 *     description: Update a student group's information
	 *     tags: [Student Groups]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Student group ID
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               name:
	 *                 type: string
	 *                 description: Group name
	 *               description:
	 *                 type: string
	 *                 description: Group description
	 *               isActive:
	 *                 type: boolean
	 *                 description: Whether the group is active
	 *     responses:
	 *       200:
	 *         description: Student group updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/StudentGroup'
	 *       404:
	 *         description: Student group not found
	 *       500:
	 *         description: Internal server error
	 */
	public async updateGroup(req: Request, res: Response) {
		try {
			const result = await this.studentGroupsService.updateGroup(+req.params.id, req.body);
			if (!result) {
				this.sendHttpResponse(res, { error: "Student group not found" }, HttpStatusCode.NOT_FOUND);
			}
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error updating student group:", error);
			this.sendHttpResponse(res, { error: "Failed to update student group" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-groups/{id}:
	 *   delete:
	 *     summary: Delete student group
	 *     description: Delete a student group and remove all student assignments
	 *     tags: [Student Groups]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Student group ID
	 *     responses:
	 *       200:
	 *         description: Student group deleted successfully
	 *       404:
	 *         description: Student group not found
	 *       500:
	 *         description: Internal server error
	 */
	public async deleteGroup(req: Request, res: Response) {
		try {
			const result = await this.studentGroupsService.deleteGroup(+req.params.id);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error deleting student group:", error);
			this.sendHttpResponse(res, { error: "Failed to delete student group" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-groups/{groupId}/students/{studentId}:
	 *   post:
	 *     summary: Assign student to group
	 *     description: Assign a student to a specific group
	 *     tags: [Student Groups]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: groupId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Student group ID
	 *       - in: path
	 *         name: studentId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Student ID
	 *     responses:
	 *       200:
	 *         description: Student assigned to group successfully
	 *       400:
	 *         description: Bad request
	 *       500:
	 *         description: Internal server error
	 */
	public async assignStudentToGroup(req: Request, res: Response) {
		try {
			const result = await this.studentGroupsService.assignStudentToGroup(+req.params.studentId, +req.params.groupId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error assigning student to group:", error);
			this.sendHttpResponse(res, { error: "Failed to assign student to group" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-groups/{groupId}/students/{studentId}:
	 *   delete:
	 *     summary: Remove student from group
	 *     description: Remove a student from a specific group
	 *     tags: [Student Groups]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: groupId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Student group ID
	 *       - in: path
	 *         name: studentId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Student ID
	 *     responses:
	 *       200:
	 *         description: Student removed from group successfully
	 *       500:
	 *         description: Internal server error
	 */
	public async removeStudentFromGroup(req: Request, res: Response) {
		try {
			const result = await this.studentGroupsService.removeStudentFromGroup(+req.params.studentId, +req.params.groupId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error removing student from group:", error);
			this.sendHttpResponse(res, { error: "Failed to remove student from group" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-groups/{id}/students:
	 *   get:
	 *     summary: Get students in group
	 *     description: Retrieve all students assigned to a specific group
	 *     tags: [Student Groups]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Student group ID
	 *     responses:
	 *       200:
	 *         description: Students in group retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/StudentGroupAssignment'
	 *       500:
	 *         description: Internal server error
	 */
	public async getStudentsInGroup(req: Request, res: Response) {
		try {
			const result = await this.studentGroupsService.getStudentsInGroup(+req.params.id);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting students in group:", error);
			this.sendHttpResponse(res, { error: "Failed to get students in group" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @swagger
	 * /student-groups/student/{studentId}:
	 *   get:
	 *     summary: Get student's groups
	 *     description: Retrieve all groups that a student is assigned to
	 *     tags: [Student Groups]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: studentId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Student ID
	 *     responses:
	 *       200:
	 *         description: Student's groups retrieved successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/StudentGroupAssignment'
	 *       500:
	 *         description: Internal server error
	 */
	public async getStudentGroups(req: Request, res: Response) {
		try {
			const result = await this.studentGroupsService.getStudentGroups(+req.params.studentId);
			this.sendHttpResponse(res, result);
		} catch (error) {
			console.error("Error getting student groups:", error);
			this.sendHttpResponse(res, { error: "Failed to get student groups" }, HttpStatusCode.INTERNAL_SERVER_ERROR);
		}
	}
}
