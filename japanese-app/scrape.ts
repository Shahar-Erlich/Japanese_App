// import fs from "fs";
// import fetch from "node-fetch";
// import { JSDOM } from "jsdom";

// async function fetchWithRetry(url: string, retries = 15, delay = 4000): Promise<string> {
//     console.log("Scraper")
//     for (let attempt = 1; attempt <= retries; attempt++) {
//         try {
//             const res = await fetch(url);
//             if (!res.ok) throw new Error(`HTTP ${res.status}`);
//             const text = await res.text();

//             // sanity check: page should contain a <table>
//             if (!text.includes("<table")) throw new Error("No table found in HTML");

//             console.log(`✅ Success on attempt ${attempt}`);
//             return text;
//         } catch (err) {
//             console.warn(`⚠️ Attempt ${attempt} failed: ${(err as Error).message}`);
//             if (attempt < retries) {
//                 console.log(`🔄 Retrying in ${delay / 1000}s...`);
//                 await new Promise((r) => setTimeout(r, delay));
//             } else {
//                 throw new Error(`❌ Failed after ${retries} attempts: ${(err as Error).message}`);
//             }
//         }
//     }
//     throw new Error("Unexpected loop exit");
// }

// async function scrape() {
//     const allLessons: Record<number, any[]> = {};

//     for (let i = 1; i <= 23; i++) {
//         const url =
//             "https://api.allorigins.win/raw?url=" +
//             encodeURIComponent(
//                 `http://ohelo.org/japn/lang/genki_vocab_table.php?lesson=${i}`
//             );

//         console.log(`📖 Scraping lesson ${i}...`);

//         const html = await fetchWithRetry(url, 15, 4000); // retry up to 5 times
//         const dom = new JSDOM(html);
//         const doc = dom.window.document;

//         const rows = Array.from(doc.querySelectorAll("table tr")).slice(1);

//         const vocab = rows.map((row) => {
//             const cols = row.querySelectorAll("td");
//             if (i <= 2) {
//                 return {
//                     jp: cols[0]?.textContent?.trim() || "",
//                     kanji: cols[1]?.textContent?.trim() || "",
//                     romaji: cols[2]?.textContent?.trim() || "",
//                     eng: cols[3]?.textContent?.trim() || "",
//                 };
//             }
//             else {
//                 return {
//                     jp: cols[0]?.textContent?.trim() || "",
//                     kanji: cols[1]?.textContent?.trim() || "",
//                     eng: cols[2]?.textContent?.trim() || "",
//                 };
//             }
//         });

//         allLessons[i] = vocab;
//         console.log(`✅ Lesson ${i}: ${vocab.length} entries`);
//     }

//     fs.writeFileSync("glossaries.json", JSON.stringify(allLessons, null, 2), "utf-8");
//     console.log("🎉 Saved to glossaries.json");
// }

// scrape().catch((err) => console.error(err));
// apkg-to-json.ts
import fs from "fs";
import fetch from "node-fetch";
import Papa from "papaparse";

async function scrape() {
    const url =
        "https://docs.google.com/spreadsheets/d/1LvkY5vxgrt2rBTHXwHKPLZ3bbnEdedH-/export?format=csv&gid=1137479501";

    console.log("⬇️  Fetching CSV:", url);
    const res = await fetch(url);
    const csv = await res.text();

    console.log("🔎 Parsing CSV…");
    const parsed = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        beforeFirstChunk: (chunk) => {
            // Drop first 9 lines so row 10 becomes the header
            const lines = chunk.split(/\r?\n/);
            return lines.slice(9).join("\n");
        },
    });

    if (parsed.errors.length) {
        console.error("❌ Parse errors:", parsed.errors);
        return;
    }

    console.log("🧭 Headers found:", parsed.meta.fields);

    const data = parsed.data as any[];

    // Build JSON grouped by lesson
    const lessons: Record<string, any[]> = {};

    for (const row of data) {
        if (!row["課数"]) continue;

        // Extract lesson number (e.g., "会L3" → "3")
        const lessonMatch = row["課数"].match(/L(\d+)/);
        if (!lessonMatch) continue;
        const lesson = lessonMatch[1];

        if (!lessons[lesson]) lessons[lesson] = [];

        lessons[lesson].push({
            jp: row["単語"]?.trim() || "",
            kanji: row["漢字表記"]?.trim() || "",
            eng: row["英訳"]?.trim() || "",
        });
    }

    fs.writeFileSync("glossaries.json", JSON.stringify(lessons, null, 2), "utf-8");
    console.log("✅ Wrote glossaries.json with", Object.keys(lessons).length, "lessons");
}

scrape().catch(console.error);
