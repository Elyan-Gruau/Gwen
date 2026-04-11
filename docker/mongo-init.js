// MongoDB initialization script for Gwen
// This script creates the gwen_user and initializes collections

// Wait for admin database to be ready
sleep(2000);

// Switch to admin database
db = db.getSiblingDB("admin");

// Check if user already exists
const userExists = db.getUser("gwen_user");

if (userExists) {
  console.log("User 'gwen_user' already exists");
} else {
  // Create the gwen_user with the correct password
  db.createUser({
    user: "gwen_user",
    pwd: "gwen_password",
    roles: [
      {
        role: "readWrite",
        db: "gwen"
      }
    ]
  });
  console.log("User 'gwen_user' created successfully");
}

// Switch to gwen database to create collections
db = db.getSiblingDB("gwen");

// Create collections if they don't exist
const collections = db.getCollectionNames();

if (!collections.includes("users")) {
  db.createCollection("users");
  console.log("Collection 'users' created");
}

if (!collections.includes("games")) {
  db.createCollection("games");
  console.log("Collection 'games' created");
}

if (!collections.includes("matchmaking_pool")) {
  db.createCollection("matchmaking_pool");
  console.log("Collection 'matchmaking_pool' created");
}

console.log("MongoDB initialization completed successfully");


