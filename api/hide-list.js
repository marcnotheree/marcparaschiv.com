const { list, put } = require("@vercel/blob");

const HIDDEN_PATH = "portfolio/_meta/hidden.json";

function parseBasicAuth(header) {
  if (!header || !header.startsWith("Basic ")) return null;
  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const idx = decoded.indexOf(":");
    if (idx === -1) return null;
    return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
  } catch {
    return null;
  }
}

function unauthorized(res) {
  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", 'Basic realm="admin"');
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "unauthorized" }));
}

async function readHidden() {
  const l = await list({ prefix: HIDDEN_PATH });
  const found = (l.blobs || []).find(b => b.pathname === HIDDEN_PATH);
  if (!found) return [];
  try {
    const r = await fetch(found.url);
    if (!r.ok) return [];
    const json = await r.json().catch(() => null);
    if (json && Array.isArray(json.items)) return json.items;
    if (Array.isArray(json)) return json;
    return [];
  } catch {
    return [];
  }
}

async function writeHidden(items) {
  const body = JSON.stringify({ items });
  await put(HIDDEN_PATH, body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true
  });
}

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const items = await readHidden();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ items }));
    } catch {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ items: [] }));
    }
    return;
  }

  if (req.method === "PUT") {
    const creds = parseBasicAuth(req.headers["authorization"]);
    const expectedUser = process.env.ADMIN_USERNAME || "";
    const expectedPass = process.env.ADMIN_PASSWORD || "";
    if (!creds || creds.user !== expectedUser || creds.pass !== expectedPass) {
      return unauthorized(res);
    }
    try {
      const raw = await new Promise((resolve, reject) => {
        let data = "";
        req.setEncoding("utf8");
        req.on("data", (c) => (data += c));
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });
      let payload = {};
      try { payload = JSON.parse(raw || "{}"); } catch { payload = {}; }
      const current = await readHidden();
      let next = current.slice();
      if (Array.isArray(payload.items)) {
        next = payload.items.filter(x => typeof x === "string");
      } else {
        if (Array.isArray(payload.add)) {
          for (const u of payload.add) {
            if (typeof u === "string" && !next.includes(u)) next.push(u);
          }
        }
        if (Array.isArray(payload.remove)) {
          next = next.filter(u => !payload.remove.includes(u));
        }
      }
      await writeHidden(next);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ items: next }));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "update_failed" }));
    }
    return;
  }

  res.statusCode = 405;
  res.setHeader("Allow", "GET, PUT");
  res.end("Method Not Allowed");
};
