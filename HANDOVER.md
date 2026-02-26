# 📄 Handover Documentation - Hii Social CMS

## 🚀 Project Overview

**Hii Social CMS** is a comprehensive Content Management System designed for the Hii Social platform. It is built using a modern, type-safe stack featuring **React 18**, **TypeScript**, **Vite**, and **TanStack Router**.

- **Dashboard**: System overview with charts and statistics.
- **Content Management**: Workflow-based management for "Reels" (Draft → Pending → Approved → Scheduled → Published).
- **Playlist Management**: Organizing content into playlists with thumbnail support.
- **Report Management**: Handling user reports and content moderation.
- **User & Role Management**: RBAC (Role-Based Access Control) for Editors, Reviewers, and Admins.
- **Audit Logs**: System-wide activity tracking (In Progress).

---

## 🛠 Tech Stack & Architecture

- **Framework**: React 18 + Vite
- **Routing**: TanStack Router (Type-safe)
- **State Management**:
  - **Server State**: TanStack Query (React Query v5)
  - **Client State**: Zustand (with Persistence)
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS v4 + shadcn/ui (Dark Theme focused)
- **API Client**: Ky (with automatic token refresh mechanism)

---

## ✅ Recent Achievements & Contributions

1. **Domain Model Refactoring**:
   - Refactored the `Item` (Content/Reel) and `User` relations to use full domain objects instead of simple IDs.
   - Updated `ItemMapper` and services to handle the new `user` property, ensuring better type safety and data availability in the UI.
2. **Auth Service Refinement**:
   - Enhanced the `AuthService` with better error handling and integration with the system-wide API client.
   - Refined token management within the `useAuthStore`.
3. **Room & State Management (Legacy/External Context)**:
   - Note: Recent discussions regarding Chat/Room logic were addressed, though they primarily reside in related project modules or are slated for future integration.
4. **Project Documentation**:
   - Established a comprehensive `docs/` directory with detailed guides for API usage, data fetching, feature implementation, and code standards.

---

## 🚧 Current Status & Next Steps

### 1. Audit Feature (High Priority)

The feature is currently in the "Skeleton" phase.

- **Status**: Basic page layout exists at `/audit`.
- **Immediate Tasks**:
  - Implement `AuditLog` types and Zod schemas.
  - Create `audit-service.ts` and `useAuditLogs` hook (Infinite Scroll).
  - Build `AuditLogTable` and filter components.
  - See `docs/AUDIT_FEATURE_SUMMARY.md` for a detailed roadmap.

### 2. Testing Infrastructure

- **Status**: No automated tests currently exist.
- **Recommendation**: Set up **Vitest** for unit testing and **Playwright/Cypress** for E2E testing of critical workflows (Login, Content Approval).

### 3. Loading & Error UX

- **Status**: Skeleton screens and Error Boundaries are partially implemented.
- **Task**: Standardize Skeleton components across all list pages and implement global/feature-level Error Boundaries.

### 4. Internationalization (i18n)

- **Status**: Hardcoded strings (mostly Vietnamese).
- **Task**: Integrate `react-i18next` or similar if multi-language support is required.

---

## 🔑 Key Configurations

- **Environment**: Base API URL and Basic Auth credentials should be set in `.env`.
- **API Client**: Configured in `lib/api-client.ts`. Includes interceptors for adding Bearer tokens and handling 401s via Refresh Tokens.
- **Routing**: Defined in `app/routes/`. Uses TanStack Router's file-based routing conventions.

---

## 📚 Reference Documentation

For deep dives into specific modules, please refer to the following files in the `docs/` folder:

- `SOURCE_CODE_OVERVIEW.md`: Architectural deep dive.
- `API_CLIENT.md`: How to use the `api` helper.
- `DATA_FETCHING.md`: React Query patterns used in the project.
- `AUDIT_FEATURE_IMPLEMENTATION.md`: Step-by-step guide for the current focus task.

---

**Handover Date**: 2026-02-26  
**Status**: Active Development
