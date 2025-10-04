# Sports Event Management Application

A comprehensive Angular application for managing sports events with real-time odds updates and betting functionality.

## Features

### Core Functionality

- ✅ **Event List Page** - View all sports events with filtering, sorting, and pagination
- ✅ **Add Events** - Create new events via modal dialog with full validation
- ✅ **Delete Events** - Remove events with confirmation
- ✅ **Event Details Page** - View and edit complete event information
- ✅ **Betslip** - Shopping cart for selected betting options
- ✅ **Real-time Odds** - Live odds updates every 5 seconds for active events
- ✅ **Data Validation** - Comprehensive validation for all operations
- ✅ **Backend Integration** - Full HTTP API integration with JSON Server

### Advanced Features

- ✅ **NgRx State Management** - Centralized state with actions, reducers, and effects
- ✅ **Pagination** - Efficient data loading with configurable page sizes
- ✅ **Filtering** - Filter by sport type, status, and search term
- ✅ **Sorting** - Sort by title, date, sport, or status
- ✅ **URL Persistence** - Filters, sorting, and pagination preserved in URL
- ✅ **LocalStorage** - Betslip persisted across sessions
- ✅ **Real-time Updates** - Odds simulation via intervals
- ✅ **Reactive Forms** - All forms built using Reactive Forms
- ✅ **Angular Material** - Professional UI components
- ✅ **Standalone Components** - Modern Angular architecture
- ✅ **Unit Tests** - Test coverage for services and state management

## Technology Stack

- **Angular 20.3.0** - Latest Angular framework
- **NgRx** - State management (Store, Effects, DevTools)
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **JSON Server** - Mock REST API backend
- **TypeScript** - Type-safe development
- **Jasmine/Karma** - Unit testing

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the JSON Server (in one terminal):**

   ```bash
   npm run start:api
   ```

   This will start the backend API at `http://localhost:3000`

3. **Start the Angular application (in another terminal):**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200`

## Project Structure

```
src/app/
├── components/
│   ├── event-list/              # Main events list page
│   ├── event-details/           # Event details and edit page
│   ├── add-event-dialog/        # Add new event modal
│   └── betslip/                 # Betslip sidebar
├── models/
│   ├── sport-event.model.ts     # SportEvent interface
│   ├── bet.model.ts             # Bet interface
│   └── filters.model.ts         # Filter/Sort/Pagination interfaces
├── services/
│   ├── events.service.ts        # HTTP API service
│   └── odds.service.ts          # Real-time odds simulation
└── store/
    ├── events/                  # Events state management
    │   ├── events.actions.ts
    │   ├── events.reducer.ts
    │   ├── events.effects.ts
    │   └── events.selectors.ts
    └── betslip/                 # Betslip state management
        ├── betslip.actions.ts
        ├── betslip.reducer.ts
        ├── betslip.effects.ts
        └── betslip.selectors.ts
```

## Data Models

### SportEvent

```typescript
interface SportEvent {
  id: string;
  title: string; // 2-100 characters
  description: string; // 2-200 characters
  sport: 'football' | 'basketball' | 'tennis' | 'volleyball';
  homeTeam: string; // 2-50 characters
  awayTeam: string; // 2-50 characters
  startTime: Date;
  status: 'upcoming' | 'live' | 'finished';
  odds: {
    home: number; // 1.01-100
    draw?: number; // 1.01-100 (optional)
    away: number; // 1.01-100
  };
  isLive: boolean;
}
```

### Bet

```typescript
interface Bet {
  id: string;
  eventId: string;
  eventTitle: string;
  selection: 'home' | 'draw' | 'away';
  odds: number;
  stake?: number;
}
```

## Configuration

API endpoint is configured in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  wsUrl: 'ws://localhost:3000',
};
```

## Features in Detail

### 1. Event List

- Grid layout with Material cards
- Real-time odds display
- Quick add to betslip buttons
- Filter by sport, status, search
- Sort by multiple fields
- Pagination with configurable page size
- Delete events with confirmation

### 2. Add Event

- Modal dialog form
- Reactive Forms with validation
- Real-time error messages
- Conditional draw odds (football/volleyball only)
- Date picker for start time

### 3. Event Details

- View mode with formatted display
- Edit mode with inline form
- Save/cancel functionality
- Add to betslip options
- Delete event option
- Real-time odds updates

### 4. Betslip

- Sticky sidebar
- Add/remove bets
- Update stake amounts
- Calculate total odds and potential winnings
- Persist to localStorage
- Place bet functionality
- Clear all option

### 5. Real-time Odds

- Automatic odds updates every 5 seconds
- Only for live events
- ±10% variation
- Updates reflected everywhere instantly

### 6. State Management (NgRx)

- Centralized application state
- Immutable state updates
- Side effects handling
- Redux DevTools integration
- Time-travel debugging

### 7. URL Persistence

- Filters saved to URL query params
- Sorting preferences preserved
- Pagination state maintained
- Refresh page maintains state

## Running Tests

```bash
npm test
```

Tests include:

- Service unit tests
- Reducer unit tests
- Component tests (can be extended)

## API Endpoints

JSON Server automatically creates these endpoints:

- `GET /events` - List events (with pagination, filtering, sorting)
- `GET /events/:id` - Get single event
- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

Query parameters:

- `_page`, `_per_page` - Pagination
- `_sort`, `_order` - Sorting
- `sport`, `status` - Filtering
- `q` - Full-text search

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
