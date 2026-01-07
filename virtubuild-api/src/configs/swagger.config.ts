import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VirtuBuild API - Production Ready Backend",
      version: "2.0.0",
      description: "Production-ready Node.js + Express + TypeScript + TypeORM backend for the VirtuBuild educational platform. Features enhanced authentication, Redis caching, comprehensive audit logging, real-time notifications, and advanced analytics.",
      contact: {
        name: "VirtuBuild Development Team",
        email: "dev@virtubuild.com",
        url: "https://virtubuild.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:9000/",
        description: "Development Server",
        variables: {
          port: {
            enum: ["9000", "3000"],
            default: "9000"
          }
        }
      },
      {
        url: "https://api.virtubuild.com/api",
        description: "Production Server"
      },
      {
        url: "https://staging-api.virtubuild.com/api",
        description: "Staging Server"
      }
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints"
      },
      {
        name: "Users",
        description: "User management and profile operations"
      },
      {
        name: "User Roles",
        description: "Role-based access control management"
      },
      {
        name: "Modules",
        description: "Educational module management"
      },
      {
        name: "Activities",
        description: "Lab activities and hands-on exercises"
      },
      {
        name: "Assessments",
        description: "Assessment creation and management"
      },
      {
        name: "Assessment Submissions",
        description: "Student assessment submissions and grading"
      },
      {
        name: "Grades",
        description: "Grade management and tracking"
      },
      {
        name: "Student Groups",
        description: "Student group management and assignments"
      },
      {
        name: "Student Progress",
        description: "Student progress tracking and analytics"
      },
      {
        name: "Simulations",
        description: "Virtual simulation management"
      },
      {
        name: "Gamification",
        description: "Gamification features and achievements"
      },
      {
        name: "Analytics",
        description: "Performance analytics and reporting"
      },
      {
        name: "Activations",
        description: "Module activation management"
      },
      {
        name: "Admin",
        description: "Administrative functions and system management"
      },
      {
        name: "System",
        description: "System health and status endpoints"
      }
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID"
            },
            userRoleId: {
              type: "integer",
              description: "User role ID"
            },
            firstName: {
              type: "string",
              description: "User's first name"
            },
            middleName: {
              type: "string",
              description: "User's middle name"
            },
            lastName: {
              type: "string",
              description: "User's last name"
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address"
            },
            isEnabled: {
              type: "boolean",
              description: "Whether the user account is enabled"
            },
            isEmailVerified: {
              type: "boolean",
              description: "Whether the user's email is verified"
            },
            twoFactorEnabled: {
              type: "boolean",
              description: "Whether two-factor authentication is enabled"
            },
            failedLoginAttempts: {
              type: "integer",
              description: "Number of failed login attempts"
            }
          }
        },
        UserRole: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Role ID"
            },
            name: {
              type: "string",
              description: "Role name"
            },
            description: {
              type: "string",
              description: "Role description"
            },
            isEnabled: {
              type: "boolean",
              description: "Whether the role is enabled"
            }
          }
        },
        Module: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Module ID"
            },
            title: {
              type: "string",
              description: "Module title"
            },
            description: {
              type: "string",
              description: "Module description"
            },
            steps: {
              type: "object",
              description: "Module steps and content"
            },
            isEnabled: {
              type: "boolean",
              description: "Whether the module is enabled"
            }
          }
        },
        LabActivity: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Activity ID"
            },
            moduleId: {
              type: "integer",
              description: "Parent module ID"
            },
            title: {
              type: "string",
              description: "Activity title"
            },
            description: {
              type: "string",
              description: "Activity description"
            },
            componentsMetadata: {
              type: "object",
              description: "Activity components and metadata"
            },
            gamification: {
              type: "object",
              description: "Gamification settings"
            },
            isEnabled: {
              type: "boolean",
              description: "Whether the activity is enabled"
            }
          }
        },
        Assessment: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Assessment ID"
            },
            moduleId: {
              type: "integer",
              description: "Parent module ID"
            },
            quiz: {
              type: "object",
              description: "Assessment quiz data"
            },
            isEnabled: {
              type: "boolean",
              description: "Whether the assessment is enabled"
            }
          }
        },
        Grade: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Grade ID"
            },
            userId: {
              type: "integer",
              description: "User ID"
            },
            activityId: {
              type: "integer",
              description: "Activity ID"
            },
            score: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "Grade score (0-100)"
            },
            breakdown: {
              type: "object",
              description: "Detailed grade breakdown"
            }
          }
        },
        StudentGroup: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Group ID"
            },
            name: {
              type: "string",
              description: "Group name"
            },
            description: {
              type: "string",
              description: "Group description"
            },
            maxStudents: {
              type: "integer",
              description: "Maximum number of students"
            },
            isActive: {
              type: "boolean",
              description: "Whether the group is active"
            }
          }
        },
        StudentGroupAssignment: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Assignment ID"
            },
            userId: {
              type: "integer",
              description: "User ID"
            },
            groupId: {
              type: "integer",
              description: "Group ID"
            },
            assignedAt: {
              type: "string",
              format: "date-time",
              description: "Assignment timestamp"
            }
          }
        },
        StudentProgress: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Progress ID"
            },
            userId: {
              type: "integer",
              description: "User ID"
            },
            moduleId: {
              type: "integer",
              description: "Module ID"
            },
            status: {
              type: "string",
              enum: ["not_started", "in_progress", "completed", "failed"],
              description: "Progress status"
            },
            progressPercentage: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "Progress percentage"
            },
            timeSpent: {
              type: "integer",
              description: "Time spent in minutes"
            },
            lastAccessedAt: {
              type: "string",
              format: "date-time",
              description: "Last access timestamp"
            }
          }
        },
        Simulation: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Simulation ID"
            },
            title: {
              type: "string",
              description: "Simulation title"
            },
            description: {
              type: "string",
              description: "Simulation description"
            },
            category: {
              type: "string",
              description: "Simulation category"
            },
            difficulty: {
              type: "string",
              enum: ["beginner", "intermediate", "advanced"],
              description: "Simulation difficulty"
            },
            estimatedDuration: {
              type: "integer",
              description: "Estimated duration in minutes"
            },
            requirements: {
              type: "array",
              items: {
                type: "string"
              },
              description: "System requirements"
            },
            isActive: {
              type: "boolean",
              description: "Whether the simulation is active"
            }
          }
        },
        ModuleActivation: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Activation ID"
            },
            moduleId: {
              type: "integer",
              description: "Module ID"
            },
            groupName: {
              type: "string",
              description: "Group name"
            },
            isActive: {
              type: "boolean",
              description: "Whether the activation is active"
            },
            startDate: {
              type: "string",
              format: "date",
              description: "Activation start date"
            },
            endDate: {
              type: "string",
              format: "date",
              description: "Activation end date"
            },
            progress: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "Activation progress percentage"
            }
          }
        },
        PerformanceAnalytics: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Analytics ID"
            },
            userId: {
              type: "integer",
              description: "User ID"
            },
            activityId: {
              type: "integer",
              description: "Activity ID"
            },
            timeSpentSeconds: {
              type: "integer",
              description: "Time spent in seconds"
            },
            errorCount: {
              type: "integer",
              description: "Number of errors"
            },
            trends: {
              type: "object",
              description: "Performance trends data"
            }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true
            },
            message: {
              type: "string",
              example: "Operation completed successfully"
            },
            data: {
              type: "object",
              description: "Response data"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false
            },
            message: {
              type: "string",
              example: "An error occurred"
            },
            error: {
              type: "string",
              description: "Error details"
            }
          }
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object"
              }
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "integer",
                  description: "Current page number"
                },
                limit: {
                  type: "integer",
                  description: "Items per page"
                },
                total: {
                  type: "integer",
                  description: "Total number of items"
                },
                totalPages: {
                  type: "integer",
                  description: "Total number of pages"
                }
              }
            }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token for authentication"
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "API key for authentication"
        }
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication information is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error"
              }
            }
          }
        },
        ForbiddenError: {
          description: "Access denied - insufficient permissions",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error"
              }
            }
          }
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error"
              }
            }
          }
        },
        ValidationError: {
          description: "Validation error - invalid input data",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error"
              }
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: "page",
          in: "query",
          description: "Page number for pagination",
          required: false,
          schema: {
            type: "integer",
            default: 1,
            minimum: 1
          }
        },
        LimitParam: {
          name: "limit",
          in: "query",
          description: "Number of items per page",
          required: false,
          schema: {
            type: "integer",
            default: 10,
            minimum: 1,
            maximum: 100
          }
        },
        SortParam: {
          name: "sort",
          in: "query",
          description: "Sort field and direction (e.g., 'createdAt:desc')",
          required: false,
          schema: {
            type: "string",
            example: "createdAt:desc"
          }
        },
        SearchParam: {
          name: "search",
          in: "query",
          description: "Search term for filtering results",
          required: false,
          schema: {
            type: "string",
            example: "john"
          }
        },
        DateFromParam: {
          name: "dateFrom",
          in: "query",
          description: "Start date for filtering (ISO 8601 format)",
          required: false,
          schema: {
            type: "string",
            format: "date-time",
            example: "2024-01-01T00:00:00Z"
          }
        },
        DateToParam: {
          name: "dateTo",
          in: "query",
          description: "End date for filtering (ISO 8601 format)",
          required: false,
          schema: {
            type: "string",
            format: "date-time",
            example: "2024-12-31T23:59:59Z"
          }
        }
      }
    },
  },
  apis: ["./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: "VirtuBuild API Documentation - Production Ready Backend",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    requestInterceptor: (req: any) => {
      // Add custom headers or modify requests
      req.headers['X-Requested-With'] = 'XMLHttpRequest';
      return req;
    },
    responseInterceptor: (res: any) => {
      // Add custom response handling
      return res;
    }
  }
};

export { swaggerSpec, swaggerUi };