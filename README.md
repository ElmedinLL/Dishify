# Dishify

A full-stack restaurant ordering application built with React and .NET. Browse menu items, add to cart, place orders, and manage everything from a modern web interface.

![Dishify](https://img.shields.io/badge/Dishify-Restaurant%20Ordering-ff6b6b?style=for-the-badge)

## Features

- **Menu browsing** — View menu items with images, descriptions, and ratings
- **Product details** — Full product info with quantity selector and pickup/delivery options
- **Shopping cart** — Add items, adjust quantities, proceed to checkout
- **Authentication** — Login and register with JWT-based auth
- **Order placement** — Checkout flow with order confirmation
- **Order management** — View orders, update status, rate completed orders
- **Admin menu management** — Create, update, and delete menu items (admin only)
- **Dark mode** — Toggle between light and dark themes

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 | .NET 9 |
| Vite 7 | Entity Framework Core |
| Redux Toolkit | SQL Server |
| React Router 7 | JWT Authentication |
| Bootstrap 5 | ASP.NET Core Identity |

## Project Structure

```
Dishify/
├── Dishify_API/          # .NET 9 Web API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── Migrations/
├── Dishify_Client/      # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utility/
│   └── vite.config.js
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/sql-server) (or SQL Server Express)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Dishify.git
cd Dishify
```

### 2. Backend setup

```bash
cd Dishify_API
dotnet restore
```

Create `appsettings.Development.json` (or update existing) with your connection string and JWT key:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=DishifyDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "your-secret-key-at-least-32-characters-long"
  }
}
```

Run migrations and start the API:

```bash
dotnet ef database update
dotnet run
```

API runs at `http://localhost:5150`

### 3. Frontend setup

```bash
cd Dishify_Client
npm install
npm run dev
```

Client runs at `http://localhost:5173` and proxies API requests to the backend.

### 4. Build for production

```bash
# API
cd Dishify_API
dotnet publish -c Release

# Client
cd Dishify_Client
npm run build
```

## API Documentation

When running in development, Swagger/Scalar API docs are available at:

- `http://localhost:5150/scalar/v1` (Scalar UI)
- `http://localhost:5150/openapi/v1.json` (OpenAPI spec)

## License

MIT
