---
title: Counterfoil
shortDescription: Multi-tenant ticketing and bookings platform with Django REST API, Next.js admin app, subscriptions, payments (SSLCommerz, bKash, Stripe), and AWS deployment.
tech:
  - Django
  - Django REST Framework
  - Next.js
  - PostgreSQL
  - Redis
  - Celery
  - JWT (Simple JWT)
  - AWS (S3, SES, Secrets Manager, EC2, ALB, ECR, CodeBuild, Lambda)
  - Terraform
  - Docker
  - SSLCommerz
  - bKash
  - Stripe (webhook)
  - k6
year: "2024"
thumbnail: /projects/counterfoil/thumbnail.png
client: Personal
live: https://counterfoil.app
---

## Executive Summary

Counterfoil is a multi-tenant SaaS platform for event ticketing, online bookings, sales, subscriptions, and marketplace operations. Organizations (tenants) use the Next.js web app to manage events, tickets, customers, finances, and settings. Marketplace operators and third-party clients integrate via REST APIs using JWT or API keys. The system provides a single place for ticketing, online and offline sales, payment processing with multiple gateways, subscription and usage-based billing, and operator dashboards.

The platform serves tenant admins and staff through the web admin app, and external consumers through versioned REST APIs. It delivers unified visibility across sales channels, automated payment and subscription flows, and a path from local development through staging to production on AWS with blue/green deployment.

---

## Problem Statement and Goals

### Problem Statement

- **Fragmented visibility:** Sales, bookings, and payments were spread across channels and tools, making it hard to see a single view of events and revenue.
- **Ad-hoc processes:** Booking and payment flows were manual or inconsistent, with no central reservation or async payment handling.
- **Manual coordination:** Multi-tenant and marketplace use cases required coordination without a clear API or tenant-scoped model.
- **Billing and usage:** There was no consistent model for subscription plans, usage limits, and pay-as-you-go charges.
- **Scaling and operations:** Moving from single-tenant to multi-tenant and supporting external API consumers required a clear architecture and deployment path.

### Goals

- **Single source of truth:** One system for events, tickets, bookings, sales, and payments.
- **Better UX:** Streamlined experience for tenant admins and marketplace operators.
- **Multiple payment gateways:** Support for SSLCommerz, bKash, and Stripe with async job handling and callbacks.
- **Stack and delivery:** Implement and operate a stack (Django, Next.js, Celery, AWS, Terraform) with a clear path from local dev to staging and production, including blue/green deployment and secrets management.

---

## System Architecture

### Application Architecture

| Application       | Path        | Technology                          | Target Users                    |
|-------------------|-------------|-------------------------------------|---------------------------------|
| Web Admin App     | Frontend    | Next.js 14, React, Tailwind, TypeScript | Tenant admins, staff            |
| REST API          | Backend     | Django REST Framework, Gunicorn    | Web app, marketplace clients, payment callbacks |
| Background workers| Celery      | Celery, Redis                       | Async payment jobs, subscriptions, settlements, notifications |

Clients talk to the system over REST on a versioned base path. Authentication uses JWT Bearer for tenant users and JWT or API key (key_id:secret) for marketplace clients. Tenant middleware scopes all requests to the current tenant; RBAC (Admin, Manager, Staff) is enforced on API views.

### System Design Diagram

![System Design](/projects/counterfoil/system_design.png)

### Deployment Architecture

| Component    | Technology     | Hosting              | Description |
|-------------|----------------|----------------------|-------------|
| API         | Django, Gunicorn | EC2 (private subnet) | REST API server |
| Workers     | Celery         | EC2 or same host     | Async tasks, subscriptions, settlements |
| Frontend    | Next.js        | EC2 (private subnet) | Web admin app |
| Database    | PostgreSQL     | External / RDS       | Primary data store |
| Cache / broker | Redis       | External / ElastiCache | Sessions, Celery broker |
| Media       | S3, CloudFront | AWS                  | File storage and CDN |
| Secrets     | AWS Secrets Manager | AWS              | Env and credentials |

### Network Architecture

![Network Architecture](/projects/counterfoil/network_architecture.png)

### Supporting Components

| Component     | Purpose |
|---------------|---------|
| SSLCommerz    | Online payment gateway (success/fail/cancel/validate callbacks) |
| bKash         | Payment gateway (callback, success, fail) |
| Stripe        | Webhook for payment events |
| AWS SES       | Transactional email |
| AWS S3        | Media and file storage |
| SMS provider  | SMS sending (API key–based) |
| AWS Secrets Manager | Storing and retrieving secrets at deploy and runtime |

---

## System Design

### API Design

- **Base path:** `api/{version}/` (e.g. `api/v3/`).
- **Authentication:** JWT Bearer token; marketplace endpoints also support `Authorization: Apikey <key_id>:<secret>`.
- **WebSocket:** Not used; all real-time needs are handled via polling or callbacks.

| Prefix       | Module |
|--------------|--------|
| analytics/   | Analytics (customers, timeslot, staff counter, sales counter, top tickets, total sales, visitors, variant sales, payment methods, sales channel, sale-to-checkin, UTM tracking) |
| bookings/    | Bookings (issued, reservations, cart, etc.) |
| calendar/    | Calendar |
| comms/       | Communications (email, SMS) |
| customers/   | Customers |
| discounts/   | Core discounts |
| expenses/    | Expenses |
| events/      | Events |
| finances/    | Finances |
| forms/       | Forms |
| media/       | Media |
| membership/  | Membership |
| payment/     | Payment (gateway job, SSLCommerz, bKash, Stripe webhook) |
| portals/     | Portals |
| products/    | Products |
| promotions/  | Promotions (discounts) |
| sales/       | Sales and transactions |
| sequences/   | Sequences |
| settings/    | Settings (organization, users, validation locations, sales counters, integrations, print, notifications, taxation, online tickets, online items, ticket settings, terminal, sales channel, check-in counters, notification preferences) |
| subscription/| Subscription (v2 usage and billing) |
| tickets/     | Tickets (validate, validations, construct, issued) |
| usage/       | Usage |
| checkin/     | Check-in |
| retail/      | Retail |
| marketplace/ | Marketplace (dashboard, bookings, tickets, users, sales, offers, tenants, integrations, API keys, registration, variants, payment gateways) |

**Pattern:** REST with controller and service layers. Async payment and subscription work is offloaded to Celery workers. The finance module is a detached service layer invoked from payment and subscription flows.

### Authentication and Authorization

- **Methods:** JWT (access and refresh tokens, blacklist on rotation), Session authentication for admin, and marketplace API keys (key_id:secret) with usage logging.
- **Roles:** Admin, Manager, Staff with RBAC; permissions are assigned and checked on views.
- **Data scoping:** Tenant middleware resolves tenant from request; all data is scoped by tenant. Marketplace API keys are scoped to a marketplace and optional tenant workspace.

### Data Flow (High Level)

- **Request/response:** Clients send REST requests to the versioned API; responses are JSON. Pagination and filtering are used on list endpoints.
- **Real-time and callbacks:** Payment gateways call back to dedicated success/fail/validate endpoints; Stripe uses a webhook endpoint. No WebSocket; async status is polled or delivered via jobs.
- **Files and exports:** Media uploads are stored in S3; exports (e.g. tickets) are generated and served or stored as needed.

### Key Backend Components

| Component        | Description |
|------------------|-------------|
| Main app         | Django project with DRF; URL routing, middleware, settings |
| Celery workers   | Task execution for payments, subscriptions, settlements, notifications |
| Celery beat      | Scheduled tasks (renewals, billing cycles, settlements) |
| Migrations       | Django migrations for all modules |
| Tenant middleware| Resolves tenant and attaches to request; path-based exclusions for public/callback routes |
| RBAC             | Permission classes and decorators for roles |
| Finance service  | Detached service for transactions, fees, settlements |
| Payment adapters | SSLCommerz, bKash, Stripe integration and callback handling |
| Subscription v2  | Plans, benefits, add-ons, billing cycles, PAYG, payment processing fees |

---

## Domain and Feature Summary

| Area              | Description |
|-------------------|-------------|
| Events and calendar | Event and calendar management for tenants |
| Tickets           | Ticket types, variants, pricing, issue, and validation |
| Bookings and reservations | Booking and reservation lifecycle, pricing, TTL |
| Sales and transactions | Cart, checkout, refunds, manual and online sales |
| Payments          | SSLCommerz, bKash, Stripe; async jobs and callbacks |
| Subscriptions and billing | Plans, benefits, add-ons, PAYG, billing cycles (subscription_v2) |
| Finances          | Transactions, payment processing fees, platform fees, settlements, disbursements |
| Marketplace       | Operators, catalog, sales, dashboard, API keys, tenant registration |
| Customers and membership | Customer data and membership benefits |
| Analytics and reporting | Sales, visitors, payment methods, channels, UTM, etc. |
| Comms             | Email and SMS sending and logs |
| Settings          | Organization, users, terminals, check-in counters, online tickets, integrations, taxation, notifications |
| Portals and public flows | Public-facing flows and portal access |
| Retail            | Retail-oriented sales and products |
| Usage and metering| Usage tracking and metering for billing |

**Out of scope:** Custom first-party mobile apps; the system is consumed via the web app and REST API, and mobile clients could use the API if needed.

---

## Development and Operations

### Monorepo and Local Development

The repository is a monorepo with a backend (Django) and frontend (Next.js). The backend uses a dependency and task runner (e.g. Poetry and Make) for installing dependencies, running the database, applying migrations, assigning RBAC permissions, running the dev server, and running Celery and Celery beat. The frontend uses a Node package manager and scripts for dev, build, and lint. Local backend development typically runs PostgreSQL and Redis via Docker Compose; the frontend talks to the backend API via a configured base URL. Tests and linting are run via the backend and frontend tooling; no exact env var names, CLI commands, or file paths are specified here to keep the case study portable.

### CI

| Workflow                 | Scope                                      | Jobs |
|--------------------------|--------------------------------------------|------|
| CI/CD for Staging        | Push to main; paths: backend/**, frontend/** | Single job on self-hosted staging runner: checkout, detect backend/frontend changes, fetch backend and frontend secrets from AWS Secrets Manager, conditionally build and run backend and frontend via Docker Compose, optional Docker cache prune |
| AWS Blue/Green Deployment| Push tags v*; paths: backend/**, frontend/** | Detect changes; build backend and frontend Docker images via AWS CodeBuild and push to ECR; run Lambda for health checks and blue/green traffic switch |

### CD

**Staging:** Pushes to main trigger the staging workflow. Secrets are pulled from AWS Secrets Manager into env files; backend and frontend are built and run with Docker Compose on the self-hosted runner. No step-by-step runbooks or exact commands.

**Production:** Tag-based (e.g. v*) triggers the AWS deployment workflow. CodeBuild builds images and pushes to ECR. EC2 instances (blue/green) pull the new images; secrets are retrieved from Secrets Manager at instance startup. A Lambda function is used for health checks and switching ALB traffic from blue to green. Exact runbooks and commands are not included.

---

## Summary

Counterfoil is built with Django, Next.js, PostgreSQL, Redis, and Celery on AWS, with infrastructure defined in Terraform. It provides multi-tenant ticketing and bookings, multiple payment gateways, subscription and usage-based billing, and a marketplace with operator dashboards and API keys. Local development uses Docker for database and Redis and standard runners for backend and frontend. Staging is updated on push to main via GitHub Actions and Docker Compose with secrets from AWS Secrets Manager. Production uses tag-triggered builds, ECR, EC2 blue/green instances behind an ALB, and Lambda-assisted deployment and health checks. The case study is self-contained; add the GitHub repo or live demo URL in the frontmatter or Summary when available.
