import fs from "fs";

const KEY = "e4d7a90b1c2e4f88a9102b3c4d5e6f77";
const HOST = "vaich.ir";

// 1. Create IndexNow Key verification file in public
fs.writeFileSync(`public/${KEY}.txt`, KEY, "utf8");
console.log(`Created public/${KEY}.txt for IndexNow verification.`);

const urlList = [
  "https://vaich.ir/",
  "https://vaich.ir/products",
  "https://vaich.ir/products/vaich-life-planner",
  "https://vaich.ir/products/chatgpt-plus",
  "https://vaich.ir/products/claude",
  "https://vaich.ir/products/gemini-pro",
  "https://vaich.ir/products/gemini",
  "https://vaich.ir/checkout/vaich-life-planner",
  "https://vaich.ir/checkout/chatgpt-plus",
  "https://vaich.ir/checkout/claude",
  "https://vaich.ir/checkout/gemini-pro",
  "https://vaich.ir/checkout/gemini",
  "https://vaich.ir/blog",
  "https://vaich.ir/blog/flagship-ai-models-comparison",
  "https://vaich.ir/blog/ai-free-vs-plus-comparison",
  "https://vaich.ir/blog/how-google-sheets-planner-transforms-habits-goals",
  "https://vaich.ir/blog/gemini-2-million-context-window-big-data-analysis",
  "https://vaich.ir/blog/defeat-procrastination-google-sheets-planner",
  "https://vaich.ir/blog/best-study-planning-methods-digital-vs-paper",
  "https://vaich.ir/blog/daily-motivational-habits-powerful-routine",
  "https://vaich.ir/blog/habit-tracking-time-management-guide",
  "https://vaich.ir/blog/ai-tools-productivity-study-guide",
  "https://vaich.ir/why",
  "https://vaich.ir/faq",
  "https://vaich.ir/support",
  "https://vaich.ir/terms",
  "https://vaich.ir/privacy"
];

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urlList
};

async function main() {
  const results = [];

  // Submit to IndexNow API (Bing, Yandex, Naver, Seznam)
  const endpoints = [
    { name: "IndexNow (Universal)", url: "https://api.indexnow.org/indexnow" },
    { name: "Bing IndexNow", url: "https://www.bing.com/indexnow" },
    { name: "Yandex IndexNow", url: "https://yandex.com/indexnow" }
  ];

  for (const ep of endpoints) {
    try {
      console.log(`Submitting ${urlList.length} URLs to ${ep.name}...`);
      const res = await fetch(ep.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
      const text = await res.text().catch(() => "");
      console.log(`[${ep.name}] Status: ${res.status} (${res.statusText})`);
      results.push({ service: ep.name, status: res.status, ok: res.ok || res.status === 200 || res.status === 202, text });
    } catch (err) {
      console.error(`[${ep.name}] Error:`, err.message);
      results.push({ service: ep.name, ok: false, error: err.message });
    }
  }

  // Ping-o-Matic for RSS Syndication
  try {
    console.log("Pinging Ping-o-Matic for RSS Feed...");
    const pingParams = new URLSearchParams({
      title: "مجله تخصصی و مقالات آموزشی VAICH",
      blogurl: "https://vaich.ir/blog",
      rssurl: "https://vaich.ir/rss.xml",
      chk_weblogscom: "on",
      chk_blogs: "on",
      chk_feedburner: "on",
      chk_syndic8: "on",
      chk_newsgator: "on",
      chk_myyahoo: "on",
      chk_pubsubcom: "on",
      chk_blogdigger: "on"
    });
    const pingRes = await fetch(`https://pingomatic.com/ping/?${pingParams.toString()}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; VAICHPingBot/1.0; +https://vaich.ir)" }
    });
    console.log(`[Ping-o-Matic] Status: ${pingRes.status}`);
    results.push({ service: "Ping-o-Matic (Google/FeedBurner/Yahoo)", status: pingRes.status, ok: pingRes.ok });
  } catch (err) {
    console.error("[Ping-o-Matic] Error:", err.message);
    results.push({ service: "Ping-o-Matic", ok: false, error: err.message });
  }

  console.log("\n=== SUBMISSION SUMMARY ===");
  console.log(JSON.stringify(results, null, 2));
}

main();
