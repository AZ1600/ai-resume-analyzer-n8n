"use strict";

const ROLE_PROFILES = {
  "aws-solutions-architect": {
    label: "AWS Solutions Architect",
    skills: [
      "AWS",
      "Terraform",
      "Docker",
      "Kubernetes",
      "Python",
      "Linux",
      "Networking",
      "CI/CD",
      "Security",
      "Monitoring",
    ],
  },
  "platform-engineer": {
    label: "Platform Engineer",
    skills: [
      "AWS",
      "Terraform",
      "Docker",
      "Kubernetes",
      "Python",
      "Linux",
      "CI/CD",
      "GitOps",
      "Security",
      "Monitoring",
    ],
  },
};

const SKILL_ALIASES = {
  AWS: ["aws", "amazon web services", "ec2", "lambda"],
  Terraform: ["terraform", "infrastructure as code", "iac"],
  Docker: ["docker", "containerisation", "containerization"],
  Kubernetes: ["kubernetes", "k8s", "eks"],
  Python: ["python", "boto3"],
  Linux: ["linux", "ubuntu", "rhel", "red hat"],
  Networking: ["networking", "vpc", "dns", "tcp/ip", "subnet"],
  "CI/CD": ["ci/cd", "continuous integration", "github actions", "jenkins", "gitlab ci"],
  GitOps: ["gitops", "argocd", "argo cd", "fluxcd", "flux cd"],
  Security: ["security", "iam", "devsecops", "least privilege"],
  Monitoring: ["monitoring", "observability", "prometheus", "grafana", "cloudwatch"],
};

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[–—]/gu, "-")
    .replace(/[^a-z0-9+#./-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function containsAlias(normalizedResume, alias) {
  const escaped = normalize(alias).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "u").test(normalizedResume);
}

function detectSkills(resumeText) {
  const normalizedResume = normalize(resumeText);

  return Object.entries(SKILL_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => containsAlias(normalizedResume, alias)))
    .map(([skill]) => skill);
}

function evidenceSegments(resumeText) {
  return String(resumeText ?? "")
    .split(/(?:\r?\n|(?<=[.!?])\s+)/u)
    .map((segment) => segment.replace(/^[•*\-\s]+/u, "").trim())
    .filter(Boolean);
}

function confidenceFor(segment) {
  const normalizedSegment = normalize(segment);
  const hasAction = /\b(built|created|designed|implemented|automated|deployed|managed|migrated|improved|reduced|secured|monitored|operated|led|configured)\b/u.test(normalizedSegment);
  const hasOutcome = /\b\d+(?:\.\d+)?\s*(?:%|x|hours?|minutes?|seconds?|users?|services?|clusters?|applications?)?\b/u.test(normalizedSegment);

  if (hasAction && hasOutcome) return "strong";
  if (hasAction) return "supported";
  return "mentioned";
}

function findSkillEvidence(resumeText, skill) {
  const segments = evidenceSegments(resumeText);
  const aliases = SKILL_ALIASES[skill] ?? [];
  const segment = segments.find((candidate) => {
    const normalizedCandidate = normalize(candidate);
    return aliases.some((alias) => containsAlias(normalizedCandidate, alias));
  });

  if (!segment) return null;

  const matchedAlias = aliases.find((alias) => containsAlias(normalize(segment), alias));
  return {
    skill,
    evidence: segment,
    confidence: confidenceFor(segment),
    matched_alias: matchedAlias,
  };
}

function analyzeResume(resumeText, roleId = "aws-solutions-architect") {
  const role = ROLE_PROFILES[roleId];

  if (!role) {
    throw new Error(`Unknown role profile: ${roleId}`);
  }

  const detectedSkills = detectSkills(resumeText);
  const matchedSkills = role.skills.filter((skill) => detectedSkills.includes(skill));
  const missingSkills = role.skills.filter((skill) => !detectedSkills.includes(skill));
  const skillEvidence = matchedSkills
    .map((skill) => findSkillEvidence(resumeText, skill))
    .filter(Boolean);

  return {
    target_role: role.label,
    detected_skills: detectedSkills,
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    skill_evidence: skillEvidence,
    readiness_score: Math.round((matchedSkills.length / role.skills.length) * 100),
    scoring_version: "2.0",
  };
}

const resumeScoring = {
  ROLE_PROFILES,
  SKILL_ALIASES,
  analyzeResume,
  detectSkills,
  findSkillEvidence,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = resumeScoring;
}

if (typeof window !== "undefined") {
  window.ResumeScoring = resumeScoring;
}
