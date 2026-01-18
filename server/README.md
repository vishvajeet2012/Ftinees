# FitMetric – AI-Powered Fitness & Analytics Engine

> **Target Level:** 3+ Years Experience (Senior Developer Standards)  
> **Tech Stack:** Next.js 15, Node.js, Express, MongoDB Atlas, Google Gemini AI, Node-cache, n8n.

## 1. Project Overview

FitMetric is an advanced productivity and health platform that leverages **AI and Data Analytics** to provide users with "Personalized Coaching". It goes beyond simple data storage, analyzing logs to deliver actionable insights.

## 2. System Architecture

Designed on a **Modular Service-Repository Pattern** for high scalability.

### High-Level Layers

- **Client Layer:** Next.js 15 (App Router) – Utilizing Server Actions and Optimistic UI.
- **API Layer:** Node.js/Express – Logic separated into distinct 'Services'.
- **Data Layer:** MongoDB Atlas (Time-Series & Vector Search).
- **Intelligence Layer:** Gemini 1.5 Pro (RAG logic for personal coaching).
- **Automation Layer:** n8n (Local/Hugging Face) – Event-driven notifications.

## 3. Database Design (Deep MongoDB)

FitMetric employs advanced patterns:

- **Time-Series Collections:** For fast retrieval of daily metrics (weight, steps).
- **The Bucket Pattern:** Grouping workout sets into single documents for optimized indexing.
- **Vector Search:** Storing workout logs as numerical vectors for AI context.

### Key Logic (The 1RM Formula)

Used in backend aggregations for tracking strength:
$$1RM = Weight \times (1 + \frac{Reps}{30})$$

## 4. The AI Heart (Gemini + RAG)

FitMetric AI is "context-aware". Workflow:

1.  **Retrieval:** Fetch user's last 30 days of data from MongoDB.
2.  **Augmentation:** Combine data with a system prompt.
3.  **Generation:** Gemini AI provides personalized advice.

## 5. Automation & Notifications (n8n)

Event-Driven Architecture implemented via n8n:

- **Webhook Handshake:** Secure communication between Express server and n8n using `x-fitmetric-secret`.
- **Multi-Channel:** AI-generated motivational messages.
- **Weekly Reports:** Automated Sunday reports generated and emailed.

## 6. Performance & Caching (Node-cache)

- **Metadata Caching:** Exercise lists and user profiles stored in RAM for 24h.
- **TTL (Time-To-Live):** Expiry times enforced to ensure data freshness.

## 7. Folder Structure

```text
/server
  ├── /src
  │   ├── /config         # DB, Gemini, Cache Config
  │   ├── /controllers    # Request/Response Handling
  │   ├── /services       # Core Logic (Analytics, AI, Workout)
  │   ├── /models         # Mongoose Schemas (Time-Series)
  │   ├── /routes         # API Endpoints
  │   ├── /middlewares    # Auth, Zod Validation, Error Handling
  │   ├── /jobs           # Node-cron for local triggers
  │   ├── /integrations   # n8n & Gemini API logic
  │   └── /utils          # Helpers (Calculators, Formatters)
  ├── .env
  └── server.js
```
