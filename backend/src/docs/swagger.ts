import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin Dashboard API',
      version: '1.0.0',
      description: 'API documentation for the MERN Admin Dashboard backend',
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64b1f4a4a1d2c1f0c4a239e7' },
            username: { type: 'string', example: 'admin' },
            email: { type: 'string', example: 'admin@company.com' },
            role: { type: 'string', enum: ['admin', 'user'], example: 'admin' },
            profile: {
              type: 'object',
              properties: {
                firstName: { type: 'string', example: 'Admin' },
                lastName: { type: 'string', example: 'User' },
                phone: { type: 'string', example: '+1-555-0100' },
                department: { type: 'string', example: 'Management' },
                avatar: { type: 'string', nullable: true, example: null }
              }
            },
            isActive: { type: 'boolean', example: true },
            lastLogin: { type: 'string', format: 'date-time', example: '2025-10-21T09:00:00Z' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-01-15T14:25:00Z' }
          },
          required: ['_id', 'username', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']
        },
        LearningResource: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64b1f51da1d2c1f0c4a239ec' },
            title: { type: 'string', example: 'Complete React Hooks Tutorial' },
            description: { type: 'string', example: 'Comprehensive guide covering useState, useEffect' },
            category: { type: 'string', enum: ['Tutorial', 'Article', 'Video', 'Course', 'Documentation'], example: 'Tutorial' },
            url: { type: 'string', format: 'uri', example: 'https://example.com/react-hooks' },
            tags: { type: 'array', items: { type: 'string' }, example: ['React', 'Hooks', 'JavaScript'] },
            difficulty: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'], example: 'Intermediate' },
            createdBy: {
              type: 'object',
              properties: {
                userId: { type: 'string', example: '64b1f4a4a1d2c1f0c4a239e7' },
                userName: { type: 'string', example: 'admin' },
                email: { type: 'string', example: 'admin@company.com' }
              }
            },
            views: { type: 'integer', example: 245 },
            likes: { type: 'integer', example: 89 },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2025-01-15T10:30:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-05-31T08:22:00Z' }
          },
          required: ['_id', 'title', 'category', 'url', 'createdBy', 'isActive', 'createdAt', 'updatedAt']
        },
        ToolResource: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64b1f51da1d2c1f0c4a239ed' },
            toolName: { type: 'string', example: 'Docker' },
            description: { type: 'string', example: 'Container platform' },
            category: { type: 'string', enum: ['DevOps', 'Frontend', 'Backend', 'Database', 'Design', 'Testing'], example: 'DevOps' },
            officialUrl: { type: 'string', format: 'uri', example: 'https://docker.com' },
            documentationUrl: { type: 'string', format: 'uri', example: 'https://docs.docker.com/' },
            logoUrl: { type: 'string', format: 'uri', example: 'https://docker.com/logo.png' },
            tags: { type: 'array', items: { type: 'string' }, example: ['container', 'devops'] },
            pricing: { type: 'string', enum: ['Free', 'Freemium', 'Paid', 'Open Source'], example: 'Freemium' },
            features: { type: 'array', items: { type: 'string' }, example: ['Easy containerization', 'Large community'] },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2023-01-15T10:30:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-05-31T08:22:00Z' }
          },
          required: ['_id', 'toolName', 'category', 'officialUrl', 'isActive', 'createdAt', 'updatedAt']
        },

        Intern: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64b1f51da1d2c1f0c4a5041a' },
            personalInfo: {
              type: 'object',
              properties: {
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
                phone: { type: 'string', example: '+1-555-0111' }
              }
            },
            internshipDetails: {
              type: 'object',
              properties: {
                startDate: { type: 'string', format: 'date', example: '2024-09-01' },
                endDate: { type: 'string', format: 'date', example: '2025-03-01' },
                department: { type: 'string', example: 'Engineering' },
                position: { type: 'string', example: 'Frontend Intern' },
                mentor: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string', example: '64b1f4a4a1d2c1f0c4a239e7' },
                    name: { type: 'string', example: 'Jane Manager' }
                  }
                },
                status: { type: 'string', enum: ['Active', 'Completed', 'On Leave', 'Terminated'], example: 'Active' }
              }
            },
            projects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  projectId: { type: 'string', example: '64b1f51da1d2c1f0c4a239ed' },
                  projectName: { type: 'string', example: 'Project X' },
                  role: { type: 'string', example: 'Developer' },
                  startDate: { type: 'string', format: 'date', example: '2024-09-01' },
                  endDate: { type: 'string', format: 'date', example: '2025-01-01' },
                  status: { type: 'string', enum: ['In Progress', 'Completed', 'On Hold'], example: 'In Progress' },
                  projectUrl: { type: 'string', format: 'uri', example: 'https://example.com/project-x' },
                  pdfUrl: { type: 'string', format: 'uri', example: 'https://example.com/doc.pdf' },
                  description: { type: 'string', example: 'Project description' },
                  technologies: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['React', 'Node.js']
                  },
                  teamMembers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        memberId: { type: 'string', example: '64b1f4a4a1d2c1f0c4a239e7' },
                        memberType: { type: 'string', enum: ['User', 'Intern'], example: 'User' },
                        name: { type: 'string', example: 'Alice' },
                        role: { type: 'string', example: 'Frontend Developer' }
                      }
                    }
                  }
                },
                required: ['projectId', 'projectName', 'status']
              }
            },

            dailyComments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date-time', example: '2025-01-10T10:00:00Z' },
                  comment: { type: 'string', example: 'Completed initial setup' },
                  taskDescription: { type: 'string', example: 'Setup environment' },
                  hoursWorked: { type: 'number', example: 4 },
                  status: { type: 'string', enum: ['Completed', 'In Progress', 'Blocked'], example: 'Completed' },
                  addedBy: {
                    type: 'object',
                    properties: {
                      userId: { type: 'string', example: '64b1f4a4a1d2c1f0c4a239e7' },
                      userName: { type: 'string', example: 'admin' },
                      role: { type: 'string', example: 'admin' }
                    },
                    required: ['userId']
                  }
                },
                required: ['date', 'comment', 'addedBy']
              }
            },

            meetingNotes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date-time', example: '2025-01-15T11:00:00Z' },
                  title: { type: 'string', example: 'Sprint Planning' },
                  agenda: { type: 'string', example: 'Discuss tasks for next sprint' },
                  notes: { type: 'string', example: 'Defined tasks and deliverables' },
                  attendees: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['John Doe', 'Jane Manager']
                  },
                  actionItems: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Complete feature A', 'Review PR B']
                  },
                  nextMeetingDate: { type: 'string', format: 'date-time', example: '2025-01-22T10:00:00Z' },
                  addedBy: {
                    type: 'object',
                    properties: {
                      userId: { type: 'string', example: '64b1f4a4a1d2c1f0c4a239e7' },
                      userName: { type: 'string', example: 'admin' },
                      role: { type: 'string', example: 'admin' }
                    },
                    required: ['userId']
                  }
                },
                required: ['date', 'notes', 'addedBy']
              }
            },

            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2024-08-01T12:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-12-01T09:00:00Z' }
          },
          required: ['_id', 'personalInfo', 'internshipDetails', 'isActive', 'createdAt', 'updatedAt']
        },

        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64b1f51da1d2c1f0c5b7f6a0' },
            projectName: { type: 'string', example: 'Admin Dashboard Enhancement' },
            description: { type: 'string', example: 'Adding new user management features' },
            status: { type: 'string', enum: ['Planning', 'In Progress', 'Completed', 'On Hold'], example: 'In Progress' },
            startDate: { type: 'string', format: 'date', example: '2024-09-15' },
            endDate: { type: 'string', format: 'date', example: '2024-12-31' },
            technologies: { type: 'array', items: { type: 'string' }, example: ['React', 'Node.js', 'MongoDB'] },
            teamMembers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  memberId: { type: 'string', example: '64b1f4a4a1d2c1f0c4a239e7' },
                  name: { type: 'string', example: 'Alice Developer' },
                  role: { type: 'string', example: 'Frontend Engineer' }
                }
              }
            },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2024-08-15T08:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-09-01T10:00:00Z' }
          },
          required: ['_id', 'projectName', 'status', 'isActive', 'createdAt', 'updatedAt']
        }

      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local dev server'
      }
    ]
  },
  apis: ['./src/routes/*.ts'], // path to route files with swagger comments
});
