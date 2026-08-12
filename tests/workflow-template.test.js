"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const workflowPath = path.join(
  __dirname,
  "..",
  "cloud-resume-analyzer-bedrock.json",
);

test("workflow export is valid JSON and sanitized for public reuse", () => {
  const workflow = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
  const bedrockNode = workflow.nodes.find(
    (node) => node.name === "AWS Bedrock Chat Model",
  );

  assert.ok(bedrockNode);
  assert.deepEqual(bedrockNode.credentials, {});
  assert.equal(workflow.id, undefined);
  assert.equal(workflow.versionId, undefined);
  assert.equal(workflow.meta.instanceId, undefined);
  assert.equal(workflow.meta.templateCredsSetupCompleted, false);
});

test("workflow uses the versioned deterministic scoring contract", () => {
  const workflow = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
  const scoringNode = workflow.nodes.find(
    (node) => node.name === "Code in JavaScript2",
  );

  assert.match(scoringNode.parameters.jsCode, /matched_skills/u);
  assert.match(scoringNode.parameters.jsCode, /scoring_version: '2\.0'/u);
});
