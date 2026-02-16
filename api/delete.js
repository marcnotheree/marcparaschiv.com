const { del } = require("@vercel/blob");

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

module.exports = async (req, res) => {
  if (req.method !== "DELETE") {
    res.statusCode = 405;
    res.setHeader("Allow", "DELETE");
    res.end("Method Not Allowed");
    return;
  }

  const creds = parseBasicAuth(req.headers["authorization"]);
  const expectedUser = process.env.ADMIN_USERNAME || "";
  const expectedPass = process.env.ADMIN_PASSWORD || "";
  if (!creds || creds.user !== expectedUser || creds.pass !== expectedPass) {
    unauthorized(res);
    return;
  }

  const url = new URL(req.url, "http://localhost");
  const pathname = url.searchParams.get("pathname");
  if (!pathname) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "pathname_required" }));
    return;
  }

  try {
    await del(pathname);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "delete_failed" }));
  }
};
