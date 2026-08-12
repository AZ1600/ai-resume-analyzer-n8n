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

test("frontend container copies assets instead of nesting read-only mounts", () => {
  const dockerfile = fs.readFileSync(path.join(frontend, "Dockerfile"), "utf8");
  const compose = fs.readFileSync(
    path.join(__dirname, "..", "docker-compose.yml"),
    "utf8",
  );

  assert.match(dockerfile, /COPY frontend\/ \/usr\/share\/nginx\/html\//u);
  assert.match(dockerfile, /COPY lib\/resume-scoring\.js/u);
  assert.doesNotMatch(compose, /\/usr\/share\/nginx\/html\/resume-scoring\.js:ro/u);
  assert.match(compose, /FRONTEND_PORT:-3001/u);
});
