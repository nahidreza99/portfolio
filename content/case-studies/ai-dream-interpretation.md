---
title: AI Dream Interpretation
shortDescription: Backend for a mobile dream journal app—AI interpretation, TTS/video, symbols, and paywalled analysis and chat. Supabase (Auth, Edge Functions, Realtime, Storage), Prisma; Express API for local dev only.
tech:
  - Node.js
  - Express
  - PostgreSQL
  - Prisma
  - Supabase Auth
  - Supabase Realtime
  - Supabase Storage
  - Supabase Edge Functions
  - Cloudflare AI Gateway
  - Google Gemini
  - Inworld
  - RunwayML
  - AssemblyAI
  - Adapty
  - Jest
year: "2026"
thumbnail: /case_study/ai_dream_interpretation/thumbnail.png
client: Confidential
---

## Executive Summary

The system is a backend for a mobile dream journal and interpretation product. In production, everything runs on Supabase: authentication (anonymous or optional email), dream creation and interpretation, media generation, analysis, and chat are handled by Supabase Auth and Supabase Edge Functions; clients use Realtime for live status updates and Supabase Storage for media. The backend delivers self-service dream creation (text or speech), AI-generated interpretation (title, summary, category), optional TTS audio and AI-generated video, symbol detection and linking, paywalled deep analysis, and AI chat. Usage quotas and in-app purchase entitlements are enforced before any billable work. A separate Express REST API exists only for local development and is not used in production.

---

## Problem Statement and Goals

### Problem Statement

- **Immediate interpretation without blocking:** Users expect a quick response when submitting a dream; long-running media generation (audio, video) must not block the initial creation flow.
- **Paywall before creating paid resources:** Video generation and premium analysis consume external APIs; the system must enforce entitlements before creating or starting these operations to avoid orphaned records and unbilled usage.
- **Real-time status for long-running jobs:** Audio and video generation take seconds to minutes; clients need live status updates (e.g. pending → audio ready → video ready → complete) without polling at high frequency.
- **Quota and entitlement enforcement:** Daily and lifetime limits for video, analysis, and chat must be checked consistently and reflected in a single source of truth (usage_quotas and IAP provider).
- **Secure, scoped access:** All dream and media data must be scoped by user; direct database or storage access from clients must respect row-level and bucket policies.

### Goals

- **Supabase-native surface:** Expose all production behavior through Supabase Auth and Edge Functions so the mobile app uses one platform for sign-in, dream creation, analysis, chat, and real-time updates.
- **Paywall enforced before billable work:** Check Adapty entitlements and usage quotas before creating a dream that triggers video or before running analysis/chat beyond free tiers.
- **Real-time status:** Use Supabase Realtime so clients subscribe to dream row updates and receive status and media URL changes as soon as they are written.
- **Clear usage audit:** Track video, analysis, and chat usage per user per day (and free-tier lifetime where applicable) for limits and support.
- **Adoption via anonymous auth:** Support anonymous sign-in and optional profile/onboarding so users can use the app without email until they choose to upgrade.

---

## System Architecture

### Application Architecture

| Application | Path / Entry | Technology | Target Users |
|-------------|--------------|------------|--------------|
| Supabase Auth | Supabase Auth API | Supabase | Mobile app (end users) |
| Edge Functions | Supabase Functions API (invoke by name) | Deno, Supabase Edge Functions | Mobile app (end users) |
| Realtime | Supabase Realtime (Postgres changes) | Supabase | Mobile app (end users) |
| Storage | Supabase Storage API | Supabase | Mobile app (end users) |
| Database | Supabase client (e.g. RPC, table access with RLS) | PostgreSQL via Supabase | Mobile app (end users) |
| REST API | `/api/*`, `/health` (local only) | Node.js, Express | Development only; not in production |

In production, the mobile client uses only Supabase. Clients sign in with Supabase Auth (anonymous or email) and receive a JWT. That token is sent when invoking Edge Functions (e.g. interpret-dream, analyze-dream, chat) and when using Realtime, Storage, or database access; RLS and Edge Function logic scope all data by user ID. The Express REST API is for local development (e.g. testing flows without deploying Edge Functions) and is not deployed to production.

### System Architecture Diagram

![System Design](/case_study/ai_dream_interpretation/system_design.png)

### Deployment Architecture

| Component | Technology | Hosting | Description |
|-----------|------------|---------|-------------|
| Auth | Supabase Auth | Supabase | Anonymous and optional email sign-in; JWT issuance and session persistence. |
| Edge Functions | Deno | Supabase | Serverless handlers for interpret-dream, interpret-journal, analyze-dream, chat, get-assemblyai-token, get-stats, get-symbols, poll-video-status; all business logic and async media generation run here. |
| Database | PostgreSQL | Supabase | Prisma schema and migrations (applied via pooler); RLS for client-scoped access. |
| Cache | — | — | No dedicated cache. |
| Storage | Supabase Storage | Supabase | Buckets for dream-audio, dream-video, profile-photos, dream-thumbnail; private with signed URLs. |
| Realtime | Supabase Realtime | Supabase | Postgres change broadcast for dream status and media URL updates. |
| Secrets | Environment variables | Supabase Edge config | Supabase keys and third-party API keys (LLM, TTS, video, STT, symbols, IAP) for Edge Functions. |
| REST API | Node.js, Express | Local only | Development only; not deployed. Used for local testing (e.g. auth, dreams, chat, media, symbols). |

### Network Architecture

![Network Architecture](/case_study/ai_dream_interpretation/network_architecture.png)

### Supporting Components

| Component | Purpose |
|-----------|---------|
| Adapty | In-app purchase and entitlements; paywall checks before video/analysis/chat beyond free tier. |
| Cloudflare AI Gateway / Gemini | LLM for dream interpretation, analysis, chat, and prompt generation for video/thumbnail. |
| Inworld | Text-to-speech for dream summary audio. |
| RunwayML | Text-to-video for dream visualization. |
| AssemblyAI | Speech-to-text token issuance for real-time transcription. |
| External symbols API | Symbol detection from dream text and symbol catalog; results linked to dreams and user-unlocked symbols. |

---

## System Design

### API Design

**Production (Supabase only):**

- **Auth:** Supabase Auth. Clients call `signInAnonymously()` (or email) and receive a session; no custom auth endpoints in production.
- **Business logic:** Clients invoke Edge Functions by name with the Supabase client; the JWT is sent in the request and validated by Supabase and inside each function.
- **WebSocket:** None; real-time updates use Supabase Realtime (client subscribes to Postgres changes on `dreams`).

| Edge Function | Purpose |
|---------------|---------|
| interpret-dream | Create dream (normal or journal); interpretation, symbol detection, optional audio/video. |
| analyze-dream | Generate deep analysis for an existing dream (paywalled). |
| chat | AI chat (streaming and non-streaming); paywall enforced. |
| get-assemblyai-token | Issue STT token for real-time transcription. |
| get-stats | User stats (dream counts, categories, unlocked symbols). |
| get-symbols | Symbol catalog with unlock status (e.g. via RPC). |
| poll-video-status | Video job status (optional fallback to Realtime). |

**Development only (REST API, not in production):** Local Express server with base path `/api` and JWT Bearer auth for parity testing. Prefixes: `/api/auth`, `/api/dreams`, `/api/chat`, `/api/media`, `/api/symbols`; health at `/health`.

### Pattern

Production: serverless Edge Functions handle each request; async media generation (audio, video) runs inside or from Edge Functions; dream rows are updated in the database and Supabase Realtime broadcasts changes to subscribed clients. No REST API and no separate worker process in production.

### Authentication and Authorization

- **Methods:** Supabase Auth only (anonymous sign-in; optional email upgrade). Token obtained via Supabase client (e.g. `signInAnonymously()`), not via a custom REST endpoint.
- **Tokens:** Supabase-issued JWT; used when invoking Edge Functions and when accessing Realtime, Storage, or database (RLS uses the same JWT).
- **Roles:** No application-level RBAC; access is scoped by `userId` from the JWT. RLS on Supabase tables restricts direct client access to the user's own rows; Edge Functions validate the JWT and scope all operations by user ID.

### Data Flow (High Level)

- **Request/response:** CRUD and actions (interpret, analyze, chat, media) are request/response; the client receives the dream object or chat result in the response body.
- **Real-time:** Dream status and media URL changes are written to the database; clients subscribed via Supabase Realtime receive updates without polling.
- **Files and exports:** Audio and video are stored in Supabase Storage; clients receive signed URLs. Profile and dream thumbnails use the same pattern.

### Key Backend Components

| Component | Description |
|-----------|-------------|
| Edge Functions | interpret-dream, interpret-journal, analyze-dream, chat, get-assemblyai-token, get-stats, get-symbols, poll-video-status; shared logic in _shared (paywall, interpretation, analysis, chat). |
| Supabase Auth | Anonymous and optional email; session and JWT; no custom auth server. |
| Prisma migrations | Schema and migrations for dreams, categories, symbols, dream_symbols, user_unlocked_symbols, usage_quotas; applied to Supabase Postgres. |
| Entities | Dream, DreamCategory, Symbol, DreamSymbol, UserUnlockedSymbol, UsageQuota. |
| REST API (dev only) | Express app and modules (auth, dreams, chat, media, symbols, health) for local development; not deployed. |

---

## Domain and Feature Summary

| Area | Description |
|------|-------------|
| User and auth | Anonymous sign-in; optional profile (display name, age range, gender, zodiac, profile photo); optional email upgrade; session persistence. |
| Dreams | Create from text or STT; normal (interpretation + optional audio/video) vs journal (title/category only); status lifecycle (pending → generating_audio → audio_ready → generating_video → video_ready → complete / failed); CRUD and soft delete. |
| Symbols | Global symbol catalog; symbol detection during dream creation; linking dreams to symbols; user-unlocked symbols; paginated symbol list with unlock status. |
| Media | Dream summary TTS (Inworld), dream video (RunwayML), dream thumbnail; profile photo; storage buckets and signed URLs. |
| Analysis | Deep analysis (paywalled) for existing dreams; stored as JSON on the dream; quota enforced per user. |
| Chat | AI chat about dreams; streaming and non-streaming; daily message limits and paywall. |
| Usage and paywall | Usage_quotas table (video, analysis, chat counts per user per day); Adapty for entitlements; limits enforced before creating video or running analysis/chat beyond free tier. |

**Out of scope:** Payroll, implementation of the native mobile app, and CI/CD pipelines are not part of this backend repository.

---

## Development and Operations

### Monorepo and Local Development

- **Layout:** Single repository. Production surface is Supabase Edge Functions (one entry per capability; shared logic for paywall, interpretation, analysis, chat). A separate Express API exists for local development only and is not deployed.
- **Local dev:** Developers run the Express API locally to test flows without deploying Edge Functions. Database schema and migrations are managed with Prisma against the Supabase Postgres instance; RLS is configured in Supabase. Tests use Jest (ESM).

### CD

Production deployment is Supabase-only: Edge Functions are deployed via Supabase; Auth, Realtime, Storage, and database are hosted by Supabase. Secrets (third-party API keys, IAP) are stored in the Supabase project (Edge Function secrets). The Express REST API is not deployed.

---

## Summary

The backend is a production-grade system for a mobile dream journal and interpretation product. Production runs entirely on Supabase: Auth for sign-in, Edge Functions for dream creation, analysis, and chat, Realtime for live status, Storage for media, and PostgreSQL with RLS for data. External services (LLM, TTS, video, STT, symbols) and Adapty for paywall are used from within Edge Functions. The Express REST API in the repo is for local development only and is not deployed. Local development uses the Express API and Prisma against Supabase for a production-like stack; deployment is done by publishing Edge Functions and configuring secrets in Supabase.
