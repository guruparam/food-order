import { neon } from "@neondatabase/serverless"

let sql: any = null

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL)
}

// Mock database for development when DATABASE_URL is not set
const mockDb = {
  users: [
    {
      id: "admin-1",
      email: "nickfury@admin.com",
      password: "admin123",
      name: "Nick Fury",
      role: "admin",
      country: "USA",
    },
    {
      id: "manager-india",
      email: "captainmarvel@manager.com",
      password: "manager123",
      name: "Captain Marvel",
      role: "manager",
      country: "India",
    },
    {
      id: "manager-usa",
      email: "captainamerica@manager.com",
      password: "manager123",
      name: "Captain America",
      role: "manager",
      country: "USA",
    },
    {
      id: "member-india-1",
      email: "thanos@member.com",
      password: "member123",
      name: "Thanos",
      role: "member",
      country: "India",
    },
    {
      id: "member-india-2",
      email: "thor@member.com",
      password: "member123",
      name: "Thor",
      role: "member",
      country: "India",
    },
    {
      id: "member-usa",
      email: "travis@member.com",
      password: "member123",
      name: "Travis",
      role: "member",
      country: "USA",
    },
  ],
  restaurants: [
    {
      id: "rest-india-1",
      name: "Mumbai Masala",
      country: "India",
      description: "Authentic Indian Cuisine",
    },
    {
      id: "rest-india-2",
      name: "Delhi Delights",
      country: "India",
      description: "North Indian Specialties",
    },
    {
      id: "rest-usa-1",
      name: "New York Pizza",
      country: "USA",
      description: "Classic American Pizzas",
    },
    {
      id: "rest-usa-2",
      name: "Texas Burger House",
      country: "USA",
      description: "Premium Burgers",
    },
  ],
  menus: [
    {
      id: "menu-1",
      restaurantId: "rest-india-1",
      name: "Butter Chicken",
      price: 320,
      description: "Creamy tomato-based curry",
    },
    {
      id: "menu-2",
      restaurantId: "rest-india-1",
      name: "Biryani",
      price: 250,
      description: "Fragrant rice dish",
    },
    {
      id: "menu-3",
      restaurantId: "rest-india-2",
      name: "Rogan Josh",
      price: 300,
      description: "Aromatic lamb curry",
    },
    {
      id: "menu-4",
      restaurantId: "rest-usa-1",
      name: "Pepperoni Pizza",
      price: 15,
      description: "Classic pepperoni",
    },
    {
      id: "menu-5",
      restaurantId: "rest-usa-2",
      name: "Wagyu Burger",
      price: 18,
      description: "Premium beef burger",
    },
  ],
  paymentMethods: [
    {
      id: "pm-1",
      userId: "admin-1",
      cardLast4: "4242",
      type: "credit_card",
    },
    {
      id: "pm-2",
      userId: "manager-india",
      cardLast4: "5555",
      type: "debit_card",
    },
  ],
  orders: [],
}

export async function initializeDatabase() {
  if (!sql) return

  try {
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'member')),
        country VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS menus (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id),
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id),
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id),
        menu_id UUID NOT NULL REFERENCES menus(id),
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS payment_methods (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        card_last4 VARCHAR(4) NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Seed initial data
    const userExists = await sql`SELECT COUNT(*) FROM users;`
    if (userExists[0].count === 0) {
      // Insert seed data
    }
  } catch (error) {
    console.log("[v1] Database initialization - using mock data", error)
  }
}

export { sql, mockDb }
