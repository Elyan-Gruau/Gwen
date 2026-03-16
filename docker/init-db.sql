
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_faction_decks table
CREATE TABLE IF NOT EXISTS user_faction_decks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  faction_id VARCHAR(255) NOT NULL,
  leader_card_id VARCHAR(255),
  unit_card_ids JSONB DEFAULT '[]',
  special_card_ids JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, faction_id)
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_faction_decks_user_id ON user_faction_decks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_faction_decks_faction_id ON user_faction_decks(faction_id);

