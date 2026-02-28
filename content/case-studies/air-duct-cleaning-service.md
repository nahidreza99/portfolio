---
title: Air Duct Cleaning Service
shortDescription: Service management system for scheduling, fleet and resource management, request workflows, and financial tracking—delivered as a pnpm monorepo with FastAPI, React, and Expo.
tech:
  - FastAPI
  - React
  - Expo
  - PostgreSQL
  - Celery
  - Redis
  - AWS
  - Terraform
  - GitHub Actions
year: "2024"
thumbnail: /case_study/air_duct_cleaning/thumbnail.png
client: Confidential
---

## Executive Summary

This system is a service management platform built for an **air duct cleaning and insulation company**. It provides a single platform for administrators, managers, and field employees to manage scheduling, vehicle fleets, resources, request workflows (tools, clothing, time-off), and financial transactions (expenses, spiffs). The system consists of a REST API backend, a web portal for administrators and managers, and a mobile app for field employees. Together they deliver self-service for employees, location-level oversight for managers, and organization-wide configuration and audit for administrators.

---

## Problem Statement and Goals

### Problem Statement

- **Fragmented visibility:** Field operations lacked a centralized view of schedules, vehicle assignments, and resource availability.
- **Disconnected processes:** Requests for tools, clothing, and time-off were handled through ad-hoc channels (email, spreadsheets, verbal requests), leading to delays and lost visibility.
- **Manual coordination:** Managers spent significant time coordinating approvals, tracking expenses and spiffs, and communicating with dispersed field employees.
- **Audit gaps:** Financial transactions and approvals lacked a consistent audit trail for compliance and reconciliation.

### Goals

- **Reduced request turnaround:** Request workflows move from submission to approval/completion with clear status visibility.
- **Single source of truth:** Schedules, assignments, and resource data centralized and consistent across the organization.
- **Audit trail:** All approvals and financial transactions logged for compliance and reconciliation.
- **Field employee adoption:** Employees use the mobile app for day-to-day self-service instead of relying on managers or office staff.

---

## System Architecture

### Application Architecture

| Application | Path | Technology | Target Users |
|-------------|------|------------|--------------|
| **API** | `apps/api` | FastAPI, Python 3.12, PostgreSQL, Redis, Celery, AWS S3 | Backend service |
| **Web Portal** | `apps/web` | React, Vite | Administrators, Managers |
| **Mobile App** | `apps/mobile` | Expo, React Native | Field Employees |

All clients consume the same REST API and use JWT authentication. WebSocket is used for real-time in-app notifications.

![System Design](/case_study/air_duct_cleaning/system_design.png)

### Deployment Architecture

| Component | Technology | Hosting | Description |
|-----------|------------|--------|-------------|
| **API** | FastAPI, Uvicorn | AWS App Runner | REST API, WebSocket; HTTPS, auto-scaling |
| **Celery** | Python | AWS ECS Fargate | Background workers (email, SMS, exports) |
| **Web Portal** | React, Vite | AWS Amplify | Admin and manager UI; CDN, SSL |
| **Mobile App** | Expo, React Native | App Store, Google Play (EAS) | Field employee self-service |
| **Database** | PostgreSQL | AWS RDS | Primary data store |
| **Cache / broker** | Redis | ElastiCache | Celery broker, cache |
| **File storage** | — | AWS S3 | Uploads, exports, backups |
| **Secrets** | — | AWS Secrets Manager | DB credentials, JWT, API keys |

### Network Architecture

![Network Architecture](/case_study/air_duct_cleaning/network_architecture.png)

### Supporting Components

| Component | Purpose |
|-----------|---------|
| **Lambda (restore-db)** | Restores PostgreSQL from a plain SQL dump in S3 into RDS (e.g. staging, prod) |
| **Twilio** | SMS (OTP, notifications) |
| **AWS SES** | Transactional email |
| **Firebase Cloud Messaging** | Push notifications (Android) |
| **APNs** | Push notifications (iOS) |
| **Sentry** | Error tracking and performance |

---

## System Design

### API Design

- **Base path:** `/api/v1`
- **Authentication:** JWT Bearer (`Authorization: Bearer <token>`). Login: `POST /api/v1/auth/login`.
- **WebSocket:** `WS /api/v1/ws/notifications/{user_id}?token=<jwt>` for real-time notifications.

**API modules:**

| Prefix | Module |
|--------|--------|
| `/auth` | Authentication |
| `/users` | Users |
| `/locations` | Locations |
| `/tenants` | Tenants |
| `/audit-logs` | Audit logs |
| `/vehicles` | Vehicles |
| `/resources` | Resources |
| `/types` | Reference types (catalogs) |
| `/tools` | Tools |
| `/clothing` | Clothing |
| `/tool-requests` | Tool requests |
| `/clothing-requests` | Clothing requests |
| `/expenses` | Expenses |
| `/spiffs` | Spiffs |
| `/notifications` | Notifications |
| `/device-tokens` | Device tokens (push) |
| `/referrals` | Referrals (partner companies) |
| `/emergency-contacts` | Emergency contacts |
| `/repair-requests` | Repair requests |
| `/suggestions` | Suggestions |
| `/media` | Media upload/download |
| `/preferences` | User preferences |
| `/schedule` | Vehicle schedules |
| `/specializations` | Specializations |
| `/time-off-requests` | Time-off (PTO) requests |

**Pattern:** REST resources with controller and service layers; Celery for asynchronous work (email, SMS, export generation).

### Authentication and Authorization

- **Auth methods:** Email/password and phone OTP (employees).
- **Tokens:** JWT (access and refresh); validated on each request.
- **Authorization:** Role-based access control (Admin, Manager, Employee). Data scoped by tenant and location; users are assigned to locations.

### Data Flow (High Level)

- **Request/response:** Web and Mobile send HTTPS requests to the API; the API reads and writes PostgreSQL. Redis is used as the Celery message broker and for cache.
- **Real-time:** In-app notifications are delivered over WebSocket. Mobile push uses FCM (Android) and APNs (iOS); device tokens are registered via `/device-tokens`.
- **Files and exports:** Uploads go to S3 via the API. Export generation and delivery (e.g. email) are handled by Celery tasks.

### Key Backend Components

| Component | Description |
|-----------|-------------|
| **FastAPI app** | Main HTTP and WebSocket server; mounts all routers at `/api/v1` |
| **Celery app** | Same codebase as API; entrypoint `celery -A src.celery_app worker` (ECS uses `--pool=solo`) |
| **Alembic** | Database migrations in `apps/api/alembic/versions/` |
| **Entities** | SQLAlchemy models (users, locations, vehicles, schedule, expenses, spiffs, tools, clothing, requests, notifications, etc.) |

---

## Domain and Feature Summary

| Area | Description |
|------|-------------|
| **User and organization management** | Users, tenants, locations, roles (Admin, Manager, Employee) |
| **Scheduling** | Daily scheduling, vehicle assignments, service management |
| **Vehicle fleet** | Vehicles, maintenance, repairs, odometer tracking |
| **Request workflows** | Tool requests, clothing requests, PTO (time-off) requests |
| **Financial tracking** | Expenses, spiffs, approval flows |
| **Resources and suggestions** | Resource library, suggestions, referrals |
| **Notifications** | In-app (WebSocket), push (mobile), email (SES), SMS (Twilio) |

**Out of scope:** Payroll or accounting system integration; automated inventory management or procurement; native iOS/Android codebases (Expo managed workflow in scope).

---

## Development and Operations

### Monorepo and Local Development

- **Workspace:** pnpm monorepo with Turbo. Apps: `apps/api`, `apps/web`, `apps/mobile`. Shared: `packages/api-client`, `packages/shared-types`.
- **API (local):** Make targets from repo root: `make db-up` (Postgres, Redis), `make migrate`, `make create-admin`, `make dev` (API + Celery).

### CI

GitHub Actions:

| Workflow | Scope | Jobs |
|----------|--------|------|
| **ci-api** | API code | Lint (ruff, black), test (pytest), optional migration checks |
| **ci-web** | Web, packages | Test (Vitest), lint |
| **ci-mobile** | Mobile, packages | Test (Jest), lint, typecheck |
| **ci-e2e-web** | Web, API, packages | E2E (Playwright), web integration tests |

### CD

- **deploy-staging:** Triggered on push to `main`. Single pipeline: Terraform (staging) then deploy API (App Runner), Celery (ECS), web (Amplify), mobile (EAS).
- **deploy-production:** Triggered on tag `v*` (e.g. `v1.2.3`). Same pipeline for production.
- **Secrets:** Runtime secrets (Postgres URL, JWT, Twilio, Expo token, etc.) in AWS Secrets Manager; Terraform and workflows consume as needed.

---

## Summary

This system is a production-grade, multi-tenant field-service platform: one backend (FastAPI + Celery), one web app for admins/managers, and one mobile app for employees, with shared types and API client, full request and financial workflows, and a clear path from local dev to staged and production deploys on AWS via Terraform and GitHub Actions.
