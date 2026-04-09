require("dotenv").config();

const http = require("http");
const { Pool } = require("pg");
const { URL } = require("url");

const PORT = process.env.API_PORT || 3001;
const allowedOrigin = process.env.WEB_ORIGIN || "http://localhost:3000";
const dbUser = process.env.PGUSER || process.env.USER || "postgres";
const dbPassword =
  process.env.PGPASSWORD !== undefined
    ? process.env.PGPASSWORD
    : dbUser === "postgres"
      ? "postgres"
      : "";
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "two_tier_app",
  user: dbUser,
  password: dbPassword
});

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

async function fetchDashboard() {
  const client = await pool.connect();

  try {
    const settingsResult = await client.query(
      "SELECT key, value FROM app_settings WHERE key = ANY($1::text[])",
      [["title", "summary"]]
    );
    const tasksResult = await client.query(
      "SELECT id, title, status FROM tasks ORDER BY id ASC"
    );

    const settings = Object.fromEntries(
      settingsResult.rows.map((row) => [row.key, row.value])
    );

    return {
      title: settings.title || "Two-Tier Application",
      summary:
        settings.summary ||
        "A lightweight frontend communicating with a Node.js backend API.",
      stats: {
        tiers: 2,
        apiPort: Number(PORT),
        webPort: 3000
      },
      tasks: tasksResult.rows
    };
  } finally {
    client.release();
  }
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (req.method === "GET" && requestUrl.pathname === "/api/health") {
    try {
      await pool.query("SELECT 1");
      sendJson(res, 200, {
        ok: true,
        service: "backend",
        database: "postgresql",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      sendJson(res, 503, {
        ok: false,
        service: "backend",
        database: "postgresql",
        error: "Database unavailable"
      });
    }
    return;
  }

  if (req.method === "GET" && requestUrl.pathname === "/api/dashboard") {
    try {
      const dashboard = await fetchDashboard();
      sendJson(res, 200, dashboard);
    } catch (error) {
      sendJson(res, 503, {
        error: "Unable to load dashboard data from PostgreSQL."
      });
    }
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
