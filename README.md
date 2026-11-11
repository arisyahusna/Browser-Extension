# AIFA Browser Extension — Interactive Client Mockup (Stage 1)

This project is a high-fidelity, client-facing web simulation of a Google Chrome desktop browser displaying an independent Malaysian news portal (**Malaysia News Daily**), integrated with the upcoming **AIFA (AI Fact-Checking Assistant)** browser extension (associated with **Sebenarnya.my**).

> **Important**: This is a standalone interactive simulation prototype designed for client demonstrations. It runs entirely locally with zero external AI or backend dependencies.

---

## Stage 1 Implementation Overview

### 1. Full-Screen Chrome Desktop Simulation
- **Full Viewport**: Spans 100% of the viewport width and height (`w-screen h-screen overflow-hidden`) without fake device bezels or floating window frames.
- **Layer 1 — Browser Tab Bar**:
  - Chrome window traffic light controls.
  - Active and inactive tab styling with favicon, title, and tab close buttons.
  - Add tab button (`+`) to open new simulated browser sessions.
  - Multi-tab management where each tab maintains its own navigation history stack.
- **Layer 2 — Browser Navigation & Extension Toolbar**:
  - History navigation buttons (**Back** & **Forward**) with active/disabled state tracking.
  - **Refresh** button with simulated page reload and loading indicator.
  - Omnibox / address bar with secure connection lock icon and fictional domain (`https://www.malaysianews-demo.my/`).
  - Chrome extensions puzzle icon.
  - **AIFA Extension Icon**: Minimal red shield-check icon (`#D93043`) with notification badge.
  - **AIFA Placeholder Popup**: Polished dropdown panel displaying extension identity, version, and association with **Sebenarnya.my** ("Extension interface coming in Stage 5.").
- **Layer 3 — Website Content Area**:
  - Independent vertical scrolling below the fixed browser navigation bars.
  - Scroll reset on route and tab changes.

### 2. "Malaysia News Daily" Portal Design
- **Header & Masthead**:
  - Elegant serif masthead, current Malaysian date, regional weather/edition indicator.
  - Category navigation (**Home**, **Malaysia**, **World**, **Politics**, **Business**, **Technology**, **Lifestyle**).
  - Quick search toggle.
- **Homepage**:
  - Prominent lead story featuring the unverified RM500 annual levy claim.
  - Grid of secondary stories with category tags, editorial photography, and timestamps.
  - Trending news sidebar with ranked metrics (1–5).
  - Editorial verification advisory box.
- **Sample Articles (Fully Navigable)**:
  1. **Article 1 (Public Announcement)**: *"Viral RM500 Annual Payment Claim Sparks Questions Among Malaysians"* (discusses the unverified viral claim without invented quotes or fake authority statements).
  2. **Article 2 (Technology)**: *"Malaysia's Digital Economy Sees Growing Interest in AI-Powered Services"*.
  3. **Article 3 (Online Safety)**: *"Experts Encourage Malaysians to Verify Information Before Sharing Online"*.
- **Structured Footer**:
  - Editorial bureaus, journalistic guidelines, and clear prototype disclaimer indicating the fictional demonstration nature of the content.

### 3. Semantic Preparation for Stage 2
- Each article is wrapped in a dedicated semantic container:
  ```html
  <article id="art-rm500-claim" data-aifa-detectable="true" data-article-id="..." data-article-slug="...">
    <span data-aifa-role="category">...</span>
    <h1 data-aifa-role="headline">...</h1>
    <p data-aifa-role="summary">...</p>
    <div data-aifa-role="byline">...</div>
    <figure data-aifa-role="featured-media">...</figure>
    <div data-aifa-role="body">
      <p id="claim-para-1" data-paragraph-id="claim-para-1">...</p>
      <h2 id="claim-sub-1" data-paragraph-id="claim-sub-1">...</h2>
      ...
    </div>
  </article>
  ```
- All navigation, sidebars, related stories, and sharing buttons are placed **outside** the detectable article container.
- Paragraphs and subheadings feature stable IDs to support claim-level highlighting in Stage 2.

---

## Project Structure

```
├── src/
│   ├── types/
│   │   ├── browser.ts                # Tab, PageLocation, and BrowserContext state types
│   │   └── news.ts                   # Article, paragraph, and trending item definitions
│   ├── data/
│   │   └── mockArticles.ts           # 3 required sample articles + secondary & trending items
│   ├── context/
│   │   └── BrowserContext.tsx        # Tab management, per-tab history stacks, URL state
│   ├── components/
│   │   ├── browser/
│   │   │   ├── BrowserShell.tsx      # Full-screen desktop container (Layers 1, 2, 3)
│   │   │   ├── BrowserTabBar.tsx     # Window controls, tabs, new tab, tab closing
│   │   │   ├── BrowserToolbar.tsx    # Back/forward, refresh, omnibox, extensions bar
│   │   │   └── BrowserContent.tsx    # Independent scrollable viewport with route dispatcher
│   │   ├── aifa/
│   │   │   ├── AIFAExtensionIcon.tsx # Minimal red shield-check icon with badge
│   │   │   └── AIFAPopupPlaceholder.tsx # Polished extension popup
│   │   └── news/
│   │       ├── NewsHeader.tsx        # Masthead, date, categories, search
│   │       ├── NewsHomepage.tsx      # Lead story, secondary grid, trending sidebar
│   │       ├── NewsArticlePage.tsx   # Semantic <article data-aifa-detectable="true"> page
│   │       ├── NewsCategoryPage.tsx  # Category filtered views & placeholders
│   │       └── NewsFooter.tsx        # Editorial footer & prototype disclaimer
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                     # Tailwind styling & native scrollbars
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Running the Application Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the local development server**:
   ```bash
   npm run dev
   ```
3. **Build for production**:
   ```bash
   npm run build
   ```

