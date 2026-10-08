<div align="center">

# 🧠 IntentSQL AI

### Text-to-SQL with an intelligent clarification engine

**Clarify intent first. Generate SQL second.**

Ask questions about your data in plain English. When a question is ambiguous, IntentSQL AI asks *you* what you mean instead of guessing.

![IntentSQL AI landing page](./docs/images/intentsql-landing.png)

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-UI-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![SQLAlchemy](https://img.shields.io/badge/ORM-SQLAlchemy-D71F00?logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Groq](https://img.shields.io/badge/LLM-Groq-F55036)](https://groq.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-informational)](./LICENSE)

</div>

---

## 📑 Table of Contents

- [The Problem](#-the-problem)
- [Demo: The Playground](#-demo-the-playground)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [System Architecture](#-system-architecture)
- [Query Safety](#-query-safety)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Example Data & Questions](#-example-data--questions)
- [Key Technical Challenges](#-key-technical-challenges)
- [IntentSQL AI vs. Conventional Text-to-SQL](#-intentsql-ai-vs-conventional-text-to-sql)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 The Problem

Generating SQL from English is the easy part. The hard part is that **natural language is ambiguous**.

> *"Show me last month's best customers."*

What does **"best"** mean? Highest revenue? Most orders? Most repeat visits? Highest average order value? A typical Text-to-SQL system silently picks one interpretation and presents the result as if it were the answer.

**IntentSQL AI doesn't guess.** It detects the ambiguity, asks a focused clarifying question, and only then writes SQL.

```text
You:           Show me last month's best customers.

IntentSQL AI:  How would you like to define "best customers"?

               ○ Highest number of orders
               ○ Highest total revenue
               ○ Most repeat visits
               ○ Something else
```

> 💡 **Core idea:** move ambiguity resolution from *model guessing* to *user confirmation*.

---

## 🎮 Demo: The Playground

The Playground walks a question through the full pipeline and shows each phase visibly.

![IntentSQL AI Playground](./docs/images/intentsql-playground.png)

| Phase | What happens |
| --- | --- |
| **1. Ambiguity check** | The question is analyzed for clarity. *"Best customers"* is flagged because "best" has no single definition. |
| **2. Clarification** | The Clarification Engine presents targeted options (revenue, order count, repeat visits…). |
| **3. SQL generation** | The user's choice is merged into a refined intent and combined with the database schema to generate SQL. |
| **4. Final answer** | The validated SQL runs against PostgreSQL and the results are shown in the UI. |

A vague question becomes a concrete, data-backed answer, and the user never needs to know SQL.

---

## ✨ Features

| | |
| --- | --- |
| 🗣️ **Natural-language queries** | Ask in plain English instead of SQL. |
| ❓ **Ambiguity detection** | Flags requests with more than one reasonable interpretation. |
| 🔎 **Clarification engine** | Generates targeted, multiple-choice follow-up questions. |
| 🎯 **Intent refinement** | Merges the original question and the user's answer into a precise intent. |
| 🗄️ **Schema-aware SQL generation** | Grounds the LLM in your actual tables and relationships. |
| 🛡️ **SQL validation** | Treats generated SQL as untrusted and checks it before execution. |
| ⚡ **Fast inference** | Powered by Groq-hosted LLMs. |
| 🖥️ **Interactive playground** | A conversational UI covering question → clarification → SQL → result. |
| 🐘 **PostgreSQL support** | Built around relational business data (customers, orders, payments). |

---

## 🔄 How It Works

```mermaid
flowchart TD
    A([User question]) --> B[Intent analysis<br/>& ambiguity check]
    B --> C{Intent clear?}
    C -- Clear --> F
    C -- Ambiguous --> D[Clarification engine]
    D --> E[User clarifies]
    E --> R[Intent refinement]
    R --> F[SQL generation<br/>Groq LLM + schema]
    F --> G{SQL validation}
    G -- Invalid / unsafe --> X([Reject])
    G -- Valid --> H[(PostgreSQL)]
    H --> I([Results])

    style D fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
```

### Step by step

1. **Question** — the user types a question; the Next.js frontend sends it to the FastAPI backend.
2. **Intent analysis** — the LLM considers what is being asked, which entities and metrics are involved, what time period applies, and whether more than one interpretation is plausible.
3. **Clarification** *(only if ambiguous)* — the system returns a focused question with options and waits for an answer.
4. **Intent refinement** — the original question and the answer are combined:
   *"Show me last month's best customers"* + *"Highest total revenue"* → *"Show me the customers with the highest total revenue during last month."*
5. **SQL generation** — the refined intent plus the database schema produce a query:

   ```sql
   SELECT
       c.id,
       c.name,
       SUM(o.total_amount) AS total_revenue
   FROM customers c
   JOIN orders o ON o.customer_id = c.id
   WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
     AND o.created_at <  DATE_TRUNC('month', CURRENT_DATE)
   GROUP BY c.id, c.name
   ORDER BY total_revenue DESC;
   ```

6. **Validation & execution** — the query is validated, then executed against PostgreSQL.
7. **Results** — rows flow back through FastAPI to the frontend and are displayed.

A clear question such as *"How many new customers signed up last month?"* skips straight from intent analysis to SQL generation.

### Why a separate clarification stage?

```text
Conventional:   Natural language ──► LLM ──► SQL ──► Database
                                     (guesses when ambiguous)

IntentSQL AI:   Natural language ──► Intent analysis ──┬─ clear ──────────────┐
                                                       └─ ambiguous ─► Ask ─► Refine ─┤
                                                                                      ▼
                                                                      SQL ──► Validate ──► Database
```

---

## 🏗️ System Architecture

![IntentSQL AI Software Architecture](./docs/images/Architecture-Diagram.png)

IntentSQL AI is made of four parts:

- **Frontend** — Next.js app with the Playground and a schema viewer.
- **API backend** — FastAPI service exposing REST endpoints and orchestrating the pipeline.
- **AI layer** — Groq-hosted LLM for intent analysis, clarification, and SQL generation.
- **Database** — PostgreSQL, accessed via SQLAlchemy, with Alembic migrations.

SQL generation is **not always the first step**. The system first decides whether the user's intent is specific enough.

---

## 🔐 Query Safety

Generated SQL is treated as **untrusted model output**. The execution layer is deliberately independent of the generation layer:

```text
SQL generation ──► SQL validation ──┬─ invalid / unsafe ──► Reject
                                    └─ valid ──────────────► PostgreSQL
```

Whatever credentials you configure in `DATABASE_URL`, prefer a **least-privilege, read-only database user** when pointing this at real data.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS |
| **Backend** | Python, FastAPI |
| **LLM** | Groq (default model: `openai/gpt-oss-120b`) |
| **Database** | PostgreSQL |
| **ORM / Migrations** | SQLAlchemy, Alembic |
| **Tooling** | npm, uv |
| **Infrastructure** | Docker Compose |
| **API** | REST |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) and npm
- Python 3.x and [uv](https://github.com/astral-sh/uv)
- [Docker](https://www.docker.com) with Docker Compose (runs PostgreSQL)
- A [Groq API key](https://console.groq.com)

### 1. Clone

```bash
git clone <repository-url>
cd "IntentSQL AI"
```

### 2. Configure environment variables

> ⚠️ Never commit `.env` or `.env.local` files that contain real secrets.

**`backend/.env`**

```env
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5433/intentsqlai
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=openai/gpt-oss-120b
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000/api
```

| Variable | Purpose |
| --- | --- |
| `FRONTEND_URL` | Frontend origin allowed by the backend |
| `DATABASE_URL` | PostgreSQL connection string |
| `GROQ_API_KEY` | Groq API authentication |
| `GROQ_MODEL` | Groq model used for intent analysis and SQL generation |
| `NEXT_PUBLIC_API_BASE` | Backend API base URL used by the frontend |

### 3. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

### 4. Set up and run the backend

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000
```

The API is now available at `http://localhost:8000/api`.

### 5. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** and head to the Playground.

### Database migrations

```bash
uv run alembic revision --autogenerate -m "migration message"   # create
uv run alembic upgrade head                                     # apply
uv run alembic downgrade -1                                     # roll back one
```

---

## 📁 Project Structure

```text
IntentSQL AI/
├── .gitignore
├── compose.yml
├── README.md
│
├── docs/
│   └── images/
│       ├── Architecture-Diagram.png   # System architecture diagram
│       ├── intentsql-landing.png      # Landing page screenshot
│       └── intentsql-playground.png   # Playground screenshot
│
├── backend/
│   ├── alembic/             # Migration scripts
│   ├── alembic.ini
│   ├── pyproject.toml
│   ├── uv.lock
│   └── app/
│       ├── ai/              # LLM prompts: intent analysis, clarification, SQL generation
│       ├── apis/            # FastAPI routes
│       ├── core/            # Configuration and app setup
│       ├── models/          # SQLAlchemy models
│       ├── schemas/         # Pydantic request/response schemas
│       ├── seed/            # Seed data
│       ├── services/        # Business logic
│       └── main.py          # FastAPI entry point
│
└── frontend/
    ├── app/
    │   ├── playground/      # Text-to-SQL playground
    │   ├── schema/          # Database schema view
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/          # Reusable UI components
    ├── lib/                 # API clients and utilities
    ├── public/              # Static assets
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## 🗃️ Example Data & Questions

The sample schema models a simple business:

```text
customers   id, name, email, created_at, …
orders      id, customer_id, total_amount, status, created_at, …
payments    id, customer_id, order_id, amount, status, payment_method, created_at
```

**Clear questions** — go straight to SQL:

- How many customers signed up last month?
- What was our total revenue last month?
- Which customers placed more than five orders?
- How many successful payments were made this week?

**Ambiguous questions** — trigger clarification:

- Show me the best customers.
- Show me our top customers.
- Who are our most valuable customers?
- Which products are performing well?

Words like *best*, *top*, *valuable*, and *performing well* depend on business context, which is exactly why the system asks.

---

## 🧠 Key Technical Challenges

| Challenge | Approach |
| --- | --- |
| **Ambiguous natural language** | Detect ambiguous terms and request clarification before generating SQL. |
| **LLM hallucination** | Ground generation in the real database schema and a validated intent. |
| **Intent refinement** | Combine the original question with the user's clarification into one precise intent. |
| **Complex relationships** | Pass table and relationship information to the SQL generation layer. |
| **Unsafe generated SQL** | Treat output as untrusted and validate before execution. |
| **Reliability** | Separate intent analysis, clarification, generation, validation, and execution into distinct stages. |
| **User experience** | Keep clarification conversational; never expose SQL or schema complexity to the user. |

---

## ⚖️ IntentSQL AI vs. Conventional Text-to-SQL

| | Conventional Text-to-SQL | IntentSQL AI |
| --- | --- | --- |
| **Ambiguous question** | The LLM silently picks an interpretation | Detects ambiguity and asks the user |
| **Who decides what "best" means** | The model | The user |
| **Pipeline** | Question → LLM → SQL → DB | Question → intent check → (clarify → refine) → SQL → validation → DB |
| **Predictability** | Same question can yield different assumptions | Interpretation is explicit and confirmed |
| **Schema grounding** | Varies | Schema passed to the SQL generation stage |
| **Generated SQL** | Often executed as-is | Treated as untrusted and validated first |
| **Cost** | One step | One extra round-trip, only when the question is ambiguous |

Clear questions are not slowed down: they skip clarification entirely.

---

## 🩺 Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| Backend can't connect to the database | Make sure `docker compose up -d` is running. `DATABASE_URL` uses port **5433**, so check it matches the port mapping in `compose.yml`. |
| `alembic upgrade head` fails | The database isn't up yet, or `DATABASE_URL` is wrong. Verify the container is healthy and the credentials match. |
| LLM calls fail or return authentication errors | `GROQ_API_KEY` is empty or invalid. Set it in `backend/.env` and restart the backend. |
| Model not found error | Check `GROQ_MODEL` against the models available to your Groq account. |
| Browser shows CORS or network errors | `FRONTEND_URL` in `backend/.env` must match the frontend origin exactly (default `http://localhost:3000`). |
| Frontend can't reach the API | `NEXT_PUBLIC_API_BASE` in `frontend/.env.local` must point to the backend (default `http://localhost:8000/api`). Restart `npm run dev` after changing it. |
| README images don't show on GitHub | Image paths are case-sensitive on GitHub. Keep filenames identical to those in `docs/images/`. |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

Released under the [MIT License](./LICENSE).

---

## 👨‍💻 Author

**Sumanth Gunji**: building clean, scalable, intelligent applications that combine modern web technologies with AI to solve practical problems.


<div align="center">

⭐ If you found this project interesting, consider giving it a star!


</div>