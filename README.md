# 🥗 NutriTruth — TruthIn Packaged Food Scanner

> **Don't just read the front. Read the back label.**
> A free, open, zero-login web app that decodes packaged food labels, exposes hidden sugars and cheap palm oil, and suggests cleaner alternatives.

Inspired by the **TruthIn** app and **Revant Himatsingka (@foodpharmer)** — the *"Label Padhega India"* movement.

![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-f7df1e?logo=javascript&logoColor=black)
![No Build Step](https://img.shields.io/badge/build-none-brightgreen)
![No Backend](https://img.shields.io/badge/backend-none-blue)
![GitHub Pages Ready](https://img.shields.io/badge/deploy-GitHub%20Pages-222?logo=github)

---

## 📖 Table of Contents

- [What It Does](#-what-it-does)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deploying to GitHub Pages](#-deploying-to-github-pages)
- [How Scoring Works](#-how-scoring-works)
- [Data Model](#-data-model)
- [Adding a New Product](#-adding-a-new-product)
- [Local Storage Keys](#-local-storage-keys)
- [Browser Support](#-browser-support)
- [Credits & Inspiration](#-credits--inspiration)
- [Disclaimer](#-disclaimer)
- [License](#-license)

---

## 🎯 What It Does

Over 80% of packaged food sold in India hides cheap **palmolein oil**, excessive **sugar under 40+ aliases**, and synthetic **INS/E-number additives** behind deceptive front-of-pack marketing.

NutriTruth lets you:

1. **Browse truth ratings** for popular packaged foods (Bournvita, Maggi, Oreo, Sting, Nutella, Chocos…).
2. **Paste any ingredient list** and get an instant breakdown of hidden sugars, palm oil, and chemical additives.
3. **Compare two products** head-to-head with visual sugar-cube counts and nutrient tables.
4. **See clean swaps** — "Instead of X, buy Y" — with the exact sugar and fat savings.
5. **Decode any INS / E-number** from a searchable 50+ additive dictionary.

No accounts. No tracking. No backend. Everything runs **entirely in the browser** and state persists in `localStorage`.

---

## ✨ Features

### 🏠 Home & Feed
- Product cards with **NutriTruth Score (0–100)**, palm-oil badges, veg indicators, and sugar-cube visualizations.
- **Live search** across product name, brand, ingredients, and marketing claims.
- **Category chips** — beverages, biscuits, cereals, instant meals, snacks, spreads.
- **Quick filters** — Palm Oil Free · Zero Added Sugar · Clean Label Only (80+).
- **Veg-Only toggle** in the header.

### 🎯 MatchMeter (Personalized Ratings)
Every product is scored **against your active health goal** — not just a generic rating:

| Goal | What it prioritizes |
|------|---------------------|
| 🌟 General Health | Balanced whole-food integrity |
| 🩸 Diabetes & Sugar Watch | Glycemic load, sugar aliases, fiber |
| 👶 Kids & Family Care | Palm oil, synthetic dyes, additives |
| 🏃 Fitness & High Protein | Protein density, clean fats |
| ⚖️ Weight Management | Calorie density, satiety, sugar spikes |

The active goal is stored and applied to **every card, modal, and comparison**.

### 📷 Label Scanner & Ingredient Analyzer
- **Barcode simulator** — click a sample product to "scan" it.
- **Paste-a-label analyzer** — real keyword parsing for:
  - **Palm oil aliases** — `palm oil`, `palmolein`, `fractionated palm`, `palm kernel`, `hydrogenated vegetable fat/oil`, `cottonseed oil`
  - **Sugar aliases** — `sugar`, `liquid glucose`, `invert sugar`, `maltodextrin`, `dextrose`, `HFCS`, `cereal extract`, `malt extract`, `corn syrup`, `cane juice`, `fructose`, `sucrose`
  - **INS codes** — cross-referenced against the built-in dictionary
- **Dynamic scoring** based on detected red flags.
- **File upload** (image picker) triggers a demo analysis flow.
- **Web Audio beep** on scan — zero audio assets required.

### ⚖️ Head-to-Head Comparison
- Two dropdown selectors, or one-click **famous TruthIn debunk presets**:
  - Bournvita vs Chana Sattu
  - Maggi vs Millet Noodles
  - Oreo vs The Whole Truth
  - Sting vs Tender Coconut
  - Nutella vs 100% Peanut Butter
  - Chocos vs High Fiber Muesli
- Visual **sugar-cube piles** side by side.
- Full **per-100g nutrient table** with computed sugar/protein deltas.
- Auto-generated **verdict paragraph** explaining *why* the swap matters.

### 🔄 Smart Food Swaps Table
A dedicated "Instead of X, eat Y" matrix showing:
- Bad product score + concerns
- Clean product score + benefits
- **Sugar reduction** and **palm-oil elimination**
- One-click "Compare" to jump into the side-by-side arena

### 📖 Guide, INS Decoder & Sugar Calculator
- **5 Rules to Read Any Food Label in 10 Seconds** (ingredient order, palm oil disguises, sugar aliases, "Zero Maida" tricks, serving-size illusions).
- **INS / E-number dictionary** — searchable, safety-rated (Safe / Caution / Harmful), with "commonly found in" notes.
- **Interactive sugar calculator** — enter sugar per 100g + serving size, get sugar cubes, teaspoons, and **% of WHO's 25g daily limit** with a visual cube pile.

### 🎮 Gamification (local only)
- **Truth Points** awarded for inspecting labels, scanning, bookmarking, and comparing.
- **Daily streak** badge in the header.
- **Bookmarks** with a counter badge.

### ♿ UX Details
- Fully responsive — native bottom tab bar on mobile, top nav on desktop.
- `Escape` key closes the product modal; backdrop click also closes it.
- ARIA labels, `role="dialog"`, `aria-modal` on the modal.
- Lazy-loaded images.
- Smooth SPA tab transitions with a single `active-view` class.

---

## 🛠 Tech Stack

| Layer | Choice |
|-------|--------|
| Markup | Semantic HTML5 |
| Styling | Hand-written CSS (custom properties, no framework) |
| Logic | **Vanilla JavaScript (ES5+), IIFE-scoped, `"use strict"`** |
| Data | Plain JS objects exported to `window.NUTRITRUTH_DATA` |
| Persistence | `localStorage` |
| Fonts | Google Fonts — Plus Jakarta Sans |
| Images | Unsplash (remote URLs) |
| Build | **None** — open the HTML file and it runs |

**Zero dependencies. Zero bundler. Zero backend. Zero login.**

---

## 📁 Project Structure

All files live in a **single flat directory** — the HTML references them by bare filename.



> ⚠️ **Load order matters.** `index.html` must load `data.js` **before** `app.js`, because `app.js` reads `window.NUTRITRUTH_DATA` at initialization:
> ```html
> <script src="data.js"></script>
> <script src="app.js"></script>
> ```

If you reorganize into `js/` and `css/` folders, update the three `<link>` / `<script>` paths in `index.html` accordingly.

---

## 🚀 Getting Started

### Option 1 — Just open it
```bash
# Clone or download, then double-click index.html
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux


nutritruth/
├── index.html # Markup, SPA views, modal, nav
├── style.css # Complete design system & responsive styles
├── data.js # Product DB, swaps matrix, INS dictionary
├── app.js # All application logic (router, rendering, scanner)
└── README.md
