const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from the same directory
dotenv.config({ path: path.join(__dirname, ".env") });

async function testConnection() {
  console.log("--- Turso Connection Diagnostic ---");
  
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log("URL:", url ? url.replace(/:[^:]*@/, ":***@") : "(not set)");
  console.log("Auth Token:", authToken ? "(set)" : "(not set)");

  if (!url) {
    console.error("❌ ERROR: TURSO_DATABASE_URL is missing.");
    console.log("Please create a .env file in the server directory with your credentials.");
    return;
  }

  if (url.startsWith("file:")) {
    console.warn("⚠️  WARNING: Using local file database. This will NOT work on Vercel/Production.");
  }

  try {
    const client = createClient({
      url,
      authToken,
    });

    console.log("Attempting to connect...");
    const start = Date.now();
    await client.execute("SELECT 1");
    console.log(`✅ Connection successful! (Took ${Date.now() - start}ms)`);

    console.log("Checking for tables...");
    const tables = await client.execute("SELECT name FROM sqlite_schema WHERE type='table'");
    const tableNames = tables.rows.map(r => r.name);
    console.log("Found tables:", tableNames.join(", "));

    const requiredTables = ["projects", "users", "profile", "skills"];
    const missing = requiredTables.filter(t => !tableNames.includes(t));

    if (missing.length > 0) {
      console.error(`❌ Missing tables: ${missing.join(", ")}`);
      console.log("Run 'npm run seed --prefix server' to create tables and seed data.");
    } else {
      console.log("✅ All required tables are present.");
    }

  } catch (err) {
    console.error("❌ Connection Failed:", err.message);
    if (err.cause) console.error("Cause:", err.cause);
  }
  console.log("-----------------------------------");
}

testConnection();
