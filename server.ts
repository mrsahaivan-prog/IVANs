import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "waitlist-db.json");

// Parse JSON bodies
app.use(express.json());

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Read local database
function readLocalDb() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file", err);
    return [];
  }
}

// Write local database
function writeLocalDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// Helper to get Supabase connection info
function getSupabaseConfig() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    return null;
  }
  
  let cleanUrl = url.trim();
  if (cleanUrl.endsWith('/')) {
    cleanUrl = cleanUrl.slice(0, -1);
  }
  
  const endpoint = cleanUrl.includes('/rest/v1')
    ? `${cleanUrl}/waitlist`
    : `${cleanUrl}/rest/v1/waitlist`;
    
  return { endpoint, anonKey };
}

// API Routes

// 1. Get entire waitlist
app.get("/api/waitlist", async (req, res) => {
  const localList = readLocalDb();
  const supabase = getSupabaseConfig();
  
  if (!supabase) {
    console.log("Supabase not configured. Returning local waitlist size:", localList.length);
    return res.json(localList);
  }
  
  try {
    console.log("Fetching waitlist from Supabase...");
    const response = await fetch(`${supabase.endpoint}?order=created_at.asc`, {
      method: "GET",
      headers: {
        "apikey": supabase.anonKey,
        "Authorization": `Bearer ${supabase.anonKey}`,
        "Accept": "application/json"
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        console.log(`Successfully fetched ${data.length} records from Supabase.`);
        
        // Sync to local database as backup
        const merged = [...localList];
        let changed = false;
        
        data.forEach((item: any) => {
          const exists = merged.some((m: any) => m.email.toLowerCase() === item.email.toLowerCase());
          if (!exists) {
            merged.push({
              email: item.email,
              whatsapp: item.whatsapp,
              country_code: item.country_code || "",
              country_name: item.country_name || "",
              source: item.source || "general",
              created_at: item.created_at || new Date().toISOString()
            });
            changed = true;
          }
        });
        
        if (changed) {
          writeLocalDb(merged);
        }
        
        return res.json(data);
      }
    } else {
      console.warn("Supabase returned error status:", response.status);
    }
  } catch (err) {
    console.error("Error connecting to Supabase, falling back to local database:", err);
  }
  
  res.json(localList);
});

// 2. Submit to waitlist
app.post("/api/waitlist", async (req, res) => {
  const { email, whatsapp, country_code, country_name, source, created_at } = req.body;
  
  if (!email || !whatsapp) {
    return res.status(400).json({ error: "Email and whatsapp are required" });
  }

  const list = readLocalDb();
  
  // Prevent duplicate registrations in local database
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
    writeLocalDb(list);
    console.log(`Added email ${email} to local waitlist. Total count: ${list.length}`);
  } else {
    console.log(`Email ${email} is already in local waitlist.`);
  }
  
  // Save to Supabase
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      console.log(`Checking if email ${email} exists in Supabase...`);
      const checkResp = await fetch(`${supabase.endpoint}?email=eq.${encodeURIComponent(email.trim())}`, {
        method: "GET",
        headers: {
          "apikey": supabase.anonKey,
          "Authorization": `Bearer ${supabase.anonKey}`,
          "Accept": "application/json"
        }
      });
      
      let alreadyInSupabase = false;
      if (checkResp.ok) {
        const checkData = await checkResp.json();
        if (Array.isArray(checkData) && checkData.length > 0) {
          alreadyInSupabase = true;
          console.log(`Email ${email} already exists in Supabase.`);
        }
      }
      
      if (!alreadyInSupabase) {
        console.log(`Inserting email ${email} into Supabase...`);
        const insertResp = await fetch(supabase.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabase.anonKey,
            "Authorization": `Bearer ${supabase.anonKey}`,
            "Prefer": "return=representation"
          },
          body: JSON.stringify(newEntry)
        });
        
        if (insertResp.ok) {
          console.log(`Successfully saved email ${email} to Supabase.`);
        } else {
          console.warn("Failed to insert into Supabase:", await insertResp.text());
        }
      }
    } catch (err) {
      console.error("Error interacting with Supabase on insert:", err);
    }
  }

  // Retrieve the latest full list to return
  let latestList = list;
  if (supabase) {
    try {
      const response = await fetch(`${supabase.endpoint}?order=created_at.asc`, {
        method: "GET",
        headers: {
          "apikey": supabase.anonKey,
          "Authorization": `Bearer ${supabase.anonKey}`,
          "Accept": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          latestList = data;
        }
      }
    } catch (err) {
      console.error("Error retrieving latest list from Supabase on post:", err);
    }
  }
  
  res.json({ success: true, entry: newEntry, list: latestList });
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
