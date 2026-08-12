"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { analyzeResume, detectSkills, findSkillEvidence } = require("../lib/resume-scoring");

test("detects skills without depending on capitalization", () => {
  assert.deepEqual(detectSkills("aws, TERRAFORM, Docker and python"), [
    "AWS",
    "Terraform",
    "Docker",
    "Python",
  ]);
});

test("maps common platform-engineering aliases to canonical skills", () => {
  assert.deepEqual(
    detectSkills("Built EKS platforms with GitHub Actions, Argo CD, Prometheus and IAM."),
    ["Kubernetes", "CI/CD", "GitOps", "Security", "Monitoring"],
  );
});

test("calculates readiness only from skills required by the selected role", () => {
  const result = analyzeResume(
    "AWS Terraform Docker Kubernetes Python Linux networking CI/CD security monitoring",
  );

  assert.equal(result.readiness_score, 100);
  assert.deepEqual(result.missing_skills, []);
  assert.equal(result.scoring_version, "2.0");
});

test("rejects unknown role profiles", () => {
  assert.throws(() => analyzeResume("AWS", "unknown-role"), /Unknown role profile/u);
});

test("returns the exact source sentence and a bounded evidence label", () => {
  const evidence = findSkillEvidence(
    "Built Terraform modules that reduced environment setup time by 40%.",
    "Terraform",
  );

  assert.deepEqual(evidence, {
    skill: "Terraform",
    evidence: "Built Terraform modules that reduced environment setup time by 40%.",
    confidence: "strong",
    matched_alias: "terraform",
  });
});

test("distinguishes a keyword mention from supported experience", () => {
  assert.equal(findSkillEvidence("Skills: Docker.", "Docker").confidence, "mentioned");
  assert.equal(findSkillEvidence("Deployed Docker services to production.", "Docker").confidence, "supported");
});
