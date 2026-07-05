# Gym WhatsApp Automation API — Backend Foundation

This is the production-ready backend foundation for the Gym WhatsApp Automation SaaS platform. It is built using FastAPI, PostgreSQL (SQLAlchemy 2.0 async), Pydantic v2, and includes rate limiting, security utilities, and Sentry monitoring out-of-the-box.

## Project Structure

```text
backend/
├── app/
│   ├── main.py              # Application entrypoint (CORS, Middlewares, Sentry, Rate-limits)
│   ├── config.py            # Configuration loading using Pydantic Settings
│   ├── database.py          # Database async engine & pool configuration
│   ├── dependencies.py      # Core dependency helper injections (DB sessions, authentication)
│   ├── models/              # SQLAlchemy models directory
│   ├── schemas/             # Pydantic validation schemas directory
│   ├── routers/             # API Router modules (auth, gym, whatsapp, webhooks, automations, health)
│   ├── services/            # Business logic layer
│   ├── utils/               # Utilities & helper modules (security hashing/tokens)
│   └── middleware/          # Custom middlewares
├── alembic/                 # Database migrations setup
├── requirements.txt         # Pinned packages
├── Dockerfile               # Multi-stage production container build config
├── .env.example             # Configuration template
└── README.md                # Development instructions
```

## Getting Started

### Prerequisites

* Python 3.12+
* Docker (Optional, for running inside a container)

---

### Local Development Setup

1. **Clone the repository** and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   - On Unix/macOS:
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```
   - On Windows:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment configuration**:
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
   *Make sure you provide a valid database connection string (e.g., Supabase Postgres with `postgresql+asyncpg://`) and secure secrets.*

---

### Running the Server

Start the local development server with auto-reload enabled:
```bash
uvicorn app.main:app --reload
```

Once running, you can access:
* **API Documentation (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
* **API Documentation (ReDoc):** [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Health Check Endpoint:** [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

### Docker Execution

To build and run the application inside Docker containers:

1. **Build the image**:
   ```bash
   docker build -t gym-backend .
   ```

2. **Run the container**:
   Provide the environment variables (e.g. from `.env` file):
   ```bash
   docker run --env-file .env -p 8000:8000 gym-backend
   ```

---

## Infrastructure Features

* **Rate Limiting:** Managed using `slowapi` with a default rate limit of 100 requests per minute globally.
* **Error Tracking:** Handled by `sentry-sdk` (automatically active if `SENTRY_DSN` is populated).
* **Database Pooling:** Pre-configured with safety pre-pings and connection limit settings optimized for Supabase.
* **Security:** Configured with secure JWT (access & refresh tokens) generator using `python-jose` and password hashing with `bcrypt`.
