# Gwen Server

Express.js backend server for the Gwen card game, featuring authentication, user faction decks management, and OpenAPI
documentation.

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL (running via Docker or locally)
- MongoDB (for user authentication)

### Installation

```bash
npm install
```

### Configuration

Set the following environment variables:

```env
PORT=3000
NODE_ENV=development

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=gwenuser
POSTGRES_PASSWORD=gwenpassword
POSTGRES_DB=gwenuser

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=3600000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/gwen
```

## Development

Start the development server:

```bash
npm run dev
```

Build TypeScript:

```bash
npm run build
```

Lint code:

```bash
npm run lint
```

Format code:

```bash
npm run format:fix
```

## API Documentation

### OpenAPI Specification

The API conforms to the OpenAPI 3.0.0 specification. The spec is available at:

- **JSON Spec**: `http://localhost:3000/api/openapi.json`
- **Swagger UI**: `http://localhost:3000/api-docs`

### API Endpoints

#### Authentication

- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/register` - Register a new user

#### User Faction Decks

- `GET /api/user/{userId}/decks` - Get all faction decks for a user
- `GET /api/user/{userId}/decks/{factionId}` - Get a specific deck
- `POST /api/user/{userId}/decks` - Create a new deck
- `PUT /api/user/{userId}/decks/{factionId}` - Update a deck
- `DELETE /api/user/{userId}/decks/{factionId}` - Delete a deck

## Architecture

### Directory Structure

```
src/
├── config/
│   ├── database.ts       # PostgreSQL connection pool
│   └── swagger.ts        # OpenAPI/Swagger configuration
├── features/
│   └── auth/
│       ├── model/        # Database models (DBUser, DBUserFactionDeck)
│       ├── repository/   # Data access layer
│       ├── services/     # Business logic
│       ├── resources/    # API routes
│       ├── dtos/         # Data transfer objects
│       └── exceptions/   # Custom exceptions
├── index.ts              # Main application entry point
└── types/                # TypeScript type declarations
```

### Technology Stack

- **Express.js**: Web framework
- **TypeScript**: Type safety
- **PostgreSQL**: User faction decks storage
- **MongoDB**: User authentication data
- **Swagger/OpenAPI**: API documentation
- **pg**: PostgreSQL client

## Generated API Client

The `gwen-generated-api` package contains auto-generated API client and DTOs for use in frontend applications.

### Usage in React Client

```typescript
import {GwenApiClient} from 'gwen-generated-api';

const apiClient = new GwenApiClient('http://localhost:3000/api');

// Login
const response = await apiClient.auth.login({
    username: 'player1',
    password: 'password123',
});

// Set token for subsequent requests
apiClient.setToken(response.token);

// Get user decks
const decks = await apiClient.userFactionDeck.getUserFactionDecks(userId);
```

## Database

### PostgreSQL Tables

#### users

Stores user authentication credentials (MongoDB references).

#### user_faction_decks

Stores player deck configurations for each faction.

- One deck per faction per user
- JSONB arrays for card IDs
- Timestamps for tracking changes

### Initialization

PostgreSQL database is automatically initialized via `docker/init-db.sql` when running Docker.

## Docker

Run with Docker Compose:

```bash
docker-compose up
```

Services:

- **gwen-server**: API server on port 3000
- **gwen-postgres**: PostgreSQL database on port 5432
- **gwen-client**: React frontend on port 5173

## Contributing

Follow the project's linting and formatting standards:

```bash
npm run lint
npm run format:fix
```

