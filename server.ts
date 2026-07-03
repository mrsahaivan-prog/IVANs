import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "waitlist-db.json");

// Parse JSON bodies
app.use(express.json());

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Read database helper
function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file", err);
    return [];
  }
}

// Write database helper
function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// API Routes
app.get("/api/waitlist", (req, res) => {
  const list = readDb();
  res.json(list);
});

app.post("/api/waitlist", (req, res) => {
  const { email, whatsapp, country_code, country_name, source, created_at } = req.body;
  
  if (!email || !whatsapp) {
    return res.status(400).json({ error: "Email and whatsapp are required" });
  }

  const list = readDb();
  
  // Prevent duplicate registrations by email
  const isDuplicate = list.some((item: any) => item.email.toLowerCase() === email.trim().toLowerCase());
  
  const newEntry = {
    email: email.trim(),
    whatsapp: whatsapp.trim(),
    country_code: country_code || "",
    country_name: country_name || "",
    source: source || "general",
    created_at: created_at || new Date().toISOString()
  };

  if (!isDuplicate) {
    list.push(newEntry);
    writeDb(list);
  }
  
  res.json({ success: true, entry: newEntry, list });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
