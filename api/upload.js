const { put } = require("@vercel/blob");

function unauthorized(res) {
  res.statusCode = 401;
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

  const auth = req.headers["authorization"] || "";
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !auth.startsWith("Bearer ") || auth.slice(7) !== expected) {
    unauthorized(res);
    return;
  }

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
