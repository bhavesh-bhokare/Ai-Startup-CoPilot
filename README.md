# AI Startup Co-Pilot

> **Your AI co-pilot for smarter startup decisions.**

AI Startup Co-Pilot is an AI-powered startup idea evaluation platform designed to help aspiring founders analyze their ideas, identify potential risks, and make more informed early-stage decisions.

The project is being developed in phases, beginning with a Gemini-powered validation workflow and a secure web application. Future phases will focus on evidence retrieval, an Evidence Engine, and machine-learning-based viability prediction.

## 🎯 Problem Statement

Many aspiring founders begin building products before validating their assumptions. They may struggle to understand their target customers, assess competition, identify risks, and determine what to validate first.

AI Startup Co-Pilot aims to organize startup idea evaluation into a structured process that helps founders understand potential strengths, weaknesses, and next steps.

## 💡 Proposed Solution

Users submit a startup idea and receive a structured AI-generated assessment intended to support early-stage decision-making.

The platform is designed to help users explore:

- Customer problems and target users
- Market opportunity and competition
- Business model considerations
- Potential risks and opportunities
- Suggestions and practical next steps

**Important:** The assessment is decision support, not a guarantee of market demand or startup success. AI-generated conclusions should be validated with reliable evidence and real customer feedback.

## ✨ Phase 1 — Current Foundation

The first phase focuses on building the core web application and AI-powered evaluation workflow.

- **Startup idea evaluation:** Gemini-powered analysis of submitted ideas.
- **Structured results:** Organizes assessment output into a defined response format.
- **Authentication:** Firebase Authentication integration.
- **Protected application:** Authentication checks for protected functionality.
- **Dashboard and results pages:** User interface for accessing the application and evaluation results.
- **Backend API routes:** Validation, history, and analytics endpoints.
- **Validation roadmap:** A dedicated route for the roadmap experience.
- **TypeScript-based application:** Typed components and application logic.

The availability and completeness of individual features may depend on the current development state and configuration.

## ⚙️ How It Works

```text
User
  |
  v
Enter Startup Idea
  |
  v
Authenticated Application
  |
  v
Gemini-Powered Analysis
  |
  v
Structured Evaluation
  |
  v
Results and Recommendations
  |
  v
Founder Reviews and Validates Assumptions
```

Phase 1 establishes the core workflow. Evidence-backed retrieval and a separately developed ML prediction model are planned for a future phase.

## 🧰 Technology Stack

| Area | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| AI integration | Google Gemini API using `@google/genai` |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Backend | Next.js App Router API routes |
| Development | Node.js, npm, Visual Studio Code |
| Version control | Git and GitHub |

## 🗂️ Project Structure

```text
AI-Startup-CoPilot/
├── app/
│   ├── api/
│   │   ├── analytics/
│   │   ├── history/
│   │   └── validate/
│   ├── auth/
│   ├── dashboard/
│   ├── results/
│   ├── validation-Roadmap/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── AuthGuard.tsx
├── lib/
│   ├── api.ts
│   ├── auth-server.ts
│   ├── firebase-admin.ts
│   ├── firebase.ts
│   └── rate-limit.ts
├── public/
├── firestore.rules
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Git
- A Google Gemini API key
- A Firebase project configured for the application

### 1. Clone the repository

```bash
git clone https://github.com/bhavesh-bhokare/Ai-Startup-CoPilot.git
cd Ai-Startup-CoPilot
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a local `.env.local` file in the project root and configure the environment variables required by the application.

At minimum, the application uses `GEMINI_API_KEY` for Gemini integration. Firebase client and server configuration values may also be required.

Refer to the environment-variable names used in the source code. **Never commit API keys, private service-account credentials, or `.env.local` to GitHub.**

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
```

A successful build checks whether the application can compile for production; it does not by itself confirm that every external service or feature works correctly.

## 🔐 Security Considerations

- Keep API keys and service-account credentials out of version control.
- Configure Firebase Authentication and Firestore rules appropriately.
- Enforce user-level data access restrictions on the server.
- Review dependency vulnerabilities and keep packages updated.
- Test protected API routes and failure scenarios before deployment.

## 🛣️ Phase 2 — Planned Research and Development

The next phase aims to strengthen the platform beyond general-purpose generative AI.

### 1. Retrieval-Augmented Generation (RAG)

Retrieve relevant information from selected sources to provide contextual evidence for startup evaluations.

### 2. Evidence Engine

Develop a pipeline to retrieve, clean, deduplicate, rank, and assess evidence quality, recency, contradictions, and confidence.

### 3. Machine-Learning Viability Prediction

Develop and evaluate a separate ML model for startup viability-related predictions, using a defined dataset, appropriate features, and suitable evaluation metrics.

### 4. Evidence-Backed Decision Support

Combine retrieved evidence, model outputs, and Gemini-generated explanations to support more transparent and informed decisions.

These capabilities are planned and should not be considered implemented until they have been developed and tested.

## 🔭 Long-Term Vision

The long-term goal is to evolve the application into a founder workspace that supports a repeatable decision-making cycle:

**Idea → Evidence → Experiment → Learning → Decision**

The aim is to help founders decide whether to build, validate further, iterate, or reconsider an idea based on available evidence and observed results.

## 👨‍💻 Author

**Bhavesh Bhokare**

B.Tech — Artificial Intelligence and Machine Learning

Project: AI Startup Co-Pilot

## 📌 Project Status

**Status:** Active development — Phase 1 foundation.

AI Startup Co-Pilot is an academic AI/ML project being developed iteratively. Features and capabilities will expand as subsequent phases are implemented and evaluated.
