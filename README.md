# NestJS API Template

<p align="left">
  <a href="README.md">English</a> |
  <a href="README.ko.md">한국어</a>
</p>

A robust, scalable, and production-ready NestJS template for building RESTful APIs with TypeScript. This template provides a solid foundation for developing backend applications with best practices, modular architecture, and comprehensive testing capabilities.

## Features

- **NestJS Framework**: Built on top of NestJS 11, a progressive Node.js framework for building efficient and scalable server-side applications
- **TypeScript**: Fully typed codebase for better developer experience and code quality
- **MySQL Database**: Integration with MySQL via TypeORM for robust data persistence
- **Authentication System**:
  - Session-based authentication with Redis store for production
  - JWT authentication capabilities
  - Secure password hashing with bcrypt
- **API Versioning**: Structured API versioning (currently v1) for better API lifecycle management
- **Environment Configuration**:
  - Comprehensive environment configuration with validation using Joi
  - Support for different environments (development, test, production)
  - Centralized configuration service
- **Session Management**:
  - Redis-based session management for production
  - Memory-based sessions for development/testing
  - Configurable session options
- **Query Parsing**:
  - Built-in query parser for advanced filtering, pagination, and relation inclusion
  - Decorators for easy implementation of query features
- **Response Formatting**:
  - Consistent response formatting with interceptors
  - Response filtering with decorators
- **Validation**: Request validation using class-validator and class-transformer
- **Dynamic Service Factory**: Reusable service factory pattern for common CRUD operations
- **Testing Framework**:
  - Comprehensive Jest setup for unit and integration testing
  - Test utilities for database operations, authentication, and API testing
  - Factories for test data generation using Fishery and Faker

## Project Structure

```
src/
├── api/                  # API endpoints organized by version
│   └── v1/               # Version 1 API endpoints
│       ├── auth/         # Authentication related endpoints
│       │   ├── dto/      # Data Transfer Objects for auth
│       │   ├── guards/   # Authentication guards
│       │   └── test/     # Auth-specific tests
│       ├── users/        # User management endpoints
│       │   ├── test/     # User-specific tests
│       │   └── user.entity.ts  # User entity definition
│       └── posts/        # Post management endpoints
│           ├── test/     # Post-specific tests
│           └── post.entity.ts  # Post entity definition
├── common/               # Shared utilities, interceptors, and decorators
│   ├── base/             # Base classes and factories
│   │   └── dynamic-service.factory.ts  # Dynamic service factory
│   ├── decorators/       # Custom decorators
│   │   └── response.decorator.ts  # Response filtering decorator
│   ├── interceptors/     # Global interceptors
│   │   └── response-filter.interceptor.ts  # Response formatting
│   └── query-parser/     # Query parsing functionality
│       ├── decorators/   # Query parser decorators
│       ├── interceptors/ # Query parser interceptors
│       ├── interfaces/   # Query parser interfaces
│       └── services/     # Query parser services
├── config/               # Application configuration
│   ├── test/             # Test configuration and utilities
│   │   ├── jest.setup.ts # Jest setup configuration
│   │   └── test-utils.ts # Test utility functions
│   ├── typeorm/          # TypeORM specific configuration
│   ├── configuration.ts  # Configuration loader
│   └── env.config.ts     # Environment configuration service
├── session/              # Session management
│   ├── session.controller.ts  # Session controller
│   ├── session.module.ts      # Session module
│   └── session.service.ts     # Session service
└── main.ts               # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- Redis (for production environments)
- TypeScript knowledge
- NestJS familiarity

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd template-node-nestjs
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

4. Create a MySQL database:

```sql
CREATE DATABASE `template-node-nestjs-dev`;
```

## Running the Application

### Development

```bash
npm run start:dev
```

### Debug Mode

```bash
npm run start:debug
```

### Production

```bash
npm run build
npm run start:prd
```

## Testing

### Running Tests

```bash
npm test
```

### Test Structure

The template includes a comprehensive testing framework with:

- Unit tests for services and utilities
- Integration tests for API endpoints
- Test utilities for common testing tasks
- Test factories for generating test data

Test files are located alongside the modules they test with a `.spec.ts` suffix.

## Environment Configuration

The application uses different environment configurations:

- `.env.development` - Development environment
- `.env.test` - Test environment
- `.env.production` - Production environment

Example environment variables:

```
APP_NAME=APP_NAME
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_NAME=template-node-nestjs-dev

# Session configuration
SESSION_SECRET=my_session_secret
SESSION_MAX_AGE=86400000

# Redis configuration (for production)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=password
```

## API Endpoints

The API is structured with versioning:

### Authentication

- `POST /api/v1/auth/up` - Register a new user
- `POST /api/v1/auth/in` - Login a user

### Users

- `GET /api/v1/users` - List users
- `GET /api/v1/users/:id` - Get user details
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Posts

- `GET /api/v1/posts` - List posts
- `GET /api/v1/posts/:id` - Get post details
- `POST /api/v1/posts` - Create post
- `PUT /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post

## Query Parameters

The API supports advanced query parameters:

### Filtering

Filter records by field values:

```
GET /api/v1/posts?filter[published]=true
```

### Including Relations

Include related entities:

```
GET /api/v1/posts?include=author
```

### Pagination

Paginate results:

```
GET /api/v1/posts?page=1&perPage=10
```

## Database

The application uses TypeORM with MySQL. Database configuration is managed through environment variables.

### Entity Structure

- **User**: Represents application users

  - Fields: id, name, email, password, isActive, createdAt, updatedAt
  - Relations: One-to-many with Posts

- **Post**: Represents blog posts
  - Fields: id, title, content, published, createdAt, updatedAt, authorId
  - Relations: Many-to-one with User

## Session Management

Sessions are managed using express-session with:

- Memory store for development/test environments
- Redis store for production environments

Session configuration is customizable through environment variables.

## Authentication

The application supports:

- Session-based authentication
- Password hashing with bcrypt
- Authentication guards for protecting routes

## Development Tools

- **ESLint**: Code linting with custom configuration
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **SWC**: Fast TypeScript compilation

## Best Practices Implemented

- Separation of concerns with modular architecture
- Dependency injection for better testability
- Environment-specific configuration
- Consistent error handling
- Response formatting
- Query parameter parsing
- Comprehensive testing utilities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [UNLICENSED License](LICENSE).
