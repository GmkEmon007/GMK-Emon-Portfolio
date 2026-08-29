# GMK Emon Portfolio - Visual Design & System Guidelines

## Core Philosophy: The Digital Workbench
The portfolio is designed not as a generic personal resume, but as an **Interactive Digital Workbench**. Every component represents an engineering surface, active project log, system capability, or client workspace.

```text
THE DIGITAL WORKBENCH
├── 01. ACTIVE WORKBENCH      → Live system state & query shell
├── 02. SYSTEM CAPABILITIES   → Web experiences, product systems & AI
├── 03. PRODUCTION ARCHIVES   → Outcome-first case studies (Problem → Strategy → Build → Result)
├── 04. CLIENT WORKSPACE      → Live staging pipeline & delivery milestones
└── 05. DIRECT ACCESS         → Scope booking & real-time availability
```

---

## 1. Visual Identity & Theme System

### Color Palette
* **Dark Mode (Default)**:
  * Primary Canvas: `#0c0e0d` (Zinc-black workbench surface)
  * Secondary Surface: `#121413` (Elevated console card)
  * Primary Accent: `#22c55e` (Neon mint / Emerald telemetry indicator)
  * Foreground Text: `#fafafa` (Crisp off-white)
  * Muted Foreground: `#a1a1aa` (Technical zinc gray)
* **Light Mode (Root-level `<html>` toggle)**:
  * Primary Canvas: `#fafafa`
  * Secondary Surface: `#ffffff`
  * Primary Accent: `#22c55e`
  * Foreground Text: `#18181b`
  * Muted Foreground: `#71717a`

### Surfaces & Grid Structure
* **Workbench Check Grid**: Background rendering styled at `96px` blocks (`.grid-lines-bg`) with radial dotted gradients resembling an engineering drafting board.
* **Translucent Surfaces**: `rgba(255, 255, 255, 0.02)` cards with `backdrop-filter: blur(20px)` and subtle `1px solid rgba(255, 255, 255, 0.05)` borders.
* **Corner Brackets**: `.corner-border tl/tr/bl/br` guides highlight active viewport frames and workbench terminals.

---

## 2. Typography & Hierarchy
* **Display & Headlines**: `Space Grotesk` (weights 700/600, tracking `-0.02em` to `-0.04em`) for positioning statements, outcome numbers, and section headers.
* **Body Copy**: `DM Sans` (weights 400/500, line-height 1.6) for problem statements, case study breakdowns, and client narrative.
* **Monospace Layer**: Monospace font (`ui-monospace`, `Menlo`, monospace) strictly reserved for **system metadata** (e.g., `STATUS: OPEN`, `BUILD_TIME: 14 DAYS`, `~/projects/featured`, terminal prompts), avoiding gimmicky overuse in narrative prose.

---

## 3. Motion & Animation Standards
* **Purpose-Driven Motion**: Animations must communicate status, cause/effect, or system behavior. Decorative motions without informational value are eliminated.
* **State Feedback**:
  * Shimmer keyframes indicate live processing telemetry and active builds.
  * Pulsing status dots denote real-time connectivity (`ready`, `LIVE`).
  * Smooth hash transitions switch SPA viewport layers without page flickers.
* **View Transitions**: Theme toggles animate using circular `document.startViewTransition` coordinate wipes.

---

## 4. Architectural Sections

### A. Hero Section (Positioning & Outcome)
* **Lead Message**: Outcome-first value proposition ("Turning slow, complex websites into high-converting digital experiences").
* **Sub-Pillars**: Clear domain tags (Web Experiences, Frontend Engineering, AI Solutions).
* **Visual Anchor**: Portrait card supporting personal credibility with technical framing and corner telemetry brackets.

### B. Interactive Portfolio Shell (`~/ask-emon.sh`)
* Purpose-built query console allowing visitors to inspect stack architectures, production timelines, availability, and engagement rates directly.
* Right-aligned visitor queries (`› you`), left-aligned structured responses (`› emon-bot`), and immediate preset diagnostic scripts.

### C. System Capabilities (Repositioned 3 Pillars)
* **01. Web Experiences**: WordPress custom builds, WooCommerce, Elementor Pro, and Core Web Vitals performance.
* **02. Product Systems**: React/Next.js architectures, REST APIs, interactive dashboards, and scalable UI systems.
* **03. AI Integration**: Local LLMs, RAG vector search, automated workflows, and intelligent site features.
* *(Graphic Design positioned as visual systems support rather than a primary developer pillar).*

### D. Production Archives (Outcome-Driven Case Studies)
* Structured project breakdowns highlighting:
  * **Problem**: What was failing or constrained.
  * **Strategy**: Architectural approach and decisions.
  * **Build**: Implemented technical solution.
  * **Result**: Measurable metric impact (speed, conversion, accuracy).

### E. Client Collaboration Portal (`#page-client-portal`)
* Interactive demonstration of Emon's collaboration workflow: sprint tracking, live staging credentials state, and deployment milestone checklists.
