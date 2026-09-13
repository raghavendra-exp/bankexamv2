# Indian Exam AI Prompt Generator

Live site: **https://raghavendra-exp.github.io/bankexamv2/**

A free collection of AI study-prompt generators for 20+ Indian competitive exams —
Banking, UPSC, SSC, Railway, GATE/PSU, NEET, JEE, CLAT/Law, MBA, Defence, CA/CS/CMA,
CUET, Judiciary, NET/JRF, PSC, Teaching, Agriculture, and more — plus an AI exam
mentor chatbot and a current-affairs / exam-news tracker.

## Key Interactive Features & Upgrades

- **🎯 Interactive Mock Test & Practice Simulator (`quiz-simulator.html`)**:
  - High-yield banking & aptitude questions covering Quantitative Aptitude, Logical Reasoning, English Language, and Banking / Financial Awareness.
  - Authentic 5-option Indian banking exam pattern ($A, B, C, D, E$).
  - Sectional countdown timers (20 mins per section) simulating SBI PO, IBPS PO, and RRB Prelims.
  - Step-by-step mathematical shortcut solutions, Vedic math tricks, and immediate score analytics.
- **✨ Live AI Study Prompt Studio Playground (`js/studio.js`)**:
  - Real-time interactive prompt builder embedded on the homepage.
  - Select Exam, Target Subject, Study Goal, and Model Persona to generate production-ready prompts on the fly.
  - 1-Click prompt copy and direct launch buttons for ChatGPT, Claude, and Gemini.
- **🔍 Universal Spotlight Search Omnibox (`Ctrl+K` / `⌘K`)**:
  - Instant fuzzy search across all 20+ prompt generator tools, 80+ exams, roadmaps, and mock practice tests.
- **🧮 Built-in Exam Calculator Modal**:
  - Animated on-screen calculator with keyboard input support, accessible from the top toolbar across pages.
- **🌙 Adaptive Dark / Light Theme**:
  - CSS custom properties with persistent `localStorage` (`be-theme`) remembering user preference.
- **📱 Mobile-First Navigation**:
  - Slide-out navigation drawer with $\ge 44	ext{px}$ touch targets and a persistent bottom navigation ribbon for mobile devices.

## What this actually is

This is a **static, zero-build, zero-dependency site**. There is no `npm install`,
no bundler, no framework, and no server. Every page is a single self-contained
`.html` file with its CSS and JavaScript inline, designed to run both when opened
directly from disk (`file://`) and when served from GitHub Pages.

That constraint is deliberate:

- **No CDN, no framework, no build step.** Nothing to install, nothing to compile,
  nothing that can go stale in `node_modules`.
- **No backend for the core tools.** Each exam page is a standalone prompt
  generator — pick your exam and topic, get a ready-to-paste prompt for any AI
  chatbot. All of that logic runs entirely client-side.
- **Firebase/Firestore is used only for two optional, non-critical features**:
  a lightweight visitor counter and a 3-day cached exam-news feed on the
  homepage, plus a private `admin.html` dashboard for viewing visit history.
  If Firestore is unreachable, both features fail silently and the rest of the
  site works normally.

## Repository layout

```
index.html                              Homepage — tool directory, live stats, AI Prompt Studio
quiz-simulator.html                     Interactive Mock Test & Practice Simulator (5-option, timer, shortcuts)
<exam>_exam_prompt_generator.html       One file per exam category (20 of these)
exam-mentor-chatbot.html                Local keyword-matching AI mentor chatbot (no API calls)
trend-analysis-generator.html           Exam trend/pattern analysis tool
IBPS_SBI_Clerk_Roadmap.html             Banking exam prep roadmap guide
IBPS_SBI_Free_Library.html              Free banking study resource library
js/nav.js                               Global nav: Spotlight search (Ctrl+K), Calculator modal, Dark mode, Drawer
js/quiz.js                              Mock test engine: 5-option questions, timer, scoring, step-by-step explanations
js/studio.js                            Live AI Prompt Studio playground with instant copy & AI platform launches
css/modern.css                          Dark/Light theme variables, spotlight modal, bottom ribbon, quiz cards
contact.html / privacy-policy.html      Support pages
admin.html                              Private analytics dashboard (Firebase Auth gated, noindex)
sitemap.xml / robots.txt                Search-engine discovery files
*.py, *.sh                              One-off maintenance scripts (GA ID injection, deploy helper)
```

Each exam page follows the same five-tab layout (Overview, Prompt Generator,
AI Mentor, Editorial/News, Videos) with its own color scheme, so the pages are
visually distinct but structurally consistent.

## Local development

There's nothing to build. To work on it:

```bash
git clone https://github.com/raghavendra-exp/bankexamv2.git
cd bankexamv2
open index.html          # or just double-click it — no server needed
```

If you want to test against a local server instead of `file://` (e.g. to check
relative links behave the same as on GitHub Pages), any static server works:

```bash
python3 -m http.server 8000
```

## Adding a new exam tool

1. Copy the closest existing `*_exam_prompt_generator.html` file as a starting
   template (they're intentionally near-identical in structure).
2. Update the exam-specific content, color scheme, and meta tags (title,
   description, canonical URL, `og:url` — **all of these must point to the new
   file itself**, not the template you copied from — a copy-paste miss here
   has happened before).
3. Add the new tool to `index.html`'s nav, hero stats, tool grid, and
   comparison table, and bump the tool count.
4. Add the new page to `sitemap.xml`.
5. Validate any inline JS before committing — extract the `<script>` contents
   to a `.js` file and run `node --check` on it.

## Known constraints / gotchas

- **No shared JS/CSS files.** Because pages must work from `file://` with no
  build step, common code (nav, styling, chatbot logic) is duplicated across
  files rather than imported from a shared module. A fix to shared logic in
  one exam page must be manually replicated across the others.
- **Literal newlines inside JS string literals will break `file://` parsing.**
  When generating or editing inline JS programmatically, use explicit `\n`
  escape sequences, not embedded newline characters, and run `node --check`
  on the extracted script before saving.
- **`admin.html` is a UI convenience gate only.** Real access control lives in
  Firestore security rules, which must independently restrict reads to the
  admin account — the client-side check can be bypassed by anyone editing
  the page, so it must never be the only thing protecting real data.

## License

See [LICENSE](LICENSE).
