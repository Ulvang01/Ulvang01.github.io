// Patches experience/config.js for production before gh-pages deployment.
// Run by the GitHub Actions workflow — never commit the patched file.
//
// Changes applied:
//   ENV                  → 'production'  (disables debug overlay)
//   CAMERA_PADDING       → 0             (no inset — camera fills the screen)
//   CAMERA_COLLIDER_INSET → 0            (camera can reach the world edge)

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const target = resolve(__dir, "../experience/config.js");

let src = readFileSync(target, "utf8");

const patches = [
    [/ENV:\s*"development"/, 'ENV: "production"'],
    [/DEBUG:\s*true/, "DEBUG: false"],
    [/CAMERA_PADDING:\s*\d+/, "CAMERA_PADDING: 0"],
    [/CAMERA_COLLIDER_INSET:\s*\d+/, "CAMERA_COLLIDER_INSET: 0"],
];

for (const [pattern, replacement] of patches) {
    const next = src.replace(pattern, replacement);
    if (next === src) {
        console.error(`[patch-prod] WARNING: pattern not found → ${pattern}`);
    } else {
        console.log(`[patch-prod] ${pattern} → ${replacement}`);
    }
    src = next;
}

writeFileSync(target, src, "utf8");
console.log("[patch-prod] Done.");
