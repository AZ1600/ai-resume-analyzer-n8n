"use strict";

const sampleResume = `Cloud and Platform Engineer with experience designing AWS infrastructure using Terraform and Infrastructure as Code. Built Docker containers and Kubernetes workloads on Amazon EKS. Automated CI/CD pipelines with GitHub Actions and implemented GitOps delivery with Argo CD. Created Python and Linux automation, applied IAM least-privilege controls, and monitored services with Prometheus, Grafana, and CloudWatch.`;

const form = document.querySelector("#analyzer-form");
const resumeText = document.querySelector("#resume-text");
const targetRole = document.querySelector("#target-role");
const sampleButton = document.querySelector("#sample-button");
const characterCount = document.querySelector("#character-count");
const formError = document.querySelector("#form-error");
const resumeFile = document.querySelector("#resume-file");
const fileStatus = document.querySelector("#file-status");
const clearButton = document.querySelector("#clear-button");

function setCharacterCount() {
  characterCount.textContent = `${resumeText.value.length} characters`;
}

function renderTags(containerId, skills, variant) {
  const container = document.querySelector(containerId);
  container.replaceChildren(
    ...skills.map((skill) => {
      const tag = document.createElement("span");
      tag.className = `skill-tag ${variant}`;
      tag.textContent = skill;
      return tag;
    }),
  );
}

function renderEvidence(items) {
  const container = document.querySelector("#skill-evidence");
  container.replaceChildren(
    ...items.map((item) => {
      const row = document.createElement("div");
      row.className = "evidence-row";
      const heading = document.createElement("div");
      const skill = document.createElement("strong");
      skill.textContent = item.skill;
      const confidence = document.createElement("span");
      confidence.className = `confidence ${item.confidence}`;
      confidence.textContent = item.confidence;
      heading.append(skill, confidence);
      const quote = document.createElement("p");
      quote.textContent = item.evidence;
      row.append(heading, quote);
      return row;
    }),
  );
}

function scoreMessage(score) {
  if (score >= 80) return "Strong evidence for this role. Focus on depth, outcomes, and interview examples.";
  if (score >= 60) return "A credible foundation with a small number of important gaps to close.";
  if (score >= 40) return "Relevant experience is visible, but the résumé needs broader role evidence.";
  return "Early alignment. Build focused projects that demonstrate the missing fundamentals.";
}

function nextStep(result) {
  const firstGap = result.missing_skills[0];
  if (!firstGap) {
    return {
      title: "Turn skills into measurable stories",
      copy: "Your required skills are present. Add scale, reliability, cost, and business-impact outcomes to make the evidence stronger.",
    };
  }
  return {
    title: `Build evidence for ${firstGap}`,
    copy: `Create one practical project using ${firstGap}, document the architecture and trade-offs, then add the measurable outcome to your résumé.`,
  };
}

function renderResult(result) {
  document.querySelector("#empty-state").hidden = true;
  document.querySelector("#results").hidden = false;
  document.querySelector("#score-value").textContent = `${result.readiness_score}%`;
  document.querySelector("#score-ring").style.setProperty("--score", result.readiness_score);
  document.querySelector("#result-role").textContent = result.target_role;
  document.querySelector("#score-summary").textContent = scoreMessage(result.readiness_score);
  document.querySelector("#matched-count").textContent = result.matched_skills.length;
  document.querySelector("#missing-count").textContent = result.missing_skills.length;
  renderTags("#matched-skills", result.matched_skills, "matched");
  renderTags("#missing-skills", result.missing_skills, "missing");
  renderEvidence(result.skill_evidence);

  const recommendation = nextStep(result);
  document.querySelector("#next-step-title").textContent = recommendation.title;
  document.querySelector("#next-step-copy").textContent = recommendation.copy;
}

resumeText.addEventListener("input", setCharacterCount);
resumeFile.addEventListener("change", async () => {
  const file = resumeFile.files[0];
  if (!file) return;
  fileStatus.textContent = `Reading ${file.name}…`;
  formError.textContent = "";
  try {
    const text = (await window.ResumeFileExtraction.extractResumeFile(file)).trim();
    if (text.length < 40) throw new Error("Very little text was found. This may be a scanned PDF; paste its text instead.");
    resumeText.value = text;
    setCharacterCount();
    fileStatus.textContent = `${file.name} · ${text.length.toLocaleString()} characters extracted`;
  } catch (error) {
    fileStatus.textContent = "File could not be read";
    formError.textContent = error.message;
  }
});

clearButton.addEventListener("click", () => {
  form.reset();
  resumeText.value = "";
  fileStatus.textContent = "Choose a file · processed in your browser";
  document.querySelector("#results").hidden = true;
  document.querySelector("#empty-state").hidden = false;
  formError.textContent = "";
  setCharacterCount();
});
sampleButton.addEventListener("click", () => {
  resumeText.value = sampleResume;
  setCharacterCount();
  formError.textContent = "";
  resumeText.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = resumeText.value.trim();
  if (text.length < 40) {
    formError.textContent = "Add at least 40 characters of résumé evidence before analyzing.";
    return;
  }

  formError.textContent = "";
  renderResult(window.ResumeScoring.analyzeResume(text, targetRole.value));
});
