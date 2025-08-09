# Disney Clone (React + Vite Modernized)

A modern Disney+ style UI clone built with React 18, Vite, Tailwind CSS, and React Query. Recently upgraded for better performance, accessibility, DX, and test coverage.

## Features

- React 18 + Vite fast dev server & code splitting
- Tailwind CSS styling
- Data fetching & caching with @tanstack/react-query
- Centralized TMDB API client (Axios + interceptors)
- Lazy loaded feature sections (Slider, ProductionHouse, Genre lists)
- Skeleton loading states for perceived performance
- Accessible navigation & interactive elements (ARIA labels, focus states)
- PropTypes validation
- Vitest + Testing Library test setup

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/mdaashir/Disney-Clone.git
cd Disney-Clone
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
VITE_TMDB_API_KEY=YOUR_TMDB_KEY_HERE
```

(You can copy from `.env.example`).

### 3. Run Dev Server

```bash
npm run dev
```

Open the printed local URL.

### 4. Run Tests

```bash
npm test -- --run
```

Or watch mode:

```bash
npm test
```

### 5. Build for Production

```bash
npm run build
```

Preview (optional):

```bash
npm run preview
```

## Scripts

- `dev` – Start Vite dev server
- `build` – Production build
- `preview` – Preview production build locally
- `test` – Vitest in watch mode
- `test:run` – Single run (alias via `npm test -- --run`)
- `format` – Prettier write
- `lint:fix` – ESLint auto-fix staged code (via lint-staged in pre-commit)

## Tech Stack

| Area       | Tool                                                        |
| ---------- | ----------------------------------------------------------- |
| Framework  | React 18                                                    |
| Bundler    | Vite                                                        |
| Styling    | Tailwind CSS                                                |
| Data Layer | @tanstack/react-query + Axios                               |
| Testing    | Vitest + @testing-library/react + @testing-library/jest-dom |
| Formatting | Prettier                                                    |
| Linting    | ESLint + lint-staged + Husky                                |

## Project Structure (key files)

```
src/
  api/tmdb.js          # Axios instance & TMDB helpers
  Components/          # UI components
  App.jsx              # App shell with Suspense boundaries
  main.jsx             # Entry point (QueryClient + React root)
  __tests__/           # Test suites
```

## TMDB API

This project relies on The Movie Database (TMDB) API. Sign up at https://www.themoviedb.org/ to obtain an API key and place it in `.env`.

## Testing Notes

Tests use jsdom environment. Example areas covered:

- Header rendering & mobile menu toggle
- MovieCard rendering behavior
- TMDB API abstraction (mocked Axios)
  Add more tests for error states and skeletons as needed.

## Accessibility

Semantic elements and aria-labels implemented. Continue auditing via browser dev tools / Lighthouse for further improvements.

## Contributing / Future Work

Potential enhancements:

- TypeScript migration
- Error boundaries & retry UI
- Expanded test coverage (loading & error cases)
- CI workflow (GitHub Actions) for lint + test + build
- Remove any remaining legacy code paths

## Cleanup Performed

- Removed unused legacy shim (`src/Services/GlobalApi.jsx`)
- Removed unused genres constants (`src/Constants/GenresList.jsx`)
- Removed temporary PR body file

## License

See [LICENSE](./LICENSE).
