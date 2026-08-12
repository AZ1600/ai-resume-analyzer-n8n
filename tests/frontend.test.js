"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const frontend = path.join(__dirname, "..", "frontend");

test("frontend exposes accessible analysis controls and result regions", () => {
  const html = fs.readFileSync(path.join(frontend, "index.html"), "utf8");

  assert.match(html, /id="analyzer-form"/u);
  assert.match(html, /id="target-role"/u);
  assert.match(html, /id="resume-text"/u);
  assert.match(html, /aria-live="polite"/u);
  assert.match(html, /No résumé stored/u);
});

test("frontend loads the shared scoring contract before its controller", () => {
  const html = fs.readFileSync(path.join(frontend, "index.html"), "utf8");
  const scoringIndex = html.indexOf("/resume-scoring.js");
  const appIndex = html.indexOf("/app.js");

  assert.ok(scoringIndex >= 0);
  assert.ok(appIndex > scoringIndex);
});
