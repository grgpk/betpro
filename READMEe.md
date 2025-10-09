# Sports Betting Platform

An Angular application for managing sports events with real-time odds updates and betting functionality.

## Features

- **Event Management** - Browse, filter, sort, and manage sports events
- **Betslip** - Add selections and place bets with potential winnings calculation
- **Bet History** - Track all placed bets with statistics
- **Real-time Odds** - Live odds updates every 5 seconds
- **Filtering & Sorting** - Client-side filtering by sport, status, date range
- **Virtual Scroll** - Toggle between scroll view and paginated view
- **State Persistence** - Filters and preferences saved to localStorage

## Tech Stack

- **Angular 20.3.0** - Standalone components, signals, OnPush
- **NgRx** - State management with effects
- **Angular Material** - UI components
- **CDK Virtual Scroll** - Performance optimization
- **RxJS** - Reactive programming
- **JSON Server** - Mock REST API
- **TypeScript** - Type safety

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Start services
docker compose up -d

# Stop services
docker compose down
```

**Access:**

- App: http://localhost:8080
- API: http://localhost:3000

### Manual Setup

```bash
# Install dependencies
npm install

# Start API (terminal 1)
npm run start:api

# Start app (terminal 2)
npm start
```

Navigate to http://localhost:4200

## Project Structure

```
src/app/
├── components/
│   ├── event-list/           # Main events page with filters
│   ├── event-details/        # Event details & edit
│   ├── betslip/             # Betslip sidebar
│   └── bet-history/         # Bet history page
├── store/
│   ├── events/              # Events state (NgRx)
│   ├── betslip/            # Betslip state (NgRx)
│   └── bet-history/        # Bet history state (NgRx)
├── services/
│   ├── events.service.ts    # Events API
│   ├── odds.service.ts      # Real-time odds simulation
│   └── bet-history.service.ts
└── models/                  # TypeScript interfaces
```

## Key Features

### Event List

- Grid layout with event cards
- Client-side filtering (sport, status, date range)
- Client-side sorting (title, date, sport, status)
- Toggle between scroll view and page view
- Add to betslip from cards
- Delete events with confirmation

### Betslip

- Sticky sidebar on all pages
- Calculate total odds and potential winnings
- Adjust stake amounts
- Place bets (saved to history)
- Persists to localStorage

### Bet History

- View all placed bets
- Filter by status (pending/won/lost)
- Statistics cards (total bets, win rate, profit/loss)
- Tabbed interface (all/pending/settled)

### State Management

- NgRx for centralized state
- Client-side filtering and sorting (no API params)
- localStorage persistence for filters and betslip
- Effects for async operations

## Configuration

Environment file: `src/environments/environment.ts`

```typescript
export const environment = {
  apiUrl: 'http://localhost:3000',
};
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --code-coverage
```

## API Endpoints

- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `GET /bet-history` - Get bet history
- `POST /bet-history` - Create bet

## Docker

Services:

- **app** (port 8080) - Angular app with nginx
- **api** (port 3000) - JSON Server

Data persists in `db.json` volume.
