<div align="center">

#  FixFlow AI

<img src="https://img.shields.io/badge/status-active-00ff88?style=for-the-badge&labelColor=0d1117" />
<img src="https://img.shields.io/badge/built_with-TypeScript-3178c6?style=for-the-badge&logo=typescript&labelColor=0d1117" />
<img src="https://img.shields.io/badge/runtime-Node.js_v18+-339933?style=for-the-badge&logo=nodedotjs&labelColor=0d1117" />
<img src="https://img.shields.io/badge/AI-Powered-ff6b35?style=for-the-badge&labelColor=0d1117" />

### *Detect. Triage. Remediate. Repeat.*

**Autonomous DevOps incident response that kills downtime before your PagerDuty even wakes up.**

[Get Started](#-getting-started) · [Architecture](#️-architecture) · [Roadmap](#-roadmap) · [Contact](#-contact)

---

</div>

## The Problem

Your system breaks at 3AM. An alert fires. An on-call engineer wakes up, SSH's in, reads logs, digs through runbooks, and runs a recovery script — all while your users are screaming. That entire loop? **FixFlow eliminates it.**

FixFlow AI ingests live logs, classifies incidents with AI-native intelligence, and autonomously triggers the right remediation pipeline — cutting MTTR from *minutes* down to *seconds*.

---

##  Core Features

###  Zero-Latency Log Ingestion
Push-based webhook architecture means logs arrive the moment they're emitted — no polling, no lag, no excuses. Every event is captured, timestamped, and queued for analysis in real time.

###  AI-Native Incident Triage
A three-tier classification engine that thinks like a senior SRE:

| Severity | Signal | Autonomous Action |
|----------|--------|-------------------|
| 🔴 **Critical** | Infrastructure failure, crash loops, data corruption | Emergency rollback + service restart |
| 🟡 **Medium** | Performance degradation, elevated error rates, timeouts | Alert routing + diagnostic snapshot |
| 🟢 **Low** | Minor anomalies, soft warnings, edge-case noise | Logged + queued for optimization |

###  Autonomous Remediation Engine
No runbooks needed. FixFlow integrates directly into your CI/CD pipeline and fires pre-defined recovery scripts the instant a diagnosis is confirmed — no human in the loop required.

###  Observability Dashboard
A TypeScript-native interface to track:
- **Incident trends** over time
- **AI confidence scores** per diagnosis
- **Remediation outcomes** and MTTR history
- **Pipeline health** at a glance

---

##  Architecture

<img width="1276" height="741" alt="Screenshot from 2026-05-04 21-12-51" src="https://github.com/user-attachments/assets/2722997c-da8b-468e-957d-e239ab0487fd" />



```
┌─────────────────────────────────────────────────────────┐
│                     EXTERNAL SOURCES                     │
│    GitHub Actions · Sentry · Custom App Logs · APMs      │
└───────────────────────┬─────────────────────────────────┘
                        │  Webhook Push (Real-Time)
                        ▼
┌─────────────────────────────────────────────────────────┐
│               FIXFLOW INGESTION LAYER                    │
│       High-performance webhook receiver (Node.js)        │
│       Non-blocking event loop · Zero dropped events      │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│               AI TRIAGE ENGINE (TypeScript)              │
│     Classifies severity · Scores confidence · Routes     │
└──────────┬──────────────────────┬────────────────────────┘
           │                      │
           ▼                      ▼
┌─────────────────┐    ┌──────────────────────────────────┐
│  ALERT ROUTER   │    │     REMEDIATION PIPELINE         │
│ PagerDuty/Slack │    │  Rollback · Restart · Diagnose   │
└─────────────────┘    └──────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────┐
│            OBSERVABILITY DASHBOARD                       │
│       Incident trends · Confidence scores · MTTR         │
└─────────────────────────────────────────────────────────┘
```

**Stack:**
- **Runtime:** Node.js v18+ with TypeScript — type-safe, blazing-fast event loop
- **Transport:** Webhooks (push-based, not polling — because polling is tech debt)
- **Processing:** Event-driven, non-blocking I/O — analysis never blocks ingestion
- **Integration:** REST APIs + custom hooks for any DevOps stack

---

##  Getting Started

### Prerequisites

- Node.js `v18+`
- A webhook source (GitHub Actions, Sentry, Datadog, or custom)

### Installation

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/fixflow-ai.git
cd fixflow-ai
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure your environment**
```bash
cp .env.example .env
```

Open `.env` and drop in your credentials:
```env
AI_API_KEY=your_key_here
WEBHOOK_SECRET=your_webhook_secret
PIPELINE_ENDPOINT=https://your-ci-cd-hook.example.com
```

**4. Fire it up**
```bash
npm run start:dev
```

FixFlow is now listening. Point your webhook sources at the ingestion endpoint and watch incidents get handled automatically.

---

##  Webhook Integration

Send logs to FixFlow via a standard `POST` request:

```bash
curl -X POST https://your-fixflow-instance/ingest \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{
    "source": "production-api",
    "level": "error",
    "message": "Database connection pool exhausted",
    "timestamp": "2025-04-29T03:22:11Z",
    "metadata": { "service": "auth", "region": "us-east-1" }
  }'
```

FixFlow handles the rest.

---

##  Roadmap

| Status | Feature |
|--------|---------|
| 1 | Real-time webhook ingestion |
| 2 | AI-native 3-tier triage |
| 3 | Autonomous remediation pipelines |
| 4 | Observability dashboard |
| 5 | **Multi-Agent Orchestration** — a Supervisor Agent coordinating fixes across microservices |
| 6 | **Predictive Failure Analysis** — train on historical logs to catch fires before they start |
| 7 | **AST-Level Code Parsing** — correlate log errors directly to the code change that caused them |
| 8 | **Multi-cloud support** — AWS CloudWatch, GCP Logging, Azure Monitor |

---

## 🤝 Contact

Built by **Kritagya Jha** — Backend & Systems Engineer

[![GitHub](https://img.shields.io/badge/GitHub-Kritagya123611-181717?style=for-the-badge&logo=github)](https://github.com/Kritagya123611)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/kritagya-jha-260945319/)

---

<div align="center">

*If your incidents are still getting resolved by humans, you're doing DevOps wrong.*

**⭐ Star this repo if FixFlow saved your on-call rotation.**

</div>
