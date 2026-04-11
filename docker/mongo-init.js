// MongoDB initialization script for Gwen
// This script creates the gwen_user and initializes collections

// Wait for admin database to be ready
sleep(2000);

// Switch to admin database
db = db.getSiblingDB('admin');

// Check if user already exists
const userExists = db.getUser('gwen_user');

if (userExists) {
  console.log("User 'gwen_user' already exists");
} else {
  // Create the gwen_user with the correct password
  db.createUser({
    user: 'gwen_user',
    pwd: 'gwen_password',
    roles: [
      {
        role: 'readWrite',
        db: 'gwen',
      },
    ],
  });
  console.log("User 'gwen_user' created successfully");
}

// Switch to gwen database to create collections
db = db.getSiblingDB('gwen');

// Create collections if they don't exist
const collections = db.getCollectionNames();

if (!collections.includes('users')) {
  db.createCollection('users');
  console.log("Collection 'users' created");
}

if (!collections.includes('games')) {
  db.createCollection('games');
  console.log("Collection 'games' created");
}

if (!collections.includes('matchmaking_pool')) {
  db.createCollection('matchmaking_pool');
  console.log("Collection 'matchmaking_pool' created");
}

console.log('MongoDB initialization completed successfully');

// Create test users for development
console.log('\n--- Creating test users ---');

// Generate bcrypt hashed password for "mySecurePassword123!" (strength factor 12)
// Hash: $2b$12$F6ULjPFB1A4tRRScqIsWdu1bhTCd1D9Ikb0UvTBoF.CL8wEFyE7xm
const hashedPassword = '$2b$12$F6ULjPFB1A4tRRScqIsWdu1bhTCd1D9Ikb0UvTBoF.CL8wEFyE7xm';

const testUsers = [
  {
    username: 'elyan_dev',
    email: 'elyan@dev.local',
    password: hashedPassword,
    bio: 'Development account for Elyan',
    elo: 1200,
  },
  {
    username: 'adrien_dev',
    email: 'adrien@dev.local',
    password: hashedPassword,
    bio: 'Development account for Adrien',
    elo: 1200,
  },
];

testUsers.forEach((user) => {
  const existingUser = db.users.findOne({ username: user.username });
  if (existingUser) {
    console.log(`User '${user.username}' already exists`);
  } else {
    db.users.insertOne(user);
    console.log(`User '${user.username}' created successfully (password: password)`);
  }
});
