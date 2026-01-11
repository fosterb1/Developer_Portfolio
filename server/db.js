const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const url = process.env.TURSO_DATABASE_URL || "file:./data/portfolio.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

const initSchema = async () => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      short_description TEXT,
      full_description TEXT,
      tech_stack TEXT,
      repo_url TEXT,
      live_url TEXT,
      images TEXT,
      published INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT,
      title TEXT,
      hero_bio TEXT,
      about_bio TEXT,
      profile_image TEXT,
      resume_url TEXT,
      email TEXT,
      linkedin TEXT,
      github TEXT,
      twitter TEXT,
      facebook TEXT,
      experience_years TEXT,
      education_summary TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      level TEXT NOT NULL,
      percentage INTEGER NOT NULL,
      category TEXT NOT NULL, 
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = { client, initSchema };