---
title: Recreation and Venue Booking Platform
shortDescription: Mobile app and API for discovering and booking sports venues, with integrated payments and promotions.
tech:
  - React Native
  - Expo
  - TypeScript
  - FastAPI
  - REST
  - JWT
  - MongoDB
  - PostgreSQL
  - Payment gateway integration
  - EAS Build
  - GitHub Actions
year: "2025"
thumbnail: /case_study/recreational_venue_booking/thumbnail.png
client: Confidential
---

## Executive Summary

The system is a consumer-facing recreation and venue booking platform consisting of a native mobile app and a backend API. End users discover sports facilities, check availability, reserve timeslots, and complete checkout using integrated payment options (mobile wallet and card). The backend coordinates availability and reservations with an external venue management and booking engine, orchestrates payment creation and callback handling, and applies promotions and offer rules. Users can manage bookings, view sale history, and participate in tournaments and referrals.

The primary users are consumers (discover, book, pay, manage bookings and profile). The backend supports authentication, booking and sales orchestration, payment and offer logic, and integration with the external venue engine. A separate admin or CMS layer may be used to manage offers and promotions; the API exposes offer listing and application for the app and enforces access and whitelisting rules.

---

## Problem Statement and Goals

**Problem Statement**

- **Fragmented visibility:** Bookings, payments, and venue data lived across the app, the backend, and an external venue engine, making it hard to get a single view of a transaction or reservation.
- **Manual coordination:** Aligning the mobile app with the external venue and payment systems required ad-hoc coordination and error handling for success, failure, and cancellation flows.
- **Payment and callback reliability:** Payment flows depended on redirects and webhooks; failures (e.g. wallet locked or insufficient balance) had to be detected and reflected correctly in the app and in sales status.
- **Audit and reconciliation gaps:** Tracing a sale from creation through payment callback to final status needed a clear trail and consistent identifiers (e.g. payment and sale IDs) across systems.
- **Scaling promotions:** Managing and applying offer codes and whitelisting in a consistent way across app and API required a defined offer model and access rules.

**Goals**

- **Single place to discover and book:** Users can search, view availability, reserve, and checkout from one mobile experience backed by a unified API and venue engine.
- **Reliable payment flows:** Payment creation, redirect/SDK flows, webhooks, and optional status polling work together so success and failure states are accurate and visible.
- **Single source of truth:** Sales and booking state are authoritative in the backend and venue engine, with the app reflecting that state after verification.
- **Clear audit trail:** Payment and sale records can be traced via stable IDs and callback handling for support and reconciliation.
- **Adoption of mobile-first booking and payments:** The platform supports mobile wallet and card payments and is built for mobile-first use.

---

## System Architecture

### Application Architecture

| Application   | Path        | Technology        | Target Users        |
|--------------|-------------|-------------------|---------------------|
| Mobile app   | Consumer    | Expo, React Native | End users (Android, iOS) |
| Backend API  | `/api/v1/`  | FastAPI           | Mobile app, external systems |

Clients talk to the backend over REST. The mobile app sends a JWT Bearer token on each request and uses refresh tokens when the access token expires. Payment flows use the backend to create payments; the app then opens a payment SDK or WebView. Success, failure, and cancellation callbacks are sent as POST webhooks to the venue service base URL configured by the backend (e.g. for environments where the app and backend use a private network and callbacks must use a public URL).

### System Architecture Diagram

![System Design](/case_study/recreational_venue_booking/system_design.png)

### Deployment Architecture

| Component     | Technology   | Hosting     | Description                                      |
|--------------|-------------|------------|--------------------------------------------------|
| API server   | FastAPI     | Cloud / VPS | Serves REST API, auth, bookings, sales, payments, offers |
| Mobile app   | Expo        | App stores  | Distributed via Google Play and App Store        |
| Database     | SQL / NoSQL | Managed or self-hosted | Persistent storage for users, offers, and app state |
| Venue engine | Third-party | External   | Source of availability, reservations, and sales  |
| Secrets      | Env / vault | CI/CD or runtime | API keys, payment credentials, service tokens   |

### Network Architecture

![Network Architecture](/case_study/recreational_venue_booking/network_architecture.png)

### Supporting Components

| Component        | Purpose                                                |
|------------------|--------------------------------------------------------|
| Payment gateway  | Mobile wallet and card payments; create/execute and callbacks |
| SMS / Email      | Notifications (e.g. booking confirmation, OTP)        |
| EAS              | Build and submit of the Expo app to app stores         |
| Secrets store    | API URL, payment credentials, and external base URL in CI/CD |

---

## System Design

### API Design

- **Base path:** `/api/v1/`
- **Authentication:** JWT Bearer token in the `Authorization` header; refresh via dedicated refresh endpoint.
- **WebSocket:** None; all interaction is request/response over REST.

| Prefix       | Module    |
|-------------|-----------|
| auth        | Login, register, refresh, logout, social (e.g. Google, Apple), verification |
| users/me    | Profile, phone/email verification, upload, change-password, delete account |
| bookings    | Availability, reserve, release, reservations, my-bookings |
| sales       | Create sale, get by UID, my-bookings, payment job status |
| bkash       | Payment create, execute (mobile wallet)                 |
| offers      | List, get by UID, apply                                 |
| config      | Public base URL for payment callbacks                   |
| favorites   | Add, remove, list                                      |
| friends     | Friend-related endpoints                               |
| tournaments | Registrations, success/fail/cancel callbacks           |
| referrals   | Apply referral code, get referral code                  |

### Pattern

REST with controller and service layers; payment and booking flows use async webhooks and optional polling for status.

### Authentication and Authorization

- **Methods:** Username/password (login, register), JWT access and refresh tokens, optional social sign-in (Google, Apple).
- **Tokens:** Access token for API calls; refresh token for obtaining a new access token without re-login.
- **Scoping:** Profile, bookings, sales, offers, and related resources are scoped to the authenticated user; service-to-service operations use a shared service key where required (e.g. admin or CMS).

### Data Flow (High Level)

- **Request/response:** CRUD and business operations (availability, reserve, create sale, apply offer) are synchronous REST calls from the app to the backend; the backend may call the venue engine or payment provider and return a consolidated response.
- **Payment flow:** Backend creates a payment; app opens SDK/WebView; gateway sends success/fail/cancel webhooks to the configured callback URL; app may poll the backend for sale or payment status before showing final outcome.
- **Files and exports:** Profile and upload endpoints support file upload (e.g. profile image); no bulk export flows are specified in scope.

### Key Backend Components

| Component              | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| Main application       | FastAPI app; routing, middleware, error handling                           |
| Auth                   | Login, register, refresh, social, verification                            |
| Booking / sales orchestration | Availability, reserve, release, create sale; integration with venue engine |
| Payment adapter        | Create and execute payments; handle webhooks and status                     |
| Offer service          | List and get offers; apply offer to cart; whitelisting and access rules     |
| Integrations           | Venue engine client (availability, reservations, sales); payment provider  |

---

## Domain and Feature Summary

| Area                     | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| User / account management | Registration, profile, phone and email verification, password change, account deletion |
| Auth and verification    | Login, refresh, social sign-in, OTP and email verification                  |
| Venue discovery and availability | Search and browse venues; get availability and timeslots; optional location ranking |
| Reservations and cart    | Reserve timeslots, hold pricing, cart with multiple items, release reservations |
| Checkout and sales       | Create sale from cart, partial or full payment, link to payment and venue engine |
| Payments                 | Mobile wallet (e.g. bKash) and card (e.g. SSLCommerz); create, redirect, webhooks |
| Offers and vouchers      | List and apply offer codes; discount and validation rules; whitelisting     |
| Bookings and my-bookings | View upcoming and past bookings; booking details and sale receipt           |
| Tournaments and registrations | Tournament registration flow and payment success/fail/cancel callbacks  |
| Favorites and referrals  | Save favorite venues; referral codes and apply-referral flow                |
| Profile and settings     | Edit profile, upload photo, notifications, help, privacy, terms            |
| Config and public URLs   | Backend exposes public base URL for payment callbacks (e.g. when behind private IP) |

**Out of scope:** Payroll, native tablet-specific app, and in-venue hardware (e.g. kiosks) are not part of this system.

---

## Development and Operations

### Monorepo and Local Development

The system is split into a mobile app codebase and a backend API codebase. The mobile app uses Expo; developers run the app on a device or simulator with hot reload. The backend runs locally for development; schema and migrations are managed with the stack's chosen ORM or migration tool. Tests are run via the project's test runner (e.g. Jest for the app, pytest or equivalent for the API). Environment-specific configuration is loaded from env files or a config layer; no production secrets are committed. The app talks to the local or staged API and, when needed, to a public URL for payment callbacks (e.g. via a tunnel service in development).

### CI

| Workflow           | Scope      | Jobs                          |
|--------------------|------------|-------------------------------|
| iOS build and submit | Mobile app | Checkout, setup Node and Expo, install deps, load env, EAS build (iOS production), wait for build, optional App Store submit |

### CD

Staging and production deploys are triggered by branch or tag (e.g. push to main or version tags). The mobile app is built and submitted via EAS; submission to the App Store can be conditional on tag or a manual workflow input. Secrets (API URL, payment credentials, external base URL) live in the CI/CD secrets store and are injected at build or run time.

---

## Summary

The recreation and venue booking platform is a production-grade system built around a React Native (Expo) mobile app and a FastAPI backend. It provides venue discovery, availability, reservations, cart and checkout, integrated mobile-wallet and card payments, offers and vouchers, and tournament registrations, with a single source of truth for sales and bookings via an external venue engine. Development runs locally with Expo for the app and a local API; builds and App Store delivery are automated via EAS and GitHub Actions, with secrets managed in the CI/CD environment.
