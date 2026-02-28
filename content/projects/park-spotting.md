---
title: Park Spotting
shortDescription: Two mobile apps—driver and park-owner—for parking spot booking, with admin workspaces, GeoDjango, and AWS deployment (App Runner, ECS Fargate, Amplify).
tech:
  - Python
  - Django
  - Django REST Framework
  - JWT
  - GeoDjango / PostGIS
  - Celery
  - Redis
  - AWS App Runner
  - ECS Fargate
  - AWS Amplify
  - AWS Secrets Manager
  - GitHub Actions
  - ECR
  - Docker
year: "2025"
thumbnail: /projects/park-spotting/thumbnail.png
client: Personal
---

## Executive Summary

Park Spotting is a parking spot booking system built around two mobile apps: one for drivers (users who search and book spots) and one for park owners (admins who register locations and spots and invite managers to handle bookings). Drivers discover and book parking at admin-registered locations; park owners create workspaces, register locations and spots (with optional GIS data), and add users to manage their parking spot bookings. The system exposes a REST API protected by JWT, supports slot-based and area-based capacity, and uses background workers for async jobs. The backend is deployed on AWS (App Runner for the API, ECS Fargate for workers), with both mobile apps hosted via Amplify and secrets in Secrets Manager.

---

## Problem Statement and Goals

**Problem Statement:**

- **Fragmented visibility:** Parking availability and pricing were hard to discover in one place for drivers.
- **Manual coordination:** Admins had no structured way to register spots, set rates, or manage capacity (slots vs area).
- **Ad-hoc access control:** No clear model for multiple staff (admins vs managers) per parking operation.
- **Scalability and operations:** A single monolith would not scale cleanly for API vs background workloads; secrets and deployment needed a clear, repeatable pattern.

**Goals:**

- **Dual mobile experience:** Two apps—one for drivers (booking), one for park owners (managing spots and bookings)—sharing one backend for workspaces, locations, spots, and bookings.
- **Role-based management:** Admins own workspaces and can add managers to help manage their parking spots and bookings.
- **Flexible capacity and pricing:** Support both slot-based and area-based spots with configurable hourly rates.
- **Cloud-native deployment:** Use managed services (App Runner, Fargate, Amplify, Secrets Manager, ECR) with CI/CD via GitHub Actions.
- **Learning and portfolio:** Apply Django, GeoDjango, Celery, and AWS in a cohesive case study.

---

## System Architecture

**Application Architecture**

| Application       | Path      | Technology            | Target Users                                      |
| ----------------- | --------- | --------------------- | ------------------------------------------------- |
| REST API          | `/api/*`  | Django, DRF, Gunicorn | Driver app and park-owner app                     |
| Auth              | `/auth/*` | Django, SimpleJWT     | All authenticated users (drivers, managers, admins) |
| Admin (optional)  | `/admin/` | Django Admin          | Internal operators                                |

The driver app and the park-owner app both authenticate via JWT (login/refresh) and send the Bearer token on API requests. Communication is REST over HTTPS. WebSockets and push notifications are not part of the current design; real-time updates and push are out of scope for this case study.

**Diagram (application/system architecture)**

![System Design](/projects/park-spotting/system_design.png)

**Deployment Architecture**

| Component        | Technology       | Hosting                | Description                                         |
| ---------------- | ---------------- | ---------------------- | --------------------------------------------------- |
| API              | Docker, Gunicorn | AWS App Runner         | Serves REST API and auth; scales on demand          |
| Background tasks | Celery           | ECS Fargate            | Async jobs (e.g. notifications, cleanup)            |
| Frontend         | —                | AWS Amplify            | Driver app and park-owner app build and hosting     |
| Database         | PostgreSQL       | RDS or similar         | PostGIS for locations; app data                     |
| Cache / broker   | Redis            | ElastiCache or similar | Celery broker and cache                             |
| Secrets          | —                | AWS Secrets Manager    | DB credentials, JWT secret, API keys                |
| Images           | —                | ECR                    | Docker images for API and workers                   |
| CI/CD            | —                | GitHub Actions         | Build, test, push to ECR, deploy App Runner/Fargate |

**Network Architecture (deployment topology)**

![Network Architecture](/projects/park-spotting/network_architecture.png)

**Supporting Components**

| Component            | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| PostgreSQL / PostGIS | Primary data store; spatial data for locations |
| Redis                | Celery message broker and optional cache       |
| Django Admin         | Optional back-office for data inspection       |

---

## System Design

**API Design**

- **Base path:** `/` (API under `/api/`, auth under `/auth/`).
- **Authentication:** JWT Bearer (access + refresh). Login and refresh at `/auth/login`, `/auth/refresh`; register at `/auth/register`.
- **WebSocket:** Not used; no real-time channel in the current design.
- **Push notifications:** Not in scope; no device tokens or push service integration.

| Prefix             | Module                                       |
| ------------------ | -------------------------------------------- |
| `/auth/`           | Authentication (login, refresh, register)    |
| `/api/workspaces/` | Workspaces (CRUD, membership)                |
| `/api/locations/`  | Locations (per workspace, with point)        |
| `/api/spots/`      | Parking spots (per location, capacity, rate) |
| `/api/bookings/`   | Bookings (create, list, update, cancel)      |

**Pattern:** REST with controller/service layers; ViewSets and routers for resources. Background work handled asynchronously by Celery workers.

**Authentication and Authorization**

- **Methods:** JWT (SimpleJWT); access token in `Authorization: Bearer <token>`.
- **Roles:** User (driver), Workspace Admin (owner), Workspace Manager (member). Data scoped by workspace: admins and managers see only their workspace's locations, spots, and related bookings; drivers see their own bookings.

**Data Flow (High Level)**

- **Request/response:** Both mobile apps send HTTP requests with JWT; API validates token, applies role and workspace scoping, returns JSON.
- **Real-time / push:** WebSockets and push notifications are not implemented; polling or future integration of a push service could be added.
- **Files/exports:** Not in scope for the initial case study; can be added as async tasks producing files stored in S3.

**Key Backend Components**

| Component       | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| API application | Django app with DRF: workspaces, locations, parking spots, bookings, auth            |
| Workers         | Celery workers for scheduled and triggered tasks (e.g. reminders, cleanup)           |
| Migrations      | Django migrations for schema (User, Workspace, Location, ParkingSpot, Booking, etc.) |
| Entities        | User, Workspace, WorkspaceMember, Location, ParkingSpot, Booking, VehicleFootprint   |

---

## Domain and Feature Summary

| Area             | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| Authentication   | Register, login, JWT refresh; custom User model with UUID                 |
| Workspaces       | Admins create workspaces; invite members with Admin or Manager role       |
| Locations        | Workspace-scoped locations with address and GeoDjango point               |
| Parking spots    | Per location; slot-based or area-based capacity; base hourly rate         |
| Bookings         | User books a spot for a time range; vehicle type; check-in/out; status   |
| Vehicle types    | Vehicle footprint config (e.g. CAR, BIKE) for area-based capacity         |
| Authorization    | Role and workspace scoping for all workspace/location/spot/booking access |
| Background jobs  | Celery tasks for notifications, expiry, or reporting                      |
| Admin (optional) | Django Admin for support or internal use                                  |

**Out of scope:** Payment processing, WebSockets, push notifications, real-time availability updates, and native mobile SDKs are out of scope for this case study.

---

## Development and Operations

**Monorepo and Local Development**

The project is structured as a single repository: backend (Django app, Celery), Docker Compose for local database and Redis, and configuration split by environment. Local development uses a Python virtual environment (Poetry), database migrations, and a local Redis and PostGIS instance. Testing uses pytest; code style is enforced with pre-commit (e.g. Black, isort). No repository-specific env var names, CLI commands, or file paths are documented here so the case study remains portable.

**CI**

| Workflow       | Scope            | Jobs                                        |
| -------------- | ---------------- | ------------------------------------------- |
| Main / PR      | On push/PR       | Lint, test, build Docker image, push to ECR |
| Deploy API     | On main (or tag) | Deploy API image to App Runner              |
| Deploy workers | On main (or tag) | Deploy worker image to ECS Fargate          |

**CD**

Staging and production deployments are triggered from the main branch (or tags). Build and push happen in CI; deployment steps use the images in ECR and configuration (e.g. task definition, App Runner service) that reference secrets from AWS Secrets Manager rather than in-repo env files. Amplify builds and deploys the frontend from the same or a linked repo when configured.

---

## Summary

Park Spotting is a Django-based REST API with JWT auth, GeoDjango/PostGIS, and Celery workers, deployed on AWS using App Runner (API), ECS Fargate (workers), Amplify (driver and park-owner mobile apps), Secrets Manager, and ECR, with CI/CD via GitHub Actions. Two mobile apps—one for drivers, one for park owners—consume the API for workspace-scoped locations, spots, and bookings; WebSockets and push notifications are not part of the current design. The case study documents the path from local development and testing through to built images and deployed environments without including runbook-level detail.
