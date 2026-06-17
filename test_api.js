const fetch = require('node-fetch'); // wait, node 18+ has fetch

async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/InternalPdcas/6a068f4f132065d27c2e87e6/step16", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: "Test Subject", date: "17 มิ.ย. 2567" })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (e) {
    console.error("Fetch failed:", e.message);
  }
}
test();
