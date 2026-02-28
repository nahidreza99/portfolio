---
title: AI Story Generator for Children
shortDescription: Backend API and async story pipeline for an AI-generated personalized story mobile app (Node, Express, Firebase, OpenAI, Runway).
tech:
  - Node.js
  - Express
  - Firebase Auth
  - Firestore
  - Realtime Database
  - Firebase Storage
  - Cloud Functions
  - FCM
  - OpenAI (Chat, Images, Whisper)
  - Runway ML
  - RevenueCat
  - Flutter
  - Jest
  - ES modules
year: "2025"
thumbnail: /case_study/children_ai_story_generation/thumbnail.jpg
client: Confidential
---

## Executive Summary

The system is a backend API and asynchronous story-generation pipeline that powers a consumer mobile app for personalized, AI-generated stories. End users—primarily families and children—use the app to discover and watch premade stories, create custom stories by uploading a photo and providing inputs (e.g. name, age, genre), and manage entitlements via tokens and subscriptions. The backend delivers a REST API for account and content operations, a queue-based processing pipeline for story generation, real-time queue status for the client, and push notifications when a story is ready or has failed.

---

## Problem Statement and Goals

**Problem Statement**

- **Manual, ad-hoc story creation:** No unified way to turn user inputs and media into a coherent narrative and video experience.
- **No visibility into generation status:** Users had no way to see queue position or estimated completion time.
- **Fragmented media and narrative pipeline:** Text, images, audio, and video were produced by separate tools with no single orchestration layer.
- **Audit and entitlement gaps:** Subscription and one-time token usage needed to be verified and recorded for fairness and support.
- **Scale and cost control for AI/ML:** Long-running, resource-heavy generation had to be capped and processed asynchronously without blocking the API.

**Goals**

- **Single API for the mobile app:** One backend surface for auth, catalog, user-created stories, and purchases.
- **Queue-based processing:** Offload story generation to scheduled workers with a bounded concurrency model.
- **Real-time status:** Expose queue position and system load so the client can show progress without polling the API.
- **Audit trail:** Persist purchase and subscription events and support server-side verification (e.g. webhooks, magic token).
- **Adoption and reliability:** Secure auth, validation, rate limiting, and push notifications so users stay informed and the system stays within operational limits.

---

## System Architecture

**Application Architecture**

| Application   | Path      | Technology | Target Users        |
|---------------|-----------|------------|---------------------|
| Backend API   | `/api/*`  | Node.js, Express | Mobile app (server-side) |
| Mobile app    | —         | Flutter    | End users (consumers) |

Clients talk to the system over REST. The mobile app sends requests with a Firebase ID token in the `Authorization: Bearer` header. There are no WebSockets on the API; the app uses Firebase Realtime Database listeners for live queue status and system load.

**Application and system architecture (diagram)**

![System Design](/case_study/children_ai_story_generation/system_design.png)

**Deployment Architecture**

| Component              | Technology        | Hosting        | Description                                      |
|------------------------|-------------------|----------------|--------------------------------------------------|
| HTTP API               | Express (Node 22) | Cloud Functions | Single onRequest function; handles all `/api/**` |
| Queue status sync      | Scheduled function| Cloud Functions | Syncs Firestore queue state to Realtime DB       |
| Queue cleanup          | Scheduled function| Cloud Functions | Removes completed/failed queue items             |
| Story generation       | Scheduled function| Cloud Functions | Picks pending items, runs AI pipeline, writes results |
| Story created trigger  | Firestore trigger | Cloud Functions | Sends FCM when a user story document is created  |
| Story failed trigger   | Firestore trigger | Cloud Functions | Sends FCM when queue item is marked failed       |
| Database               | Firestore         | Firebase       | Users, stories, queue, purchases                  |
| Realtime state         | Realtime Database | Firebase       | User and system queue counts                     |
| File storage           | Cloud Storage     | Firebase       | Images, video, exports                           |
| Secrets and config     | Environment       | Firebase       | API keys and webhook secrets                     |

**Network architecture (diagram)**

![Network Architecture](/case_study/children_ai_story_generation/network_architecture.png)

**Supporting Components**

| Component     | Purpose                                                                 |
|---------------|-------------------------------------------------------------------------|
| Firebase Auth | Identity and ID token verification for API requests                    |
| FCM           | Push notifications (story ready, story failed)                         |
| RevenueCat    | Subscription and entitlement webhooks; optional server-side verification|
| OpenAI        | Chat (narrative), image generation/editing, Whisper (transcription)    |
| Runway ML     | Video generation from image and narrative inputs                      |

---

## System Design

**API Design**

- **Base path:** `/api/v1`, `/api/v2`.
- **Auth:** Firebase ID token in `Authorization: Bearer <token>`; routes use required or optional auth middleware.
- **WebSocket:** None; real-time data is provided via Realtime Database.

| Prefix              | Module           |
|---------------------|------------------|
| `/api/v1/users`    | User registration, profile, FCM token, language |
| `/api/v1/stories`   | Catalog, discovery, favorites, continue watching, chapters, like |
| `/api/v1/purchase` | App Store / Play Store server-to-server; subscription and purchase handling |
| `/api/v1/user-stories` | User-created story submission (v1) |
| `/api/v2/user-stories` | User-created story submission (v2, queue-based) |
| `/api/v2/purchase`  | Magic token redemption, RevenueCat webhook |

**Pattern**

REST with controller and service layers. Long-running story generation is handled asynchronously by scheduled functions that read from a Firestore queue and write results to Firestore and Storage; there is no in-process job queue.

**Authentication and Authorization**

- **Method:** Firebase Auth; clients obtain an ID token and send it as a Bearer token.
- **Verification:** Each protected request validates the token with Firebase Auth; optional auth middleware allows unauthenticated access with user context when a token is present.
- **Roles:** A simple role (e.g. user) can be read from the token; data is scoped by user ID (`uid`).

**Data Flow (High Level)**

- **Request/response:** Mobile app calls REST endpoints for auth, stories, user-stories, and purchases; responses are JSON.
- **Real-time:** Queue position and system load are written to Realtime Database by a scheduled sync job; the mobile app subscribes to these paths for live updates.
- **Files and exports:** Images and video are uploaded to or generated into Cloud Storage; the API and cron use Storage paths in Firestore documents; push payloads include URLs for the client.

**Key Backend Components**

| Component        | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| Main app         | Express server: routes, auth and security middleware, error handling, health check |
| User service     | Registration, profile, account deletion, FCM token and language persistence |
| Story service    | Catalog, discovery, favorites, continue watching, chapters, likes           |
| Create-story service (v1/v2) | Validates input, enqueues to Firestore, (v1 may do inline or legacy flow)  |
| Purchase service (v1/v2)    | Verifies purchases (Apple/Google S2S, RevenueCat), records transactions, magic token |
| Notification service | Builds and sends FCM payloads for story success and story failure          |
| Queue sync cron  | Reads Firestore queue, writes user and system counts to Realtime DB        |
| Queue cleanup cron | Deletes completed or failed queue documents after processing              |
| Story generation cron | Fetches pending queue items, runs OpenAI + Runway pipeline, saves story and media, updates queue |
| Firestore triggers | onStoryCreated (user story doc), onStoryFailed (queue doc); invoke notification service |
| Firebase config  | Admin SDK initialization for Auth, Firestore, Realtime DB, Storage, Messaging |

---

## Domain and Feature Summary

| Area                    | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| User and account management | Registration, profile, profile picture, account deletion, FCM token, language preference |
| Stories (catalog)       | List stories, filter by language; get by ID with chapters and metadata     |
| Discovery and engagement| Discovery feed, favorites, continue watching, like/unlike, chapter and scene progress |
| User-created stories    | Submit request (image + inputs); queue in Firestore; cron generates narrative and video; result stored under user |
| Subscriptions and tokens| RevenueCat webhooks; magic token purchase and redemption; Apple/Google S2S in v1 |
| Notifications           | FCM when a user story is created (success) or when queue item fails (error code and message) |
| Media                   | Firebase Storage for uploads and generated assets; OpenAI for images and Whisper; Runway for video |

**Out of scope:** Payroll, native web dashboard, and third-party white-label or reseller flows were not part of this system.

---

## Development and Operations

**Monorepo and Local Development**

The repository has two main application roots: a Node.js backend and a Flutter mobile app. The backend runs as a standard Express server in local development. Data and schema live in Firestore and Realtime Database, with no separate ORM or migration framework in the codebase. The backend uses a test runner (e.g. Jest) for unit tests and a linter for style. Environment configuration is loaded at startup; no repository-specific env var names or CLI commands are documented here so the case study remains portable.

**CD**

Staging and production are deployed to Firebase. The backend is deployed as Cloud Functions (one HTTP function plus scheduled and Firestore-triggered functions). Hosting is configured so that requests to the API path are rewritten to the HTTP function. Secrets and environment-specific values are supplied via Firebase environment configuration or project config. There are no step-by-step runbooks or exact deploy commands in this document.

---

## Summary

The backend is a production-grade Node.js and Express API deployed on Firebase Cloud Functions, with Firestore, Realtime Database, and Cloud Storage as the data and media layer. It provides a single REST surface for the mobile app, queue-based AI story generation (OpenAI and Runway ML), real-time queue status via Realtime Database, and push notifications via FCM. Local development runs the same Express app against Firebase-backed services; the same codebase is deployed as an HTTP function and as scheduled and event-driven functions for the pipeline and notifications.
