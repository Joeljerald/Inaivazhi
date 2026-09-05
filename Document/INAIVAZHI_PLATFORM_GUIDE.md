# 🚀 Inaivazhi — Platform Guide & Hackathon Documentation

Welcome to **Inaivazhi**, an Employee & Student Skill Gap Intelligence Platform designed to bridge the gap between academic/training curricula and real-world placement requirements.

---

## 🔑 Demo Access Credentials (Usernames & Passwords)

Use these pre-seeded accounts to explore all 4 distinct role perspectives. You can also use the **1-Click Role Switcher** on the `/login` screen to instantly populate these credentials.

| Role | Username / Email | Password | Track / Department | Primary Access / Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| 🎓 **Student** | `arun@skillbridge.com` | `Arun@123` | Full Stack Engineering | View personal skill gap radar, benchmark matching, learning path, placement readiness score |
| 👨‍🏫 **Trainer (MERN)** | `trainer.mern@skillbridge.com` | `Trainer@123` | Full Stack Software Engineering | Batch skill progress, low-readiness student alerts, candidate finder |
| 👨‍🏫 **Trainer (Java)** | `trainer.java@skillbridge.com` | `Trainer@123` | Java Full Stack | Java track batch skill analytics & curriculum alignment |
| 👨‍🏫 **Trainer (Python)** | `trainer.python@skillbridge.com` | `Trainer@123` | Python Development | Python/Django track skill gap monitoring |
| 👨‍🏫 **Trainer (Data Science)**| `trainer.datascience@skillbridge.com` | `Trainer@123` | Data Science & AI | ML/AI track student performance & assessment tracking |
| 👨‍🏫 **Trainer (Data Analyst)**| `trainer.dataanalyst@skillbridge.com` | `Trainer@123` | Business Analytics | Analytics & BI tool skill coverage |
| 💼 **Placement Officer**| `placement@skillbridge.com` | `Placement@123` | Career & Placement Cell | Post active job openings, set skill weights, run candidate search, invite candidates |
| 🛡️ **Super Admin** | `admin@skillbridge.com` | `Admin@123` | Platform Administration | Full platform governance, user management, audit logs, system-wide analytics |

---

## 🌟 Core Platform Features & Architecture

### 1. Dual Light & Dark Theme System
* Built with dynamic semantic CSS variables (`--color-app-bg`, `--color-surface`, `--color-text-primary`, `--color-primary`).
* Supports smooth light/dark/system mode toggling from the top Navigation Bar.
* Designed with high contrast ratio standards to ensure crisp readability in all ambient lighting conditions.

### 2. Weighted Skill Gap Engine
The platform calculates readiness scores based on a multi-tier formula:
$$\text{Readiness Score (\%)} = \sum_{i=1}^{n} \left( \min\left(100, \frac{\text{Student Skill Level}_i}{\text{Required Skill Level}_i} \times 100\right) \times \text{Weight}_i \right)$$

* **Required Skills**: Set per job posting by Placement Officers or per course track by Trainers.
* **Skill Gap Identification**: Flagged whenever `Student Skill Level < Required Skill Level`.
* **Recommendation Output**: Generates personalized action plans, targeted learning modules, and projected readiness score increases.

---

## 👥 Role Workflows & Capabilities

### 🎓 1. Student Portal (`/student/dashboard`)
* **Skill Gap Radar**: Interactive visualization comparing current skills vs target job requirements.
* **Readiness Score Index**: Real-time percentage indicator (e.g., 78% Match for Full Stack Role).
* **Action Recommendations**: Step-by-step guidance on micro-skills needing improvement.
* **Target Role Switcher**: Allows students to simulate readiness against different job profiles.

### 👨‍🏫 2. Trainer Intelligence Portal (`/trainer/dashboard`)
* **Batch Analytics Overview**: Overview of enrolled students, average batch readiness score, and topic completion.
* **Skill Gap Heatmap**: Identifies batch-wide skill deficits.
* **Low-Readiness Alerts**: Highlights at-risk students who need intervention before placement drives.
* **Suitable Candidate Finder (`/trainer/most-suitable`)**: Allows trainers to search for top matching candidates for specific industry job openings.

### 💼 3. Placement Officer Portal (`/placement/dashboard`)
* **Placement Velocity KPI Cards**: Active jobs, Total Candidates, Placed Students, Average Package statistics.
* **Job Posting & Skill Weighting**: Define required skills and custom importance weights for each tech stack.
* **Candidate Search & Filtering (`/placement/most-suitable`)**: Filter candidates by match percentage (e.g., >80% Match), tech stack, and batch.
* **Direct Invitation Flow**: Send interview invites directly to eligible students based on match calculations.

### 🛡️ 4. Super Admin Command Center (`/admin/dashboard`)
* **Global Ecosystem Governance**: Monitor total users across all 4 roles.
* **User Management**: Add, edit, approve, or reassign user roles.
* **System Audit & Analytics**: Platform usage trends, placement conversion rates, and algorithm performance metrics.
* **Candidate & Trainer Search**: Cross-role candidate search across all departments and batches.

---

## 🛠️ Technical Stack

* **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons, Recharts.
* **Backend**: Node.js, Express.js, MongoDB (Mongoose ORM).
* **Authentication**: JWT (JSON Web Tokens) with HTTP-only storage and Role-Based Access Control (RBAC).

---
*Created for Inaivazhi — Winning Hackathon Solution.*
