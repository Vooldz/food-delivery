# Food Delivery Backend API

A backend API for a **Food Delivery Platform**, built with **NestJS**, **Prisma ORM**, and **PostgreSQL**.  
The system manages **users, restaurants, drivers, menu items, orders, order items, and deliveries**, with **role-based access control (RBAC)** and **JWT authentication with refresh tokens**.

---

## Features

- **Authentication & Authorization**
  - JWT **Access Tokens** for API authentication.
  - JWT **Refresh Tokens** for session persistence and token renewal.
  - Role-based access control with custom guards (`customer`, `restaurant`, `driver`, `admin`).

- **Users & Roles**
  - Customers can place orders.
  - Restaurants can manage their own menu items and receive orders.
  - Drivers can be assigned to deliveries and update delivery statuses.
  - Admins have full control over all resources.

- **Restaurants & Menu Items**
  - Restaurants are linked to a user with the role `restaurant`.
  - Menu items belong to a restaurant.
  - Restaurants can manage only their own menu items.

- **Orders & Order Items**
  - Customers create orders tied to a specific restaurant.
  - Each order contains one or more order items linked to menu items.
  - Order status lifecycle: `pending → preparing → on_the_way → delivered` (with `cancelled` / `declined` as exceptions).

- **Deliveries**
  - Each order can have a delivery entry.
  - A delivery is assigned to a driver (`driverId`).
  - Drivers update timestamps (`assignedAt`, `pickedUpAt`, `deliveredAt`) as they progress.

- **Pagination & Validation**
  - All list endpoints support pagination (`limit`, `page`).
  - Custom validation pipes for UUIDs and request DTOs.

- **Database & Performance**
  - Optimized with **indexes** (e.g., on `createdAt`, `status`, foreign keys).
  - Prisma schema models relations explicitly for strong referential integrity.

---

## Data Model Overview

### User

- Can be `customer`, `restaurant`, `driver`, or `admin`.
- Has one `Driver` profile (if role = driver).
- Can own multiple `Restaurants` (if role = restaurant).
- Places multiple `Orders`.

### Restaurant

- Belongs to a `User` (role = restaurant).
- Has many `MenuItems`.
- Receives multiple `Orders`.

### MenuItem

- Belongs to a `Restaurant`.
- Can appear in many `OrderItems`.

### Order

- Belongs to a `Customer` (`User`).
- Belongs to a `Restaurant`.
- Contains multiple `OrderItems`.
- Has one optional `Delivery`.

### OrderItem

- Belongs to one `Order`.
- Belongs to one `MenuItem`.

### Delivery

- Belongs to one `Order` (unique).
- Assigned to one `Driver`.
- Tracks timestamps (`assignedAt`, `pickedUpAt`, `deliveredAt`).

---

## Tech Stack

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Authentication**: JWT (Access + Refresh Tokens)
- **Language**: TypeScript
- **Other**: Passport, Guards, DTO validation, Custom decorators

---

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Prisma CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/Vooldz/food-delivery.git
cd food-delivery

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev

# Start the application
npm run start:dev
```

## License

This project is provided for **educational purposes** and as part of a **portfolio showcase**.
