# AI Resume Analyzer with AWS Bedrock & n8n

## Overview

AI-powered resume analysis platform built using **n8n**, **AWS Bedrock**, and **Amazon Nova Pro**.

The solution analyzes candidate resumes against cloud and platform engineering role requirements, identifies skill gaps, calculates readiness scores, and generates personalized career development recommendations.

This project demonstrates practical implementation of AI workflow automation, prompt engineering, custom business logic, and AWS generative AI services within a low-code automation platform.

The public workflow export is a portable template: it contains no AWS access keys, n8n instance fingerprint, or reusable credential binding. Importers must select their own AWS credential inside n8n.

---

## Quick Start

Requirements:

* Docker with Docker Compose
* An AWS account with Amazon Bedrock model access
* An IAM principal allowed to invoke the selected Bedrock model

```bash
cp .env.example .env
docker compose up -d
```

Open `http://localhost:5678`, import `cloud-resume-analyzer-bedrock.json`, and attach your own AWS credential to the **AWS Bedrock Chat Model** node.

The included configuration is for local development only. If n8n is exposed publicly, use HTTPS, secure cookies, a strong n8n encryption key, authentication, and a correctly configured `WEBHOOK_URL`.

---

## Architecture

```text
Resume Data
      │
      ▼
n8n Workflow
      │
      ▼
Skill Extraction
      │
      ▼
Custom JavaScript Processing
      │
      ▼
Readiness Score Calculation
      │
      ▼
AWS Bedrock
(Amazon Nova Pro)
      │
      ▼
AI Skills Analysis
      │
      ▼
Career Recommendations
```

---

## Key Features

* AI-Powered Resume Analysis
* AWS Bedrock Integration
* Amazon Nova Pro Large Language Model
* Automated Skills Detection
* Skill Gap Analysis
* Readiness Score Calculation
* Career Development Recommendations
* Certification Recommendations
* Custom JavaScript Processing
* Workflow Automation with n8n

---

## Technologies Used

### AI & Automation

* n8n
* AWS Bedrock
* Amazon Nova Pro
* Prompt Engineering

### Cloud

* AWS
* AWS IAM
* AWS Bedrock

### Development

* JavaScript
* JSON
* Docker
* Docker Compose

---

## Screenshots

### Workflow Architecture

The AI Resume Analyzer workflow processes candidate skills, performs custom scoring logic, and uses AWS Bedrock with Amazon Nova Pro to generate career recommendations.

![Workflow Overview](docs/workflow-overview.png)

---

### AWS Bedrock AI Analysis

AI-powered skills analysis generated using AWS Bedrock and Amazon Nova Pro.

![AI Analysis](docs/ai-analysis.png)

---

### Custom Scoring Engine

Custom JavaScript logic calculates readiness scores and identifies skill gaps against target cloud and platform engineering roles.

![Scoring Engine](docs/scoring-engine.png)

---

### Workflow Execution

Successful workflow execution within n8n.

![Workflow Execution](docs/workflow-execution.png)

---

## Workflow Components

### Skill Extraction

Resume information is parsed and normalized into structured skill data.

### Custom Scoring Engine

JavaScript logic compares detected skills against target role requirements and calculates readiness scores.

Detection is case-insensitive and normalizes common aliases. Examples include `K8s` and `EKS` as Kubernetes, `GitHub Actions` and `Jenkins` as CI/CD, and `Prometheus`, `Grafana`, and `CloudWatch` as Monitoring. The readiness score is deterministic and based only on matched skills in the selected role profile.

Example target skills include:

* AWS
* Terraform
* Docker
* Kubernetes
* Python
* Linux
* Networking
* CI/CD
* Security
* Monitoring

### AWS Bedrock Analysis

Amazon Nova Pro performs:

* Skills assessment
* Gap identification
* Strength analysis
* Career guidance
* Certification recommendations

### Recommendation Engine

The workflow generates:

* Readiness scores
* Missing skill analysis
* Learning recommendations
* AWS certification guidance
* Career development plans

---

## Skills Demonstrated

### AI Engineering

* Generative AI Integration
* Prompt Engineering
* Large Language Model Workflows
* AI Automation

### Cloud Engineering

* AWS Bedrock
* IAM Configuration
* Cloud-Native Architecture

### Platform Engineering

* Workflow Automation
* Internal Tool Development
* Automation Design

### Software Development

* JavaScript
* Data Transformation
* Business Logic Automation

---

## Repository Structure

```text
.
├── docs
│   ├── ai-analysis.png
│   ├── scoring-engine.png
│   ├── workflow-execution.png
│   └── workflow-overview.png
├── cloud-resume-analyzer-bedrock.json
├── docker-compose.yml
├── .env.example
├── lib/resume-scoring.js
├── tests/resume-scoring.test.js
├── package.json
└── README.md
```

---

## Validation

Run the dependency-free scoring tests with:

```bash
npm test
```

The tests cover capitalization, common platform-engineering aliases, complete role matching, and invalid role profiles.

---

## Future Enhancements

* PDF Resume Upload
* Web Application Frontend
* Candidate Dashboard
* Recruiter Reporting
* Multi-Model AI Support
* Automated Learning Plans
* Interview Preparation Guidance
* Skills Trend Analytics

---

## Author

**Olawale Azeez**

Cloud Engineer | Platform Engineer | DevOps Engineer

Focused on cloud-native platforms, platform engineering, AI automation, Kubernetes, Infrastructure as Code, and AWS solutions architecture.

GitHub: https://github.com/AZ1600

LinkedIn: https://www.linkedin.com/in/olawale-azeez-40a891382/
