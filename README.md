# Indallo Web App

Vue.js 3 + TypeScript web application for the Indallo Telegram bot.

## Features

- **Profile Management**: View user information, subscription status, and settings
- **Summaries (Qisqa bayonlar)**: Browse last 3 days of channel summaries with date tabs
- **Breaking News**: Access breaking news grouped by date (requires subscription)
- **Multi-language Support**: Uzbek (UZ), Russian (RU), and English (EN)
- **Telegram-like UI**: Clean, minimal design inspired by Telegram

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vite
- Vue Router
- Pinia
- Axios
- Vue I18n (custom implementation)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_BOT_USERNAME=your_bot_username
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable Vue components
├── views/         # Page views (Profile, Summaries, BreakingNews)
├── composables/   # Vue composables (auth, API, etc.)
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── router/        # Vue Router configuration
├── store/         # Pinia stores
└── locales/       # Translation files (UZ, RU, EN)
```

## Authentication

The app uses Telegram Web Login. Users are redirected to the Telegram bot for authentication, and the bot redirects back with authentication data.

## API Integration

The app integrates with the existing Django REST API:
- User management: `/api/users/`
- Channel management: `/api/channels/`
- Posts/Summaries: `/api/posts/`
- Breaking news: `/api/important_collected_posts/`
- Subscriptions: `/api/users/subscription/`

## Development

- Development server runs on `http://localhost:5173`
- Hot module replacement (HMR) is enabled
- TypeScript type checking is enabled

## Building

The build output will be in the `dist/` directory. You can preview the production build with:

```bash
npm run preview
```
