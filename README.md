# TradingView CMS — Next.js Page Builder

A full Next.js CMS with admin panel, page builder, EN/AR language support, and the TradingView dark theme.

## Features

- **Admin Panel** (`/admin`) — Secure login, visual page builder
- **Page Builder** — Create unlimited pages with custom slugs
- **Section Editor** — Toggle, reorder, and edit all sections
- **Multi-Language** — English (LTR) & Arabic (RTL) with live toggle
- **Image Upload** — Upload hero backgrounds from admin
- **Online Support Widget** — Replaces Scott Poteet card (bottom-right)
- **Server-Rendered** — No loading flash, instant page load
- **All Sections** — Hero, Ticker, Chart, Markets, Ideas, Features, Stats, Plans, Brokers, App, Footer

## Quick Start

```bash
npm install
npm run dev
```

Open:
- **Site** → http://localhost:3000
- **Admin** → http://localhost:3000/admin

## Admin Login

Default credentials:
- **Username:** `admin`
- **Password:** `admin123`

Change in production via environment variables:
```
ADMIN_USER=yourusername
ADMIN_PASS=yourpassword
JWT_SECRET=your-secret-key
```

## How It Works

### Pages
- Homepage renders at `/`
- Custom pages render at `/{slug}` (e.g., `/about`, `/trading`)
- Create new pages from admin with any slug

### Sections
Each page has toggleable, reorderable sections:
| Section | Description |
|---------|-------------|
| Hero | Full-screen with your space photo background |
| Ticker | Scrolling market prices bar |
| Where World | Chart widget with live price |
| Market Summary | Tabbed market data (S&P, Crypto, Forex, etc.) |
| Community Ideas | Trading ideas grid |
| Features | 6-card feature grid |
| Stats | 4 stat counters |
| Plans | 4 pricing cards |
| Brokers | Broker logos grid |
| App | Mobile app download section |
| Footer | Full footer with links |

### Language Toggle
Click the globe icon (EN/AR) in the nav — content switches instantly including RTL layout for Arabic.

## File Structure

```
├── public/
│   └── space-desktop.webp     ← Your hero image
├── data/
│   └── pages.json             ← Page configurations (auto-created)
├── src/
│   ├── app/
│   │   ├── page.js            ← Homepage (server component)
│   │   ├── [slug]/page.js     ← Dynamic pages
│   │   ├── admin/page.js      ← Admin panel
│   │   ├── api/auth/          ← Login API
│   │   ├── api/pages/         ← CRUD API
│   │   └── api/upload/        ← Image upload API
│   ├── components/
│   │   └── PageRenderer.js    ← All section components
│   ├── data/
│   │   ├── translations.js    ← EN/AR translations
│   │   ├── marketData.js      ← Ticker & market data
│   │   └── defaultPages.js    ← Default page templates
│   └── lib/
│       ├── auth.js            ← JWT auth
│       └── storage.js         ← JSON file storage
```

## Production

```bash
npm run build
npm start
```

For production, consider:
- Set `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASS` env vars
- Replace JSON file storage with a database
- Add rate limiting to auth endpoint
