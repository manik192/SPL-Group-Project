CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dishes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dish_id INTEGER NOT NULL REFERENCES dishes(id),
  qty INTEGER NOT NULL CHECK (qty > 0),
  UNIQUE(user_id, dish_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  status TEXT NOT NULL,
  total_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dish_id INTEGER NOT NULL REFERENCES dishes(id),
  qty INTEGER NOT NULL,
  price_cents INTEGER NOT NULL
);

INSERT INTO dishes(name, description, price_cents, category)
VALUES
('Chicken Tikka Masala','Creamy tomato-based curry', 1499, 'Curry'),
('Paneer Butter Masala','Rich butter gravy with paneer', 1399, 'Curry'),
('Masala Dosa','Crispy rice crepe with spiced potatoes', 1099, 'South Indian')
ON CONFLICT DO NOTHING;
