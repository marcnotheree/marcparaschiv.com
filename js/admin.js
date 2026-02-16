function qs(id) { return document.getElementById(id); }

async function uploadFiles() {
  const pass = qs("password").value.trim();
  const category = qs("category").value;
  const input = qs("files");
  const box = qs("status");
  box.textContent = "";

  if (!pass) {
    box.textContent = "Missing password";
    return;
  }
  if (!input.files || input.files.length === 0) {
    box.textContent = "Select at least one image";
    return;
  }

  qs("upload").disabled = true;
  try {
    for (const file of input.files) {
      const name = encodeURIComponent(file.name);
      const ct = encodeURIComponent(file.type || "application/octet-stream");
      const alt = encodeURIComponent(category);
      const url = `/api/upload?filename=${name}&contentType=${ct}&alt=${alt}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Authorization": "Bearer " + pass },
        body: file
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        box.textContent += `\n${file.name} -> failed ${res.status} ${t}`;
        continue;
      }
      const data = await res.json();
      box.textContent += `\n${file.name} -> ${data.url}`;
    }
    box.textContent += "\nDone. Refresh the gallery page to see new images.";
  } catch (e) {
    box.textContent += "\nUnexpected error";
  } finally {
    qs("upload").disabled = false;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  qs("upload").addEventListener("click", uploadFiles);
});
