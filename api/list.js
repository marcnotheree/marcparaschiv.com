const { list } = require("@vercel/blob");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end("Method Not Allowed");
    return;
  }

  try {
    const result = await list({ prefix: "portfolio/" });
    const items = (result.blobs || []).map((b) => {
      let alt = "portfolio";
      const m = b.pathname.match(/__alt-([^_]+)__/);
      if (m && m[1]) alt = m[1];
      return { url: b.url, alt, pathname: b.pathname };
    }).reverse();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ items }));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "list_failed" }));
  }
};
