# Task Flow Backend

A robust task management system developed in Node.js with TypeScript (NestJS) featuring event-driven architecture, caching, and real-time monitoring.

## 📋 Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Cache Strategy](#cache-strategy)
- [Message Queue](#message-queue)
- [Docker Setup](#docker-setup)
- [Authentication & Security](#authentication--security)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Future Improvements](#-future-improvements)

## Technologies

- **Node.js** with **TypeScript (NestJS)** - Modern and scalable backend framework
- **Express** - Fast web framework
- **MongoDB** with **Mongoose** - NoSQL database and ODM for data persistence
- **RabbitMQ** - Message broker for asynchronous event processing
- **Redis** - In-memory cache for performance optimization
- **JWT** - Secure authentication and authorization
- **Swagger** - Interactive API documentation
- **Docker** - Containerization for easy deployment
- **New Relic** - APM for application monitoring and observability
- **Jest** - Testing framework for unit and integration tests

## Features

- ✅ **Domain-Driven Architecture** - Organized by domain for better scalability
- ✅ **Event-Driven Design** - Asynchronous processing with RabbitMQ
- ✅ **Redis Cache** - 5-minute TTL for task queries optimization
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Soft Delete** - Tasks are marked as deleted, not removed
- ✅ **Real-time Stats** - Task statistics by status
- ✅ **Interactive Swagger Docs** - Complete API documentation
- ✅ **New Relic Integration** - Custom events and performance metrics
- ✅ **Comprehensive Tests** - Unit and E2E test coverage

## Architecture

The service is built using a modular architecture following best practices:

```
src/
├── config/
│   ├── mongodb/          # MongoDB connection config
│   ├── redis/            # Redis cache config
│   ├── rabbitmq/         # RabbitMQ message broker config
│   └── newrelic/         # New Relic APM config
├── modules/
│   ├── auth/             # Authentication & JWT guards
│   ├── users/            # User management
│   └── tasks/            # Task CRUD & business logic
│       ├── entities/     # MongoDB schemas
│       ├── dto/          # Data Transfer Objects
│       ├── tasks.controller.ts
│       ├── tasks.service.ts
│       ├── tasks.consumer.ts  # RabbitMQ event consumer
│       └── tasks.module.ts
└── common/
    ├── filters/          # Global exception handling
    └── interceptors/     # Response transformation
```

### Key Design Patterns

- **Domain-Driven Design (DDD)** - Clear separation of concerns
- **Event-Driven Architecture** - Decoupled async processing via RabbitMQ
- **Cache-Aside Pattern** - Redis cache with automatic invalidation
- **Repository Pattern** - Data access abstraction with Mongoose

## Installation

### Prerequisites

- Node.js 18+ 
- MongoDB 4.4+
- Redis 6+
- RabbitMQ 3.8+

### Quick Start

1. **Clone the repository:**
    ```bash
    git clone https://github.com/jacksonn455/taskflow-app.git
    cd task-flow-backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Setup environment variables:**
    ```bash
    cp .env.example .env
    ```
    Configure your environment variables in the `.env` file (see [Environment Variables](#environment-variables) section).

4. **Run with Docker Compose (Recommended):**
    ```bash
    docker-compose up -d
    ```

5. **Run the development server:**
    ```bash
    npm run start:dev
    ```

6. **Run tests:**
    ```bash
    npm run test          # Unit tests
    npm run test:e2e      # E2E tests
    npm run test:cov      # Coverage report
    ```

The API will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Application
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/taskflow

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=300000  # 5 minutes in milliseconds

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_QUEUE=tasks_queue

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1d

# New Relic (Optional)
NEW_RELIC_APP_NAME=TaskFlow API
NEW_RELIC_LICENSE_KEY=your-license-key
```

## API Endpoints

### Authentication

#### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "Jackson Magnabosco",
  "email": "jackson@email.com",
  "password": "123456"
}

# Response (201 Created)
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "jackson@email.com",
  "password": "123456"
}

# Response (200 OK)
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Users

#### Get Current User
```bash
GET /users/me
Authorization: Bearer {token}

# Response (200 OK)
{
  "_id": "6944664ca7b0abee8ec9a0b7",
  "name": "Jackson Magnabosco",
  "email": "jackson@email.com",
  "isActive": true,
  "createdAt": "2025-12-18T20:38:36.891Z",
  "updatedAt": "2025-12-21T22:30:56.822Z",
  "lastLogin": "2025-12-21T22:30:56.822Z"
}
```

### Tasks (All endpoints require authentication)

#### Create Task
```bash
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Implementar funcionalidade X",
  "description": "Desenvolver a feature conforme especificação",
  "status": "PENDING",
  "dueDate": "2024-12-31T23:59:59Z"
}

# Response (201 Created)
{
  "_id": "694878c78729ef7cc6fd90f6",
  "title": "Implementar funcionalidade X",
  "description": "Desenvolver a feature conforme especificação",
  "status": "PENDING",
  "dueDate": "2024-12-31T23:59:59Z",
  "isDeleted": false,
  "createdAt": "2025-12-21T22:46:31.296Z",
  "updatedAt": "2025-12-21T22:46:31.296Z"
}
```

#### List All Tasks
```bash
GET /tasks
Authorization: Bearer {token}

# Response (200 OK)
[
  {
    "_id": "694878c78729ef7cc6fd90f6",
    "title": "Implementar funcionalidade X",
    "description": "Desenvolver a feature conforme especificação",
    "status": "PENDING",
    "dueDate": "2024-12-31T23:59:59Z",
    "isDeleted": false,
    "createdAt": "2025-12-21T22:46:31.296Z",
    "updatedAt": "2025-12-21T22:46:31.296Z"
  }
]
```
**💡 Cache Note:** First request fetches from MongoDB. Subsequent requests within 5 minutes are served from Redis cache for improved performance.

#### Get Task by ID
```bash
GET /tasks/{id}
Authorization: Bearer {token}

# Response (200 OK)
{
  "_id": "6948752f1181a1b0abc119cd",
  "title": "Implementar funcionalidade X",
  "description": "Desenvolver a feature conforme especificação",
  "status": "PENDING",
  ...
}
```

#### Update Task
```bash
PATCH /tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Título atualizado",
  "status": "IN_PROGRESS"
}

# Response (200 OK)
{
  "_id": "6948752f1181a1b0abc119cd",
  "title": "Título atualizado",
  "status": "IN_PROGRESS",
  "updatedAt": "2025-12-21T22:35:32.269Z",
  ...
}
```
**💡 Cache Note:** Cache is automatically invalidated on update.

#### Mark Task as Done
```bash
POST /tasks/{id}/mark-done
Authorization: Bearer {token}

# Response (200 OK)
{
  "_id": "6948752f1181a1b0abc119cd",
  "title": "Título atualizado",
  "status": "DONE",
  "completedAt": "2025-12-21T22:40:18.078Z",
  ...
}
```
**🎯 Special Feature:** This endpoint triggers an asynchronous event via RabbitMQ for additional processing (notifications, analytics, etc.).

#### Get Task Statistics
```bash
GET /tasks/stats
Authorization: Bearer {token}

# Response (200 OK)
{
  "total": 15,
  "pending": 5,
  "inProgress": 7,
  "done": 3
}
```

#### Delete Task (Soft Delete)
```bash
DELETE /tasks/{id}
Authorization: Bearer {token}

# Response (204 No Content)
```
**💡 Note:** Tasks are soft-deleted (marked as deleted) and remain in the database for audit purposes.

## Cache Strategy

### Redis Implementation

The application uses **Redis** for caching task queries with the following strategy:

#### Cache Key Pattern
```
tasks:user:{userId}
```

#### Cache Flow
1. **Cache Miss** (First Request):
   ```
   Client → API → MongoDB → Redis (store) → Client
   ```
   - Data fetched from MongoDB
   - Stored in Redis with 5-minute TTL
   - Returns to client

2. **Cache Hit** (Subsequent Requests):
   ```
   Client → API → Redis → Client
   ```
   - Data served directly from Redis
   - ~10x faster response time
   - Reduced MongoDB load

#### Cache Invalidation
Cache is automatically invalidated on:
- ✅ Task creation
- ✅ Task update
- ✅ Task deletion
- ✅ Mark as done

#### Performance Metrics
Monitor cache effectiveness via New Relic:
- `Custom/Cache/Hit` - Successful cache retrievals
- `Custom/Cache/Miss` - Database queries required

#### Verify Cache
```bash
# Connect to Redis CLI
redis-cli

# List all keys
KEYS *

# View specific cache
GET tasks:user:6944664ca7b0abee8ec9a0b7

# Check TTL
TTL tasks:user:6944664ca7b0abee8ec9a0b7
```

## Message Queue

### RabbitMQ Integration

The service uses **RabbitMQ** for asynchronous event processing, enabling reliable, scalable, and decoupled task management.

#### Events Published

| Event | Trigger | Payload |
|-------|---------|---------|
| `task.created` | Task creation | `{ taskId, userId, title, timestamp }` |
| `task.updated` | Task update | `{ taskId, userId, changes, timestamp }` |
| `task.completed` | Mark as done | `{ taskId, userId, title, completedAt, timestamp }` |
| `task.deleted` | Task deletion | `{ taskId, userId, timestamp }` |

#### Consumer Implementation

The `TasksConsumer` processes events asynchronously:

```typescript
@EventPattern('task.completed')
async handleTaskCompleted(data: any) {
  // Send email notification
  await emailService.sendCompletionEmail(data.userId, data.title);
  
  // Update user statistics
  await statsService.incrementCompletedTasks(data.userId);
  
  // Track in New Relic
  newrelic.recordCustomEvent('TaskCompletedEvent', data);
}
```

#### Benefits
- ✅ **Decoupling** - API responds immediately, processing happens async
- ✅ **Reliability** - Messages persist until processed
- ✅ **Scalability** - Multiple consumers can process events in parallel
- ✅ **Retry Logic** - Failed events can be retried automatically

#### Monitor Queue
1. Access RabbitMQ Management UI: `http://localhost:15672`
2. Login: `guest` / `guest`
3. Navigate to **Queues** tab
4. View `tasks_queue` for message statistics

#### Queue Metrics
- Total messages
- Message rate
- Consumer count
- Unacknowledged messages

## API Documentation

Comprehensive interactive API documentation is available via Swagger:

```
http://localhost:3000/api/docs
```

### Swagger Features
- 📖 **Interactive API Explorer** - Test endpoints directly from the browser
- 📋 **Request/Response Schemas** - View detailed model definitions
- 🔐 **Authentication Support** - Configure JWT tokens with "Authorize" button
- 🧪 **Real-time Testing** - Execute API calls with sample data
- 📥 **Downloadable OpenAPI Spec** - Export API specification

### Using Swagger
1. Open `http://localhost:3000/api/docs`
2. Click **"Authorize"** button (top right)
3. Enter your JWT token: `Bearer {your-token}`
4. Click **"Authorize"** then **"Close"**
5. All endpoints are now authenticated - try them out!

## Docker Setup

### Using Docker Compose (Recommended)

The `docker-compose.yml` includes all necessary services:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up --build
```

#### Services Included
- **app** - NestJS application (port 3000)
- **mongodb** - Database (port 27017)
- **redis** - Cache (port 6379)
- **rabbitmq** - Message broker (ports 5672, 15672)

### Using Docker Only

```bash
# Build image
docker build -t task-flow-backend .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI=your-mongodb-uri \
  -e REDIS_HOST=your-redis-host \
  -e RABBITMQ_URL=your-rabbitmq-url \
  task-flow-backend
```

## Authentication & Security

### JWT Authentication

This project uses **JWT (JSON Web Tokens)** for secure authentication:

#### Token Structure
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "iat": 1766357183,
  "exp": 1766443583
}
```

#### Token Usage
Include the JWT token in the `Authorization` header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Security Features
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Token Expiration** - 24-hour validity
- ✅ **Protected Routes** - JWT guard on all task endpoints
- ✅ **User Isolation** - Tasks scoped to authenticated user
- ✅ **Input Validation** - class-validator on all DTOs

#### Token Lifecycle
1. User registers or logs in
2. Server generates JWT with user info
3. Client stores token (localStorage/cookie)
4. Client sends token with each request
5. Server validates token and extracts user
6. Token expires after 24 hours

## Testing

The project uses **Jest** for comprehensive testing:

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

### Test Coverage

- ✅ **Unit Tests** - Service layer logic (tasks.service.spec.ts)
- ✅ **Integration Tests** - Controller endpoints
- ✅ **E2E Tests** - Full request/response cycle
- ✅ **Mock Services** - RabbitMQ, Redis, MongoDB

### Example Test Output
```
PASS  src/modules/tasks/tasks.service.spec.ts
  TasksService
    ✓ should be defined
    create
      ✓ should create a new task
      ✓ should emit event to RabbitMQ
    findAll
      ✓ should return cached tasks
      ✓ should fetch from database on cache miss
    markAsDone
      ✓ should mark task as done and emit event

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Coverage:    85.4% statements
```

## Monitoring

### New Relic APM Integration

This application is integrated with **New Relic** for comprehensive observability:

#### Custom Events Tracked
- `TaskCreated` - When a task is created
- `TaskUpdated` - When a task is updated
- `TaskCompleted` - When a task is marked as done
- `TaskDeleted` - When a task is deleted

#### Custom Metrics
- `Custom/Cache/Hit` - Redis cache hits
- `Custom/Cache/Miss` - Redis cache misses

#### Monitoring Dashboard

Access New Relic dashboard to view:

1. **Performance Metrics**
   - API endpoint response times
   - Database query performance
   - Cache hit/miss ratios

2. **Transaction Tracing**
   - End-to-end request tracking
   - Distributed tracing across services
   - Bottleneck identification

3. **Error Analytics**
   - Automatic error capture with stack traces
   - Error rate trends
   - Impact analysis

4. **Infrastructure Metrics**
   - CPU and memory usage
   - MongoDB query performance
   - Redis operations
   - RabbitMQ message rates

#### Configure New Relic

1. Sign up at [newrelic.com](https://newrelic.com)
2. Get your license key
3. Add to `.env`:
   ```bash
   NEW_RELIC_LICENSE_KEY=your-license-key
   NEW_RELIC_APP_NAME=TaskFlow API
   ```
4. Restart application
5. View metrics in New Relic dashboard

## 🔮 Future Improvements

### Planned Features
- [ ] **WebSocket Support** - Real-time task updates
- [ ] **Email Notifications** - Task completion alerts via SendGrid/AWS SES
- [ ] **Advanced Filters** - Search tasks by date, priority, tags
- [ ] **Task Sharing** - Collaborative task management
- [ ] **File Attachments** - Upload files to tasks using AWS S3
- [ ] **Task Comments** - Discussion threads on tasks
- [ ] **Recurring Tasks** - Automated task creation on schedules

### Infrastructure
- [ ] **Kubernetes Deployment** - Production orchestration
- [ ] **CI/CD Pipeline** - GitHub Actions with quality gates
- [ ] **SonarQube Integration** - Code quality and security analysis
- [ ] **Centralized Logging** - ELK Stack or CloudWatch
- [ ] **Rate Limiting** - API throttling with Redis
- [ ] **API Versioning** - v2 endpoint support

## Gitflow & Code Review

This project follows **Gitflow** best practices:

- ✅ Development done using feature branches
- ✅ Pull Requests created and reviewed
- ✅ Code merged via PR into main branch
- ✅ Semantic commit messages
- ✅ Branch protection rules enforced

### Branch Structure
```
main
  └── develop
       ├── feature/task-crud
       ├── feature/rabbitmq-integration
       └── feature/redis-cache
```

## Author

**Jackson Magnabosco**

<img src="https://avatars1.githubusercontent.com/u/46221221?s=460&u=0d161e390cdad66e925f3d52cece6c3e65a23eb2&v=4" width=115>

GitHub: [@jacksonn455](https://github.com/jacksonn455)

---