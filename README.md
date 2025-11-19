# DRS Digital - Digital Product Marketplace

A clean, fast, and minimal digital marketplace built with Next.js 14, TypeScript, and TailwindCSS.

## Features

- 🛍️ **Product Catalog**: Browse and purchase digital products
- 💳 **Payment Integration**: Secure payments via Razorpay
- 📦 **Digital Delivery**: Instant downloads after purchase
- 👤 **User Authentication**: Email/password authentication with NextAuth
- 🔐 **Admin Panel**: Manage products and view orders
- 📱 **Responsive Design**: Mobile-first, responsive UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payment**: Razorpay
- **File Upload**: UploadThing

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Razorpay account (for payments)
- UploadThing account (for file uploads)

### Installation

1. Clone the repository:
```bash
cd "DRS digital"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your `.env` file with:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate a random secret (e.g., `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
- `RAZORPAY_KEY_ID`: Your Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay key secret
- `UPLOADTHING_SECRET`: Your UploadThing secret
- `UPLOADTHING_APP_ID`: Your UploadThing app ID

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Creating an Admin User

To create an admin user, you can use Prisma Studio:

```bash
npx prisma studio
```

Then manually set `isAdmin: true` for a user, or create a user directly in the database with `isAdmin: true`.

Alternatively, you can create a seed script or use the database directly to set a user as admin.

## Project Structure

```
├── app/
│   ├── admin/              # Admin panel pages
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── checkout/           # Checkout flow
│   ├── products/           # Product pages
│   ├── shop/               # Shop listing
│   └── ...                 # Other pages
├── components/             # React components
├── lib/                    # Utility functions
├── prisma/                 # Database schema
└── types/                  # TypeScript types
```

## Key Features

### Admin Panel
- Add, edit, and delete products
- Upload product images and digital files
- View all orders
- Manage product status (active/inactive)

### User Features
- Browse products
- Purchase digital products
- Download purchased products
- View purchase history

### Payment Flow
1. User clicks "BUY NOW"
2. Order is created
3. Razorpay checkout opens
4. Payment is processed
5. Download links are generated
6. User can download immediately

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The project uses Prisma with the following main models:
- `User`: User accounts and authentication
- `Product`: Digital products for sale
- `Order`: Purchase orders
- `OrderItem`: Items in each order
- `DownloadLink`: Download links for purchased products

## License

This project is private and proprietary.

