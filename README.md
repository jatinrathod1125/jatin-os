# Jatin OS Portfolio

A Laravel 13 portfolio that behaves like a futuristic developer operating system. Visitors boot
into a React/Inertia desktop, launch draggable apps, run terminal commands, inspect projects,
chat with ORBIT and send contact messages.

## Stack

- Laravel 13 with Fortify authentication, authorization and Eloquent data models
- Inertia 3, React 19, TypeScript, Tailwind CSS 4 and Framer Motion
- MySQL-ready deployment configuration, with SQLite used by default for local demonstration
- Optional server-side OpenAI Responses API integration

## Included Modules

- Animated boot sequence, responsive desktop, task dock and interactive windows
- Terminal commands: `help`, `about`, `skills`, `projects`, `contact`, `open ai`, `hire jatin`
  and `clear`
- Projects and skills apps backed by seeded Laravel records
- ORBIT assistant with voice input, typing animation, persisted history and local fallback answers
- Contact inbox, privacy-conscious visitor analytics and generated ambient audio player
- Laravel authentication plus an admin console for project/skill CRUD, messages and analytics

## Local Setup

```bash
composer install
npm install
php artisan migrate:fresh --seed
npm run build
composer run dev
```

The checked-out local environment uses SQLite and seeds an administrator account for evaluation:
`admin@jatin.local` / `password`. Replace those values before any hosted use.

## Deployment Configuration

Set MySQL credentials through `DB_*`, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before seeding an
administrator, and provide `OPENAI_API_KEY` plus an optional `OPENAI_MODEL` to enable live ORBIT
answers. API keys remain server-side; without one the assistant continues to serve grounded
portfolio answers locally.
