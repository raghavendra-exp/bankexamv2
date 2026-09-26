/**
 * BankExamV2 — Universal Floating AI Chatbot Assistant
 * Powered by Google Gemini 3.8 / 3.6 Flash with Offline Smart Fallback Engine.
 * Created by Raghavbegins for Indian Competitive Exam Aspirants.
 */

(function(){
  if(window.BankExamChatbotLoaded) return;
  window.BankExamChatbotLoaded = true;

  // Configuration & Key
  const DEFAULT_KEY_B64 = "QVEuQWI4Uk42S1l5OGIzLXZ2Ym1GVG01Tk9KRkxnWEdkYlVvQl94ckY5US1xZ3NrUnRlaXc=";
  function getApiKey(){
    const stored = localStorage.getItem("bankexam_gemini_key");
    if(stored && stored.trim().length > 10) return stored.trim();
    try { return atob(DEFAULT_KEY_B64); } catch(e){ return ""; }
  }

  // System Prompt for Gemini
  const SYSTEM_INSTRUCTION = 
    "You are the Exam Prep Mentor on BankExamV2 (created by Raghavbegins). " +
    "You are an encouraging, razor-sharp, and highly structured tutor for Indian competitive exams: " +
    "SBI PO/Clerk, IBPS, RBI Grade B, UPSC Civil Services, SSC CGL/CHSL, Railways RRB, GATE, and Defence.\n\n" +
    "Rules:\n" +
    "1. Format with clean Markdown: bold headers, bullet lists, numbered steps.\n" +
    "2. DO NOT use LaTeX dollar signs ($); write clean arithmetic like 53² or 25 + 3 = 28.\n" +
    "3. For syllabus questions, break down Prelims vs Mains with exact sectional marks.\n" +
    "4. For math/quant, give direct formulas and 5-second speed tricks.\n" +
    "5. Keep responses concise, high-yield, and complete.";

  // Multi-turn history
  let chatHistory = [];
  let isRequestPending = false;
  let currentDomain = "banking";

  // Comprehensive Built-in Knowledge Base (Zero-fail instant fallback)
  const LOCAL_KB = {
    banking_syllabus: `### 🏦 Complete Banking Exam Syllabus (SBI PO & IBPS 2026)

#### 📌 Phase 1: Prelims (100 Marks • 60 Mins • 20 Mins Sectional Timer)
* **Quantitative Aptitude (35 Qs • 35 Marks):**
  • Simplification & Approximation (5–10 Qs)
  • Number Series (Missing & Wrong Series, 5 Qs)
  • Quadratic Equations (5 Qs)
  • Data Interpretation (Tabular, Bar, Line, Pie, Caselet, 10–15 Qs)
  • Arithmetic Word Problems (Percentage, Profit & Loss, SI/CI, Ratio, Time & Work, Speed & Distance, 10 Qs)
* **Reasoning Ability (35 Qs • 35 Marks):**
  • Puzzles & Seating Arrangement (Floor, Box, Circular, Linear, Flat/Floor, 15–20 Qs)
  • Syllogism & Inequality (5–8 Qs)
  • Coding-Decoding, Blood Relations & Direction Sense (5–7 Qs)
* **English Language (30 Qs • 30 Marks):**
  • Reading Comprehension (8–10 Qs)
  • Cloze Test & Error Spotting (5–8 Qs)
  • Para Jumbles & Sentence Rearrangement (5 Qs)
  • Fill in the Blanks & Vocab (4–5 Qs)

#### 📌 Phase 2: Mains Examination (200 Marks + 25 Marks Descriptive)
* **Advanced Data Analysis & Interpretation (CAT/GMAT Level)**
* **High-Level Logical Reasoning & Computer Aptitude**
* **General & Financial Awareness:** Banking terms, RBI circulars, Monetary Policy, Union Budget, static banking HQ.
* **English Language & Descriptive:** Essay & Letter Writing (25 Marks).`,

    upsc_syllabus: `### 🏛️ UPSC Civil Services Examination Syllabus

#### 📌 Stage 1: Prelims (Screening • Objective)
* **General Studies Paper 1 (200 Marks • 100 Qs • 2 Hours):**
  • Indian Polity & Governance (Constitution, Panchayati Raj, Public Policy)
  • History of India & Indian National Movement
  • Indian and World Geography (Physical, Social, Economic)
  • Economic & Social Development (Sustainable Dev, Poverty, Demographics)
  • Environmental Ecology, Biodiversity & Climate Change
  • General Science & Current Events of National/International Importance
* **CSAT Paper 2 (200 Marks • 80 Qs • 33% Qualifying = 66.7 Marks):**
  • Reading Comprehension, Logical Reasoning, Analytical Ability, Basic Numeracy (Class 10 level).

#### 📌 Stage 2: Mains Examination (9 Written Papers • 1750 Marks)
* **Qualifying Papers:** Indian Language (300 Marks) & English (300 Marks).
* **Merit Papers:** Essay (250), GS I (Heritage, History, Geography, Society - 250), GS II (Governance, Constitution, Polity, IR - 250), GS III (Tech, Economy, Bio-diversity, Security - 250), GS IV (Ethics, Integrity & Aptitude - 250), Optional Subject Paper 1 & 2 (500 Marks).

#### 📌 Stage 3: Personality Test / Interview (275 Marks)`,

    ssc_syllabus: `### 🎯 SSC CGL 2026 Examination Syllabus & Pattern

#### 📌 Tier 1 (Screening • 200 Marks • 100 Qs • 60 Mins)
* **General Intelligence & Reasoning (25 Qs • 50 Marks):** Analogies, series, coding, Venn diagrams, matrix, non-verbal.
* **General Awareness (25 Qs • 50 Marks):** History, Geography, Polity, Science, Static GK & Current Affairs.
* **Quantitative Aptitude (25 Qs • 50 Marks):** Arithmetic (Percentage, Ratio, SI/CI, Profit & Loss) + Advanced Math (Algebra, Geometry, Trigonometry, Mensuration).
* **English Comprehension (25 Qs • 50 Marks):** Error spotting, idioms, synonyms, one-word substitution, comprehension passage.

#### 📌 Tier 2 (Merit Deciding)
* **Paper 1 (Compulsory for all posts):**
  • Section 1: Math (30 Qs) + Reasoning (30 Qs) = 180 Marks (1 Hour)
  • Section 2: English (45 Qs) + General Awareness (25 Qs) = 210 Marks (1 Hour)
  • Section 3: Computer Knowledge Test (20 Qs • Qualifying) + DEST Data Entry Speed Test (Qualifying).`,

    railway_syllabus: `### 🚆 Railways RRB NTPC & Group D Syllabus

#### 📌 CBT Stage 1 (100 Questions • 90 Minutes)
* **General Awareness (40 Qs):** Indian History, Freedom Struggle, Polity, Geography, Current Affairs, Art & Culture.
* **Mathematics (30 Qs):** Number System, Decimals, Fractions, LCM/HCF, Ratio, Percentages, Mensuration, Time & Work, CI/SI.
* **General Intelligence & Reasoning (30 Qs):** Coding-Decoding, Syllogisms, Venn Diagrams, Jumbling, Directions.

#### 📌 CBT Stage 2 (120 Questions • 90 Minutes)
* General Awareness: 50 Questions
* Mathematics: 35 Questions
* General Intelligence & Reasoning: 35 Questions
* *Negative Marking: 1/3rd mark deducted for every wrong answer.*`,

    speed_math: `### ⚡ High-Yield Speed Math Calculation Vault

#### 1. Squaring Numbers from 40 to 60 (Base 50 Rule)
* **Rule:** Base value is 25. Compare number to 50.
* **Example (53²):**
  • Difference from 50 = +3
  • First 2 digits = 25 + 3 = **28**
  • Last 2 digits = 3² = **09**
  • Result: **53² = 2809**
* **Example (47²):**
  • Difference from 50 = -3
  • First 2 digits = 25 - 3 = **22**
  • Last 2 digits = (-3)² = **09**
  • Result: **47² = 2209**

#### 2. Squaring Numbers Ending in 5
* **Rule:** Multiply the first digit by (digit + 1), and suffix 25.
* **Example (65²):** 6 × 7 = 42 &rarr; **4225**
* **Example (85²):** 8 × 9 = 72 &rarr; **7225**
* **Example (115²):** 11 × 12 = 132 &rarr; **13225**

#### 3. Quadratic Equation 5-Second Sign Rule
Look at the signs of (b, c) in ax² + bx + c = 0:
* If (+ , +) &rarr; Roots are **(- , -)**
* If (- , +) &rarr; Roots are **(+ , +)**
* If (+ , -) &rarr; Roots are **(- , +)**
* If (- , -) &rarr; Roots are **(+ , -)**
* *Pro Tip:* If both constant terms (c) are negative in a comparison question, answer is ALWAYS **Relationship cannot be established (CND)** without solving!

#### 4. Critical Percentage-to-Fraction Cheat Sheet
• 1/6 = **16.66%** | • 1/7 = **14.28%** | • 1/8 = **12.5%**
• 1/9 = **11.11%** | • 1/11 = **9.09%** | • 1/12 = **8.33%**
• 1/14 = **7.14%** | • 1/16 = **6.25%** | • 3/8 = **37.5%**`,

    study_plan: `### 📅 6-Month Master Blueprint for SBI PO & IBPS (2026)

#### 🗓️ Month 1–2: Foundation & Speed Math Drill
* Master tables up to 30, squares up to 50, cubes up to 30, and percentage fractions.
* Complete basic arithmetic: Ratio, Percentage, Average, Profit & Loss, SI/CI.
* Solve 30 simplification and 20 number series questions daily.
* Read The Hindu editorial daily for 30 minutes to build reading speed.

#### 🗓️ Month 3–4: Advanced Concepts & Sectional Tests
* Puzzles: Floor-based, box-based, circular, and variable puzzles (minimum 4 daily).
* Data Interpretation: High-level tabular, missing DI, and pie-chart sets.
* Take 3 sectional tests weekly (Quant, Reasoning, English) with full error logs.

#### 🗓️ Month 5: Full Mock Simulations & Speed Calibration
* Take 1 full prelims mock every alternate day under strict 20-minute sectional timing.
* Target: 70+ raw score with 90%+ accuracy.
* Start Mains preparation: Financial awareness and daily GA compilation.

#### 🗓️ Month 6: Final Revision & Mains Sprint
* 10 days before exam: Stop new topics. Revise formulas and error diary.
* Practice descriptive essay and letter templates.`,

    creator_info: `### 👨‍💻 Creator Profile & Portfolio: Raghavendra (Raghavbegins)

* **Founder & Developer:** Raghavendra
* **Educational Initiative:** Indian Exam AI Prompt Generator & Practice Hub (BankExamV2)
* **Official Portfolio:** [raghavfolio-8op53xas.manus.space](https://raghavfolio-8op53xas.manus.space/)
* **Platform Vision:** 100% Free AI preparation tools, 13 interactive study modules, formula vaults, and exam calendars for 80+ Indian competitive examinations.
* **YouTube:** [@raghav_begins](https://www.youtube.com/@raghav_begins)
* **Instagram:** [@raghav3o](https://www.instagram.com/raghav3o)
* **Facebook:** [Raghavbegins](https://www.facebook.com/Raghavbegins)

Visit the creator's portfolio at [raghavfolio-8op53xas.manus.space](https://raghavfolio-8op53xas.manus.space/) to explore full tech background, project showcases, and design philosophies!`
  };

  // Helper: Match local KB response
  function getLocalResponse(text){
    const q = text.toLowerCase();
    if(q.includes("creator") || q.includes("developer") || q.includes("who made") || q.includes("who built") || q.includes("portfolio") || q.includes("raghav")) return LOCAL_KB.creator_info;
    if(q.includes("bank") && q.includes("syllab")) return LOCAL_KB.banking_syllabus;
    if(q.includes("upsc") && (q.includes("syllab") || q.includes("pattern") || q.includes("stage"))) return LOCAL_KB.upsc_syllabus;
    if(q.includes("ssc") && (q.includes("syllab") || q.includes("pattern") || q.includes("cgl"))) return LOCAL_KB.ssc_syllabus;
    if((q.includes("rail") || q.includes("rrb")) && q.includes("syllab")) return LOCAL_KB.railway_syllabus;
    if(q.includes("speed math") || q.includes("shortcut") || q.includes("trick") || q.includes("square") || q.includes("calculation")) return LOCAL_KB.speed_math;
    if(q.includes("plan") || q.includes("schedule") || q.includes("blueprint") || q.includes("roadmap") || q.includes("routine")) return LOCAL_KB.study_plan;
    if(q.includes("syllab")) return LOCAL_KB.banking_syllabus;
    return null;
  }

  // Inject Styles for the Floating Chatbot
  function injectStyles(){
    if(document.getElementById("bankexam-chatbot-styles")) return;
    const style = document.createElement("style");
    style.id = "bankexam-chatbot-styles";
    style.textContent = `
      /* Floating Trigger Button */
      .bec-launcher {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4F46E5, #06B6D4);
        border: none;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        box-shadow: 0 10px 30px rgba(79,70,229,0.5), 0 0 0 2px rgba(255,255,255,0.2);
        z-index: 99998;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .bec-launcher:hover {
        transform: scale(1.08) translateY(-3px);
        box-shadow: 0 14px 40px rgba(79,70,229,0.65), 0 0 0 3px rgba(255,255,255,0.3);
      }
      .bec-launcher-ring {
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid rgba(99,102,241,0.6);
        animation: becRing 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1);
        pointer-events: none;
      }
      @keyframes becRing {
        0%{transform:scale(0.9);opacity:1}
        100%{transform:scale(1.45);opacity:0}
      }
      .bec-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #10B981;
        border: 2px solid #050914;
        box-shadow: 0 0 8px #10B981;
      }
      .bec-tooltip {
        position: fixed;
        bottom: 34px;
        right: 98px;
        background: rgba(13,21,36,0.96);
        backdrop-filter: blur(14px);
        border: 1px solid rgba(255,255,255,0.15);
        color: #fff;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 8px 24px rgba(0,0,0,0.45);
        white-space: nowrap;
        z-index: 99997;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        animation: becFade 0.3s ease;
      }
      .bec-tooltip span { color: #22D3EE; }
      @keyframes becFade { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }

      /* Floating Chat Panel */
      .bec-panel {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 420px;
        max-width: calc(100vw - 32px);
        height: min(680px, calc(100vh - 120px));
        background: rgba(11,18,33,0.96);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 24px;
        box-shadow: 0 25px 70px rgba(0,0,0,0.7), 0 0 40px rgba(79,70,229,0.25);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 99999;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .bec-panel.is-open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .bec-panel.is-maximized {
        width: min(800px, calc(100vw - 32px));
        height: min(840px, calc(100vh - 60px));
        bottom: 30px;
        right: 50%;
        transform: translateX(50%) scale(1) !important;
      }

      /* Chat Header */
      .bec-header {
        background: linear-gradient(160deg, #070D1E, #111B35);
        padding: 14px 16px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-shrink: 0;
      }
      .bec-hd-info { display: flex; align-items: center; gap: 10px; }
      .bec-hd-avatar {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: linear-gradient(135deg, #4F46E5, #06B6D4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #fff;
        box-shadow: 0 0 14px rgba(79,70,229,0.5);
      }
      .bec-hd-title { font-size: 14px; font-weight: 800; color: #fff; line-height: 1.2; }
      .bec-hd-status {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 10.5px;
        color: #34D399;
        font-weight: 700;
        margin-top: 2px;
      }
      .bec-live-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #34D399;
        box-shadow: 0 0 6px #34D399;
        animation: becBlink 1.6s infinite;
      }
      @keyframes becBlink { 0%,100%{opacity:1} 50%{opacity:.3} }

      .bec-hd-actions { display: flex; gap: 5px; align-items: center; }
      .bec-icon-btn {
        width: 28px;
        height: 28px;
        border-radius: 7px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        color: #94A3B8;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        transition: all .15s;
      }
      .bec-icon-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

      /* Suggestion pills */
      .bec-chips {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding: 8px 12px;
        background: rgba(8,14,28,0.9);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        scrollbar-width: none;
        flex-shrink: 0;
      }
      .bec-chips::-webkit-scrollbar { display: none; }
      .bec-chip {
        flex: 0 0 auto;
        padding: 5px 12px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.04);
        color: #94A3B8;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: all .15s;
        white-space: nowrap;
      }
      .bec-chip:hover { background: rgba(255,255,255,0.09); color: #fff; border-color: rgba(255,255,255,0.25); }

      /* Message stream */
      .bec-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px 14px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: radial-gradient(rgba(79,70,229,0.04) 1px, transparent 1px) 0 0/24px 24px, #0A1224;
      }
      .bec-messages::-webkit-scrollbar { width: 5px; }
      .bec-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }

      .bec-msg { display: flex; gap: 8px; align-items: flex-end; max-width: 90%; }
      .bec-msg.bot { align-self: flex-start; }
      .bec-msg.user { align-self: flex-end; flex-direction: row-reverse; }

      .bec-msg-avatar {
        width: 26px;
        height: 26px;
        border-radius: 8px;
        background: linear-gradient(135deg, #4F46E5, #06B6D4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #fff;
        font-weight: 900;
        flex-shrink: 0;
      }

      .bec-msg-body { display: flex; flex-direction: column; gap: 4px; max-width: 100%; }
      .bec-bubble {
        padding: 12px 15px;
        border-radius: 18px;
        font-size: 13.5px;
        line-height: 1.55;
        word-wrap: break-word;
        color: #F1F5F9;
      }
      .bec-msg.bot .bec-bubble {
        background: #131F36;
        border: 1px solid rgba(255,255,255,0.1);
        border-bottom-left-radius: 4px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      }
      .bec-msg.user .bec-bubble {
        background: linear-gradient(135deg, #4F46E5, #06B6D4);
        color: #fff;
        border-bottom-right-radius: 4px;
        box-shadow: 0 4px 16px rgba(79,70,229,0.35);
        font-weight: 500;
      }

      /* Bubble Markdown styling */
      .bec-bubble strong { color: #fff; font-weight: 700; }
      .bec-bubble h3, .bec-bubble .b-h3 { font-size: 14px; font-weight: 800; color: #22D3EE; margin: 8px 0 4px; }
      .bec-bubble h4, .bec-bubble .b-h4 { font-size: 13px; font-weight: 800; color: #FCD34D; margin: 6px 0 3px; }
      .bec-bubble .b-li { display: flex; gap: 6px; align-items: flex-start; margin: 3px 0; }
      .bec-bubble .b-bullet { color: #22D3EE; font-weight: 900; }
      .bec-bubble .b-num { color: #818CF8; font-weight: 800; font-family: monospace; }
      .bec-bubble .b-gap { height: 6px; }

      /* Message action footer */
      .bec-msg-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 10.5px;
        color: #64748B;
        padding: 0 4px;
      }
      .bec-msg.user .bec-msg-meta { justify-content: flex-end; }
      .bec-meta-btn {
        background: none;
        border: none;
        color: #64748B;
        cursor: pointer;
        font-size: 10.5px;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 4px;
        border-radius: 4px;
        transition: color .15s;
      }
      .bec-meta-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }

      /* Typing indicator */
      .bec-typing {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: #131F36;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 18px;
        border-bottom-left-radius: 4px;
        font-size: 12px;
        color: #94A3B8;
        align-self: flex-start;
      }
      .bec-dots { display: inline-flex; gap: 4px; }
      .bec-dots span {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #34D399;
        animation: becTdot 1.2s infinite ease-in-out;
      }
      .bec-dots span:nth-child(2){ animation-delay: .2s; }
      .bec-dots span:nth-child(3){ animation-delay: .4s; }
      @keyframes becTdot { 0%,80%,100%{opacity:.2;transform:scale(.8)} 40%{opacity:1;transform:scale(1.2)} }

      /* Input bar */
      .bec-input-bar {
        display: flex;
        gap: 8px;
        padding: 10px 12px;
        align-items: center;
        background: rgba(8,14,28,0.98);
        border-top: 1px solid rgba(255,255,255,0.1);
        flex-shrink: 0;
      }
      .bec-input {
        flex: 1;
        padding: 11px 16px;
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.06);
        color: #fff;
        font-size: 13.5px;
        font-family: inherit;
        outline: none;
        transition: all .15s;
      }
      .bec-input::placeholder { color: #64748B; }
      .bec-input:focus {
        border-color: #6366F1;
        background: rgba(255,255,255,0.09);
        box-shadow: 0 0 0 2px rgba(99,102,241,0.25);
      }
      .bec-send-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4F46E5, #06B6D4);
        border: none;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        box-shadow: 0 4px 12px rgba(79,70,229,0.4);
        transition: transform .15s;
        flex-shrink: 0;
      }
      .bec-send-btn:hover { transform: scale(1.08); }
      .bec-send-btn:active { transform: scale(0.94); }

      @media(max-width: 768px){
        .bec-launcher {
          bottom: 74px !important;
          right: 16px !important;
          width: 54px !important;
          height: 54px !important;
          font-size: 24px !important;
        }
        .bec-tooltip { display: none !important; }
      }
      @media(max-width: 480px){
        .bec-panel {
          bottom: 0 !important;
          right: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 100vh !important;
          height: 100dvh !important;
          border-radius: 0 !important;
          z-index: 999999 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Markdown Formatter
  function formatMarkdown(text){
    if(!text) return "";
    let s = text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    s = s.replace(/^### (.*$)/gim, '<div class="b-h3">$1</div>');
    s = s.replace(/^#### (.*$)/gim, '<div class="b-h4">$1</div>');
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
    s = s.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,.08);padding:2px 5px;border-radius:4px;color:#FCD34D">$1</code>');
    s = s.replace(/^\s*[-*•]\s+(.*$)/gim, '<div class="b-li"><span class="b-bullet">•</span><span>$1</span></div>');
    s = s.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div class="b-li"><span class="b-num">$1.</span><span>$2</span></div>');
    s = s.replace(/\n\n/g, '<div class="b-gap"></div>');
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  function getTimeStr(){
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  // Create Chatbot DOM
  function createChatbotUI(){
    injectStyles();

    // Launcher Wrap
    const launcherWrap = document.createElement("div");
    launcherWrap.className = "bec-launcher-wrap";
    launcherWrap.innerHTML = `
      <div class="bec-tooltip" id="becTooltip">
        <span>✨</span> Ask Exam Prep Mentor
      </div>
      <button class="bec-launcher" id="becLauncher" aria-label="Open AI Mentor Chatbot">
        <div class="bec-launcher-ring"></div>
        <span class="bec-badge"></span>
        <span id="becLauncherIcon">🎓</span>
      </button>
    `;
    document.body.appendChild(launcherWrap);

    // Chat Panel
    const panel = document.createElement("div");
    panel.className = "bec-panel";
    panel.id = "becPanel";
    panel.innerHTML = `
      <div class="bec-header">
        <div class="bec-hd-info">
          <div class="bec-hd-avatar">🎓</div>
          <div>
            <div class="bec-hd-title">BankExamV2 AI Mentor</div>
            <div class="bec-hd-status">
              <span class="bec-live-dot"></span>
              <span>Gemini 3.8 Flash • Online</span>
            </div>
          </div>
        </div>
        <div class="bec-hd-actions">
          <a href="https://raghavfolio-8op53xas.manus.space/" target="_blank" rel="noopener" class="bec-icon-btn" title="Creator Profile &amp; Portfolio (Raghavendra)" style="text-decoration:none">👨‍💻</a>
          <button class="bec-icon-btn" id="becMaxBtn" title="Expand / Shrink">⛶</button>
          <button class="bec-icon-btn" id="becClearBtn" title="Clear Chat">🗑️</button>
          <button class="bec-icon-btn" id="becCloseBtn" title="Close Chat">✕</button>
        </div>
      </div>

      <div class="bec-chips">
        <button class="bec-chip" data-q="Who created BankExamV2 and where can I view the creator portfolio?">👨‍💻 Creator Profile</button>
        <button class="bec-chip" data-q="What is the detailed 2026 syllabus for Banking?">📚 Banking Syllabus</button>
        <button class="bec-chip" data-q="Give me high-yield speed math calculation shortcuts with examples">⚡ Speed Math</button>
        <button class="bec-chip" data-q="Give me a 6-month study schedule for SBI PO prelims and mains">📅 6-Month Plan</button>
        <button class="bec-chip" data-q="Explain UPSC Civil Services prelims and mains exam pattern">🏛️ UPSC Strategy</button>
        <button class="bec-chip" data-q="What is the SSC CGL Tier 1 and Tier 2 syllabus and pattern?">🎯 SSC CGL Pattern</button>
      </div>

      <div class="bec-messages" id="becMessages"></div>

      <div class="bec-input-bar">
        <input type="text" class="bec-input" id="becInput" placeholder="Ask about syllabus, speed math, cutoffs..." autocomplete="off">
        <button class="bec-send-btn" id="becSendBtn" aria-label="Send">➤</button>
      </div>
    `;
    document.body.appendChild(panel);

    // Event listeners
    const launcher = document.getElementById("becLauncher");
    const tooltip = document.getElementById("becTooltip");
    const closeBtn = document.getElementById("becCloseBtn");
    const maxBtn = document.getElementById("becMaxBtn");
    const clearBtn = document.getElementById("becClearBtn");
    const sendBtn = document.getElementById("becSendBtn");
    const input = document.getElementById("becInput");

    launcher.addEventListener("click", toggleOpen);
    if(tooltip) tooltip.addEventListener("click", toggleOpen);
    closeBtn.addEventListener("click", () => setOpen(false));

    maxBtn.addEventListener("click", () => {
      panel.classList.toggle("is-maximized");
    });

    clearBtn.addEventListener("click", () => {
      if(confirm("Clear current conversation?")){
        document.getElementById("becMessages").innerHTML = "";
        chatHistory = [];
        addBotMsg("Conversation cleared. Ask me anything about banking, speed math, UPSC, or roadmaps!");
      }
    });

    sendBtn.addEventListener("click", handleSend);
    input.addEventListener("keydown", (e) => {
      if(e.key === "Enter") handleSend();
    });

    // Chip listeners
    panel.querySelectorAll(".bec-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-q");
        if(q) {
          sendUserMessage(q);
        }
      });
    });

    // Initial welcome message
    addBotMsg(
      "👋 **Welcome to BankExamV2 AI Mentor!**\n\n" +
      "I can provide complete guidance on:\n" +
      "• **Syllabus & Exam Patterns** (SBI PO, IBPS, UPSC, SSC, RRB)\n" +
      "• **Speed Math Shortcuts** (Square roots, Base 50, Quadratic signs, Fractions)\n" +
      "• **Phase-by-Phase Preparation Roadmaps & Daily Timetables**\n" +
      "• **Cutoff Trends & Negative Marking Hacks**\n\n" +
      "Click a suggestion chip above or type your question below!"
    );
  }

  function setOpen(open){
    const panel = document.getElementById("becPanel");
    const tooltip = document.getElementById("becTooltip");
    const icon = document.getElementById("becLauncherIcon");
    if(open){
      panel.classList.add("is-open");
      if(tooltip) tooltip.style.display = "none";
      if(icon) icon.textContent = "✕";
      setTimeout(() => document.getElementById("becInput").focus(), 150);
    } else {
      panel.classList.remove("is-open");
      if(icon) icon.textContent = "🎓";
    }
  }

  function toggleOpen(){
    const panel = document.getElementById("becPanel");
    setOpen(!panel.classList.contains("is-open"));
  }

  function scrollToBottom(){
    const msgBox = document.getElementById("becMessages");
    if(msgBox) msgBox.scrollTop = msgBox.scrollHeight;
  }

  function addUserMsg(text){
    const msgBox = document.getElementById("becMessages");
    const msg = document.createElement("div");
    msg.className = "bec-msg user";
    msg.innerHTML = `
      <div class="bec-msg-body">
        <div class="bec-bubble">${text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
        <div class="bec-msg-meta"><span>${getTimeStr()}</span></div>
      </div>
    `;
    msgBox.appendChild(msg);
    scrollToBottom();
  }

  function addBotMsg(text){
    const msgBox = document.getElementById("becMessages");
    const msg = document.createElement("div");
    msg.className = "bec-msg bot";

    const formatted = formatMarkdown(text);
    msg.innerHTML = `
      <div class="bec-msg-avatar">AI</div>
      <div class="bec-msg-body">
        <div class="bec-bubble">${formatted}</div>
        <div class="bec-msg-meta">
          <button class="bec-meta-btn bec-copy-btn">📋 Copy</button>
          ${'speechSynthesis' in window ? '<button class="bec-meta-btn bec-listen-btn">🔊 Listen</button>' : ''}
          <span>•</span>
          <span>${getTimeStr()}</span>
        </div>
      </div>
    `;

    // Copy action
    const copyBtn = msg.querySelector(".bec-copy-btn");
    if(copyBtn){
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = "✅ Copied!";
          setTimeout(() => copyBtn.textContent = "📋 Copy", 2000);
        });
      });
    }

    // Listen action
    const listenBtn = msg.querySelector(".bec-listen-btn");
    if(listenBtn){
      listenBtn.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        const clean = text.replace(/[*#`_•]/g, ' ');
        const u = new SpeechSynthesisUtterance(clean);
        u.rate = 1.05;
        window.speechSynthesis.speak(u);
      });
    }

    msgBox.appendChild(msg);
    scrollToBottom();
  }

  function showTyping(){
    const msgBox = document.getElementById("becMessages");
    const t = document.createElement("div");
    t.className = "bec-typing";
    t.id = "becTyping";
    t.innerHTML = `
      <span>Gemini AI is analyzing</span>
      <div class="bec-dots"><span></span><span></span><span></span></div>
    `;
    msgBox.appendChild(t);
    scrollToBottom();
  }

  function hideTyping(){
    const t = document.getElementById("becTyping");
    if(t) t.remove();
  }

  // Call Gemini with failover
  async function queryGemini(promptText){
    const key = getApiKey();
    if(!key) throw new Error("No API key");

    // Push user message to history
    chatHistory.push({ role: "user", parts: [{ text: promptText }] });
    if(chatHistory.length > 10){
      chatHistory = chatHistory.slice(chatHistory.length - 8);
    }

    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: chatHistory,
      generationConfig: { temperature: 0.6, maxOutputTokens: 2500 }
    };

    // Timeout helper
    const fetchWithTimeout = (url, timeoutMs = 9000) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      }).finally(() => clearTimeout(timer));
    };

    // Try gemini-3.8-flash first, then gemini-3.6-flash
    const models = ["gemini-3.8-flash", "gemini-3.6-flash"];
    for(const m of models){
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`;
        const res = await fetchWithTimeout(url, 9000);
        if(!res.ok) continue;
        const data = await res.json();
        if(data && data.candidates && data.candidates[0] && data.candidates[0].content){
          const reply = data.candidates[0].content.parts[0].text;
          chatHistory.push({ role: "model", parts: [{ text: reply }] });
          return reply;
        }
      } catch(e) {
        // try next model
      }
    }

    throw new Error("All Gemini models unavailable");
  }

  // Message Handler
  async function sendUserMessage(text){
    if(!text || !text.trim() || isRequestPending) return;
    const clean = text.trim();
    isRequestPending = true;

    addUserMsg(clean);
    showTyping();

    try {
      const aiReply = await queryGemini(clean);
      hideTyping();
      addBotMsg(aiReply);
    } catch(err) {
      hideTyping();
      // Remove failed user turn from history to prevent 400 alternating error
      if(chatHistory.length && chatHistory[chatHistory.length - 1].role === "user"){
        chatHistory.pop();
      }

      // Check Local High-Yield KB
      const localReply = getLocalResponse(clean);
      if(localReply){
        addBotMsg(localReply);
      } else {
        addBotMsg(
          "I am your BankExamV2 Mentor. I can walk you through the **detailed syllabus**, **speed-math shortcuts**, **preparation roadmaps**, or **cutoffs** for Banking, UPSC, SSC, and Railways.\n\n" +
          "Try asking:\n" +
          "• *What is the detailed 2026 syllabus for Banking?*\n" +
          "• *Give me speed math calculation shortcuts*\n" +
          "• *Give me a 6-month study plan for SBI PO*"
        );
      }
    } finally {
      isRequestPending = false;
      const inp = document.getElementById("becInput");
      if(inp) inp.value = "";
    }
  }

  function handleSend(){
    const input = document.getElementById("becInput");
    if(input) sendUserMessage(input.value);
  }

  // Expose global methods
  window.openBankExamChatbot = function(initialPrompt){
    setOpen(true);
    if(initialPrompt) sendUserMessage(initialPrompt);
  };

  // Init on DOM ready
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", createChatbotUI);
  } else {
    createChatbotUI();
  }

})();
