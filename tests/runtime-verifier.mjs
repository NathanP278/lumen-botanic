import http from "node:http";

async function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      res.on("error", reject);
    });
  });
}

async function runTests() {
  console.log("=== LUMEN Botanic Runtime & DOM Test Suite ===");
  const results = [];

  try {
    const rootRes = await fetchUrl("/");
    if (rootRes.status === 200) {
      results.push({ test: "HTTP 200 Root Status", status: "PASS", detail: "Server alive" });
    } else {
      results.push({ test: "HTTP 200 Root Status", status: "FAIL", detail: `Status ${rootRes.status}` });
    }

    const body = rootRes.body;

    // Test 2: Brand Manifesto
    const expectedManifesto = [
      "LUMEN",
      "Botanic Atelier",
      "Haute Cold-Pressed",
      "15,000 lbs",
      "36°F",
      "Curate Your 6-Pack Ritual Box",
      "The Botanical Formulary",
      "Hydraulic Pressure Preserves",
      "Zero Water Dilution",
      "Biodynamic Terroir",
      "Recyclable Apothecary Glass"
    ];

    const missingManifesto = expectedManifesto.filter((s) => !body.includes(s));
    if (missingManifesto.length === 0) {
      results.push({ test: "Brand Manifesto & Philosophy DOM Render", status: "PASS", detail: "All 11 text anchors verified" });
    } else {
      results.push({ test: "Brand Manifesto", status: "FAIL", detail: `Missing: ${missingManifesto.join(", ")}` });
    }

    // Test 3: All 6 Formulations Present in HTML
    const juices = [
      "Chlorophyll Verdant",
      "Solar Curcumin Gold",
      "Blood Root Elixir",
      "Obsidian Purifier",
      "Shroom &amp; Matcha Zen", // HTML entity
      "Imperial Elderberry"
    ];
    const missingJuices = juices.filter((j) => !body.includes(j) && !body.includes(j.replace("&amp;", "&")));
    if (missingJuices.length === 0) {
      results.push({ test: "6-Elixir Formulation Renders", status: "PASS", detail: "All 6 cold-press recipes present" });
    } else {
      results.push({ test: "6-Elixir Formulation Renders", status: "FAIL", detail: `Missing: ${missingJuices.join(", ")}` });
    }

    // Test 4: Box Builder slots
    const hasSlots = [1, 2, 3, 4, 5, 6].every((n) => body.includes(`Slot 0${n}`) || body.includes(`Slot 0<!-- -->${n}`));
    if (hasSlots) {
      results.push({ test: "6-Pack Box Builder Slots (01-06)", status: "PASS", detail: "All 6 slots mounted in DOM" });
    } else {
      results.push({ test: "6-Pack Box Builder Slots", status: "FAIL", detail: "Slots incomplete" });
    }

    // Test 5: Categories in DOM
    const categories = ["Cleanse", "Detox", "Energy", "Immunity"];
    const hasCategories = categories.every((c) => body.includes(c));
    if (hasCategories) {
      results.push({ test: "Category Filter Badges", status: "PASS", detail: "Cleanse, Detox, Energy, Immunity present" });
    } else {
      results.push({ test: "Category Filter Badges", status: "FAIL", detail: "Categories incomplete" });
    }

    // Test 6: Script / JS Chunks integrity
    const hasNextScripts = body.includes("/_next/static/chunks/");
    if (hasNextScripts) {
      results.push({ test: "Next.js Static Hydration Assets", status: "PASS", detail: "Production JS chunks referenced" });
    } else {
      results.push({ test: "Next.js Static Hydration Assets", status: "FAIL", detail: "Chunks missing" });
    }

  } catch (err) {
    results.push({ test: "Network Error", status: "FAIL", detail: err.message });
  }

  console.table(results);
  const failures = results.filter((r) => r.status === "FAIL");
  if (failures.length > 0) {
    process.exit(1);
  } else {
    console.log("All 6 Runtime & DOM assertions PASSED!");
  }
}

runTests();
