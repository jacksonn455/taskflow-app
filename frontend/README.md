# Task Flow Frontend

A **modern and responsive** task management frontend built with **React**, **TypeScript**, and **Material UI**, designed to consume a secure backend API and provide an excellent user experience.

## 📋 Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [UI & UX Considerations](#ui--ux-considerations)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)
- [🔮 Future Improvements](#-future-improvements)
- [Author](#author)

## Technologies

- **React** – Component-based UI library for building user interfaces.
- **TypeScript** – Static typing for improved code quality and developer experience.
- **Material UI (MUI)** – Comprehensive component library for a consistent and modern UI.
- **Axios** – Promise-based HTTP client for efficient API communication.
- **React Router** – Declarative routing for client-side navigation.
- **Vite** – Next-generation frontend tooling for fast development and optimized builds.
- **Jest & React Testing Library** – Frameworks for unit and integration testing.

## Features

- ✅ **User Authentication** - JWT-based login and registration flow.
- ✅ **Task Management** - Complete CRUD operations (Create, Read, Update, Delete) and task completion functionality.
- ✅ **Status Visualization** - Color-coded task statuses (Pending, In Progress, Done) for quick visual identification.
- ✅ **Dashboard Stats** - Real-time task statistics overview for user productivity tracking.
- ✅ **Protected Routes** - Authentication guards to ensure secure access to application features.
- ✅ **Responsive Design** - Mobile-first layout ensuring optimal experience across all devices.
- ✅ **Error Handling** - User-friendly error messages and loading states for a smooth experience.
- ✅ **Reusable Components** - Modular architecture for high maintainability and rapid development.

### Key Design Patterns

- **Component Composition** - Focus on reusable, atomic components for UI construction.
- **Custom Hooks** - Logic extraction from components for better testability and reusability.
- **Context API** - Centralized state management for authentication and global settings.
- **Type-Safe API Calls** - Utilizing Axios with TypeScript interfaces for robust data handling.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Quick Start

1. **Clone the repository:**
    ```bash
    git clone https://github.com/jacksonn455/taskflow-app.git
    cd frontend
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

4. **Start the development server:**
    ```bash
    npm run dev
    ```

5. **Run tests:**
    ```bash
    npm run test          # Unit tests
    npm run test:cov      # Coverage report
    ```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory with the following variable:

```env
# Application
VITE_API_URL=http://localhost:3000
```
**💡 Note:** This variable points to the backend API base URL. Update it for production deployments.

## API Integration

The frontend communicates with the backend using **Axios** via a centralized service layer for consistent and authenticated API calls.

### API Service Example

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor for JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
All task-related operations are handled through `services/tasksService.ts`, ensuring type safety and error handling.

### Key API Calls

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | User authentication |
| `GET` | `/tasks` | Fetch user tasks (leveraging backend cache) |
| `POST` | `/tasks` | Create new task |
| `PATCH` | `/tasks/{id}` | Update task |
| `POST` | `/tasks/{id}/mark-done` | Complete task (triggers async event on backend) |
| `GET` | `/tasks/stats` | Fetch task statistics |

## Authentication Flow

The application uses a **JWT-based authentication flow** for secure user access:

1.  **User Login/Registration** - Form submission to the backend.
2.  **JWT Token Retrieval** - Backend returns the access token.
3.  **Token Storage** - Token is securely saved to `localStorage` for persistence.
4.  **Header Injection** - Token is automatically added to the `Authorization: Bearer {token}` header on every API request via an Axios interceptor.
5.  **Route Protection** - The `ProtectedRoute` component checks the authentication state before granting access.
6.  **Token Validation** - The backend verifies the token on each protected endpoint.
7.  **Logout** - Clears the token from `localStorage` and redirects the user to the login page.

### Security Notes

- ✅ **HTTPS in Production** - Highly recommended to enforce secure connections to prevent man-in-the-middle attacks.
- ✅ **Token Expiration Handling** - Implemented logic to handle `401 Unauthorized` errors, prompting token refresh or redirecting to login.
- ✅ **Input Sanitization** - Form validation is handled client-side using a library like React Hook Form to prevent common injection vulnerabilities.

## UI & UX Considerations

The design prioritizes user experience and accessibility:

- 📱 **Fully Responsive** - Adapts seamlessly to desktop, tablet, and mobile screen sizes.
- ⏳ **Loading States** - Uses spinners and skeletons during asynchronous operations to improve perceived performance.
- ❌ **Error Handling** - Provides clear, non-intrusive toast notifications for failures and warnings.
- 🎨 **Consistent Theme** - Utilizes Material UI with a custom theme for a professional and consistent look and feel.
- 📊 **Visual Feedback** - Employs status badges and progress indicators for immediate user feedback.
- ♿ **Accessibility** - Focus on ARIA labels and keyboard navigation support for WCAG compliance.

## Testing

The project uses **Jest** and **React Testing Library** for comprehensive testing:

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests (Placeholder for future)
# npm run test:e2e

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

### Test Coverage

- ✅ **Unit Tests** - Covers component rendering and custom hooks (e.g., `useAuth.test.tsx`).
- ✅ **Integration Tests** - Focuses on API service mocks and component interactions.
- ✅ **Snapshot Tests** - Used for checking UI consistency and preventing unintended changes.

### Example Test Output

```
PASS  src/hooks/useAuth.test.tsx
  useAuth
    ✓ should return initial state
    ✓ should login successfully
    ✓ should handle login error

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
Coverage:    92.1% statements
```

## Build & Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Options

- **Vercel** - Recommended for automatic deploys from GitHub and zero-config setup.
- **Netlify** - Excellent static hosting with continuous deployment features.
- **AWS S3 + CloudFront** - Scalable CDN distribution for high-performance global access.

**💡 Important:** Remember to update `VITE_API_URL` in your production build environment to point to the live backend URL.

## 🔮 Future Improvements

### Planned Features

- [ ] **E2E Tests** - Implement Cypress or Playwright for end-to-end workflow testing.
- [ ] **Dark Mode** - Add a theme toggle with `localStorage` persistence for user preference.
- [ ] **Real-time Updates** - Integrate WebSockets to receive live task changes from the backend.
- [ ] **Advanced Filters** - Implement search, sort, and tag-based task views.
- [ ] **Pagination** - Introduce infinite scroll or pagination for handling large task lists efficiently.
- [ ] **Accessibility Enhancements** - Work towards full WCAG compliance.

### Infrastructure

- [ ] **Storybook** - Component documentation and isolated testing environment.
- [ ] **CI/CD Pipeline** - Set up GitHub Actions for automated testing and deployment.
- [ ] **PWA Support** - Add service workers for offline capabilities and an installable app experience.

## Author

**Jackson Magnabosco**

<img src="https://avatars1.githubusercontent.com/u/46221221?s=460&u=0d161e390cdad66e925f3d52cece6c3e65a23eb2&v=4" width=115>

GitHub: [@jacksonn455](https://github.com/jacksonn455)

---
