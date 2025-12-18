# Task Flow Backend

Developed in Node.js with TypeScript (NestJS) with event-driven architecture.

## Project Structure

## Technologies

- **Node.js** with **TypeScript (NestJS)**
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mogoose** - ODM
- **RabbitMQ** - Message broker for async queues
- **Redis** - Cache and performance optimization
- **JWT** - Authentication and authorization
- **Swagger** - API documentation
- **Docker** - Containerization
- **New Relic** - Application Monitoring & Observability

## Features

- ✅ Domain-Driven Architecture
- ✅ Async transaction processing queue via RabbitMQ
- ✅ Balance and transaction caching with Redis
- ✅ JWT authentication
- ✅ Interactive documentation with Swagger
- ✅ Production-ready monitoring with New Relic (APM, distributed tracing, logs and alerts)

## Architecture

The service is built using a modular architecture, following best practices for scalability and maintainability:

- **Domain-Driven Architecture**: Organized by domain, facilitating navigation, testing, and future refactoring. This approach aligns with principles like Domain-Driven Design (DDD) and Clean Architecture.
- **API Layer:** Handles HTTP requests and responses, input validation, and authentication.
- **Message Queue:** RabbitMQ is used for processing asynchronously.
- **Cache:** Redis is utilized ...

## Installation

To install and run the project, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/jacksonn455/.git
    ```

2. **Enter the project folder:**
    ```bash
    cd wallet-service
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Setup environment variables:**
    ```bash
    cp .env.example .env
    ```
    Configure your environment variables in the `.env` file.

5. **Run the development server:**
    ```bash
    npm start
    ```

    **Run test:**
    ```bash
    npm run test
    ```

The API will be available at http://localhost:3001

## Environment Variables


## Messaging

The service uses **RabbitMQ** for asynchronous messaging, enabling reliable, scalable, and decoupled transaction processing.

## API Documentation

Comprehensive API documentation is available at:

```
http://localhost:3001/api-docs
```

### Swagger Features
- Interactive API Explorer: Test endpoints directly from the browser
- Request/Response Schemas: View detailed model definitions
- Authentication Support: Configure JWT tokens
- Real-time Testing: Execute API calls with sample data
- Downloadable OpenAPI specification

## Docker Setup

You can run the service using either **Docker** or **Docker Compose**.

### Using Docker

1. **Build the Docker image:**
    ```bash
    docker build -t wallet-service .
    ```

2. **Run the Docker container:**
    ```bash
    docker run -p 3001:3001 wallet-service
    ```

3. **Access the API:**
    Open your browser and go to `http://localhost:3001`.

### Using Docker Compose

1. **Start the services:**
    ```bash
    docker-compose up --build
    ```

2. **Access the API:**
    Open your browser and go to `http://localhost:3001`.

> The `docker-compose.yml` file includes all necessary services like PostgreSQL, Redis, and RabbitMQ.

## Authentication & Security

This project uses **JWT authentication** to secure API routes. To access protected resources, include the JWT token in the `Authorization` header as a Bearer token.

## Testing

The project uses **Jest** for unit and integration tests, ensuring code reliability and correctness.

## Monitoring

This application is integrated with **New Relic APM** for comprehensive monitoring:

### Features
- **Real-time Performance Tracking:** Monitor API response times and throughput
- **Distributed Tracing:** End-to-end transaction tracing
- **Error Analytics:** Automatic error tracking with context
- **Infrastructure Monitoring:** Memory usage and CPU performance

### Main Metrics
- API endpoint performance
- Database query performance
- Transaction processing times
- Authentication success/failure rates
- Cache hit/miss ratios

## 🔮 Future Improvements
- Centralized log storage using MongoDB
- Test coverage and code quality analysis with SonarQube
- CI/CD automation with quality gates

## Gitflow & Code Review

This project follows Gitflow practices:
- Development was done using feature branches
- At least one Pull Request was created and reviewed
- All changes were merged into the main branch via PR

## Author

<img src="https://avatars1.githubusercontent.com/u/46221221?s=460&u=0d161e390cdad66e925f3d52cece6c3e65a23eb2&v=4" width=115>  

<sub>@jacksonn455</sub>

---