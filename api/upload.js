const { put } = require("@vercel/blob");

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

function badRequest(res, msg) {
  res.statusCode = 400;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: msg || "bad_request" }));
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_.-]/gi, "_");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end("Method Not Allowed");
    return;
  }

  const authHeader = req.headers["authorization"] || "";
  let ok = false;
  const expectedUser = process.env.ADMIN_USERNAME || "";
  const expectedPass = process.env.ADMIN_PASSWORD || "";
  const basic = parseBasicAuth(authHeader);
  if (basic && basic.user === expectedUser && basic.pass === expectedPass) ok = true;
  if (!ok && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (token && token === expectedPass) ok = true;
  }
  if (!ok) return unauthorized(res);

  const url = new URL(req.url, "http://localhost");
  const filename = url.searchParams.get("filename");
  const contentType = url.searchParams.get("contentType") || "application/octet-stream";
  const alt = url.searchParams.get("alt") || "portfolio";

  if (!filename) {
    badRequest(res, "filename_required");
    return;
  }

  const base = sanitizeFilename(filename);
  const now = new Date().toISOString().replace(/[:.]/g, "-");
  const path = `portfolio/${now}__alt-${sanitizeFilename(alt)}__${base}`;

  try {
    const blob = await put(path, req, {
      access: "public",
      contentType,
      addRandomSuffix: true
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ url: blob.url, pathname: blob.pathname }));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "upload_failed" }));
  }
};
