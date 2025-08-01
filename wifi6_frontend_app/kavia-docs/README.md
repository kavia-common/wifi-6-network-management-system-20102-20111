# WiFi 6 Frontend App

This container delivers a modern, minimalistic React frontend app for the WiFi 6 Network Management System.

## Architecture Overview

- **Tech Stack:** React 18, React Router v6, Axios, CSS Modules
- **Main Features:**
    - User registration/login (JWT auth)
    - Dashboard: overview of devices and configs
    - Device CRUD (list, add, edit, delete)
    - Config CRUD (list, add, edit, delete)
    - Responsive layout (navbar, sidebar, content area)
    - Theme support (light/dark toggle)

## Key File & Component Structure

- `src/App.js`: Main app, sets up routing and global theme. All protected routes use `RequireAuth` wrapper.
- `src/components/Navbar.js`: Displays app title, nav links, login/logout, and theme switcher. Hidden/visible links based on auth state.
- `src/components/Sidebar.js`: Sidebar menu for dashboard, devices, configs (hidden on login/register).
- `src/pages/`: Pages for Dashboard, Devices (list, form), Configs (list, form), Auth (Login, Register).
- `src/api/index.js`: Axios instance with JWT injection in headers for API calls.
- `src/utils/auth.js`: Utility for managing auth token in localStorage.

## Routing & Navigation

Routing is managed using React Router v6. Only `/login` and `/register` are accessible without authentication. All other routes (dashboard, devices, configs) require a valid JWT token (checked via `RequireAuth`).

**Route Paths:**

| Route                | Auth?  | View          | Description                        |
|----------------------|--------|---------------|------------------------------------|
| `/login`             | No     | LoginPage     | User login                         |
| `/register`          | No     | RegisterPage  | User registration                  |
| `/` or `/dashboard`  | Yes    | DashboardPage | Overview/dashboard                 |
| `/devices`           | Yes    | DevicesPage   | List all devices                   |
| `/devices/new`       | Yes    | DeviceFormPage| Add a new device                   |
| `/devices/:id/edit`  | Yes    | DeviceFormPage| Edit an existing device            |
| `/configs`           | Yes    | ConfigsPage   | List all configs                   |
| `/configs/new`       | Yes    | ConfigFormPage| Add a new configuration            |
| `/configs/:id/edit`  | Yes    | ConfigFormPage| Edit an existing configuration     |

## Authentication Flow

- On login/register, JWT (from backend) is saved to browser localStorage
- All API requests (via Axios) have the JWT automatically attached
- If not authenticated, users are redirected to `/login`
- Logging out clears localStorage and redirects to `/login`

## API Usage

All backend interaction happens via `api/index.js`, which exports a pre-configured Axios instance:

- Base URL comes from `REACT_APP_API_BASE_URL` env var (or defaults to localhost)
- Interceptors attach the JWT to every request

Sample API use (in a component):
```js
import api from "../api";

api.get("/devices/") // fetch devices
api.post("/configs/", {...}) // create config
```

## Theming

Users can toggle between light and dark themes (CSS custom properties). The theme preference is managed via React state and propagated via the document attribute.

## Development & Testing

- `npm install` to install dependencies
- `npm start` to run the app (default: http://localhost:3000)
- `npm test` for unit/integration tests (uses Testing Library + MSW for API mocks)

**Environment:** Set `REACT_APP_API_BASE_URL` (see `.env.example`)

---
**Note:** The frontend expects the backend to be available and CORS-enabled at the API base URL. All tokens and sensitive info are stored on the client for demo — production systems should implement advanced security best practices.
