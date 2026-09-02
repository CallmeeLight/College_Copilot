# College Copilot — Implementation Plan

## Problem
College students struggle with scattered academic info — missed deadlines, classes, announcements. **College Copilot** is a centralized intelligent dashboard that answers: *"Aaj mujhe kya-kya karna hai?"*

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18 + TypeScript | Requested, fast dev |
| Build | Vite | Requested, instant HMR |
| Styling | Tailwind CSS v3 | Requested, rapid premium UI |
| Persistence | localStorage (JSON) | Zero-setup, survives refresh |
| AI Fallback | Local data-driven responses | No API key needed for demo |
| Icons | Lucide React | Clean, modern icon set |
| Notifications | React Hot Toast | Lightweight toast system |
| Calendar | Custom built | No heavy deps |
| Routing | React Router v6 | Standard SPA routing |

---

## Architecture

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Button, Card, Modal, Input, Badge, etc.
│   ├── layout/          # Sidebar, Header, MobileNav
│   └── shared/          # SearchBar, ConfirmDialog, EmptyState
├── pages/               # One file per route
│   ├── Dashboard.tsx
│   ├── Timetable.tsx
│   ├── Assignments.tsx
│   ├── Attendance.tsx
│   ├── Notes.tsx
│   ├── Announcements.tsx
│   ├── Fees.tsx
│   ├── Calendar.tsx
│   ├── Copilot.tsx
│   └── Settings.tsx
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useSearch.ts
├── services/            # Business logic & AI
│   ├── storage.ts       # localStorage CRUD
│   ├── aiAssistant.ts   # Demo AI + future API hook
│   └── analytics.ts     # Day summary, priority calc
├── data/                # Sample/seed data
│   └── sampleData.ts
├── types/               # TypeScript interfaces
│   └── index.ts
├── utils/               # Date helpers, formatters
│   └── helpers.ts
├── App.tsx
├── main.tsx
└── index.css            # Tailwind + glassmorphism tokens
```

---

## Proposed Changes

### Phase 1 — Project Scaffold & Design System

#### [NEW] `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`
Vite + React + TS + Tailwind project scaffold via `npx create-vite`.

#### [NEW] `src/index.css`
Global styles: dark theme, glassmorphism utilities (`.glass-card`, `.glass-sidebar`), gradient backgrounds, custom scrollbar, liquid-glass animations, Tailwind layers.

#### [NEW] `src/components/ui/` — Button, Card, Modal, Input, Select, Badge, ProgressBar, Toggle
Reusable primitives with glass styling, hover micro-interactions, consistent design tokens.

---

### Phase 2 — Layout & Navigation

#### [NEW] `src/components/layout/Sidebar.tsx`
Glass sidebar with nav items (🏠📅✅📊📝📢💰🗓️🤖⚙️), active state highlighting, collapsible on tablet, hidden on mobile.

#### [NEW] `src/components/layout/Header.tsx`
Top bar with global search, greeting, notification bell.

#### [NEW] `src/components/layout/MobileNav.tsx`
Bottom tab bar on mobile (5 key tabs + "More" menu).

#### [NEW] `src/App.tsx`
React Router setup, layout wrapper, theme provider.

---

### Phase 3 — Data Layer & Types

#### [NEW] `src/types/index.ts`
TypeScript interfaces: `Class`, `Assignment`, `AttendanceRecord`, `Note`, `Announcement`, `Fee`, `Settings`, `ChatMessage`.

#### [NEW] `src/services/storage.ts`
Generic localStorage CRUD: `getData<T>()`, `setData<T>()`, `seedIfEmpty()`. All collections keyed by type.

#### [NEW] `src/data/sampleData.ts`
Realistic seed data for Arjun Sharma at SRM University, 1st Semester. ~6 subjects, ~8 assignments, attendance records, notes, announcements, fee entries. Data uses **relative dates** (today, tomorrow, this week) so the demo always looks fresh.

#### [NEW] `src/hooks/useLocalStorage.ts`
React hook wrapping `storage.ts` with state sync and event listeners for cross-tab updates.

---

### Phase 4 — Dashboard (Hero Feature)

#### [NEW] `src/pages/Dashboard.tsx`
- **Greeting** — "Good Morning, Arjun 👋" (time-aware)
- **Today's Overview** — 4 stat cards (classes, pending assignments, upcoming deadlines, attendance warnings)
- **Your Day at a Glance** — timeline of today's classes + priority tasks + attendance alerts + AI recommendation
- **Today's Schedule** — table/cards of today's classes with subject, professor, room, time, status
- **Priority Tasks** — 🔴🟡🟢 categorized task cards
- **Attendance Snapshot** — progress bars per subject with warning badges
- **Upcoming Deadlines** — next 5 deadlines with countdown
- **AI Daily Brief** — glass card with generated summary + "Ask Copilot" button

#### [NEW] `src/services/analytics.ts`
Functions: `getTodayClasses()`, `getPriorityTasks()`, `getAttendanceWarnings()`, `generateDailyBrief()`, `getUpcomingDeadlines()`.

---

### Phase 5 — Feature Pages

#### [NEW] `src/pages/Timetable.tsx`
- Daily/Weekly toggle view
- Add/Edit/Delete class modal
- Day selector tabs
- Today's classes highlighted
- Fields: subject, professor, room, day, startTime, endTime

#### [NEW] `src/pages/Assignments.tsx`
- Card grid of assignments
- Add/Edit/Delete with modal form
- Status badges (Pending/In Progress/Completed)
- Priority badges (🔴🟡🟢)
- Filter by subject & status
- Sort by deadline
- Overdue assignments highlighted in red
- Mark complete with one click

#### [NEW] `src/pages/Attendance.tsx`
- Subject-wise attendance cards
- Progress ring/bar per subject
- Record attendance (Present/Absent) buttons
- Warning badges below threshold
- Projection calculator: "Attend next N classes → X%"
- Add/manage subjects

#### [NEW] `src/pages/Notes.tsx`
- Grid/list of note cards
- Create/Edit/Delete
- Pin important notes (pinned at top)
- Search within notes
- Filter by subject
- Basic markdown-like formatting (bold, lists)
- Rich text area

#### [NEW] `src/pages/Announcements.tsx`
- List of announcement cards
- Add/Delete
- Categories: Academic, Exam, Event, General, Urgent
- Read/Unread toggle with visual indicator
- Category filter tabs
- Unread count badge

#### [NEW] `src/pages/Fees.tsx`
- Fee cards with amount, type, due date, status
- Add/Edit/Delete
- Status: Paid / Unpaid / Overdue
- Upcoming fee deadlines highlighted
- No real payments — tracking only

#### [NEW] `src/pages/Calendar.tsx`
- Monthly calendar grid
- Color-coded dots: classes (blue), assignments (orange), exams (red), fees (green)
- Click day to see detail panel
- Navigate months
- Today highlighted

#### [NEW] `src/pages/Settings.tsx`
- Student name, college, semester
- Attendance warning threshold (slider, default 75%)
- Theme preference toggle (dark default)
- Save to localStorage with toast confirmation

---

### Phase 6 — AI Copilot

#### [NEW] `src/pages/Copilot.tsx`
Beautiful chat interface with:
- Message bubbles (user vs AI)
- Typing indicator animation
- "Ask Copilot" input with send button
- Suggested questions as chips
- Scrollable chat history

#### [NEW] `src/services/aiAssistant.ts`
- **Demo mode**: Pattern-match user questions against keywords, generate responses from stored data
  - "what do i have today" → list today's classes
  - "assignment due" → next upcoming assignment
  - "low attendance" → subjects below threshold
  - "prioritize" → priority-ranked tasks
  - "tomorrow" → tomorrow's schedule
  - "exam" → upcoming exams/deadlines
- **API mode**: Structured so an OpenAI/Gemini key in `.env` can be plugged in with minimal changes
- System prompt includes serialized student data for context

---

### Phase 7 — Global Features

#### [NEW] `src/components/shared/SearchBar.tsx` + `src/hooks/useSearch.ts`
Global search across all data types. Results grouped by category with click-to-navigate.

#### [NEW] `src/components/shared/ConfirmDialog.tsx`
Modal confirmation for delete actions.

#### [NEW] `src/components/shared/EmptyState.tsx`
Friendly empty state illustrations with "Add your first..." CTAs.

---

### Phase 8 — Polish & Animations

- CSS transitions on page/card mount (fade-in, slide-up)
- Hover scale effects on cards
- Skeleton loading states
- Smooth sidebar collapse animation
- Liquid glass background animation (subtle moving gradient)
- Toast notifications (react-hot-toast)
- Form validation with inline errors
- Focus rings for keyboard nav

---

## Open Questions

> [!IMPORTANT]
> **Tailwind CSS version**: You requested Tailwind CSS. I'll use **Tailwind CSS v3** (stable, well-supported). Let me know if you prefer v4.

> [!NOTE]
> **Font choice**: I plan to use **Inter** from Google Fonts for clean, modern typography. Any preference?

> [!NOTE]
> **Color palette**: I'll use a deep indigo/violet dark theme with cyan/teal accents for the liquid-glass feel. Does that align with your vision, or do you prefer different accent colors?

---

## Verification Plan

### Automated
```bash
npm run build          # TypeScript compilation + production build (zero errors)
npm run dev            # Dev server runs without console errors
```

### Manual Testing Checklist
- [ ] All 10 nav items route correctly
- [ ] CRUD operations work on: Classes, Assignments, Notes, Announcements, Fees
- [ ] Attendance recording updates percentages correctly
- [ ] Attendance projection math is accurate
- [ ] Data persists across page refresh (localStorage)
- [ ] Dashboard dynamically reflects current data
- [ ] AI Copilot responds to all listed question types
- [ ] Global search returns results from all categories
- [ ] Calendar shows events from all sources
- [ ] Mobile layout: sidebar collapses, bottom nav appears
- [ ] Empty states show when data is cleared
- [ ] Delete confirmations work
- [ ] Toast notifications appear for actions
- [ ] No console errors

---

## Development Order

1. **Scaffold** — Vite + React + TS + Tailwind + Router + dependencies
2. **Design system** — `index.css` + UI components (Card, Button, Modal, Input, Badge, ProgressBar)
3. **Layout** — Sidebar + Header + MobileNav + App shell with routing
4. **Data layer** — Types + storage service + sample data + hooks
5. **Dashboard** — The hero page with all widgets
6. **Timetable** — CRUD + daily/weekly views
7. **Assignments** — CRUD + filters + sorting
8. **Attendance** — Recording + projections + warnings
9. **Notes** — CRUD + search + pin
10. **Announcements** — CRUD + categories + read/unread
11. **Fees** — CRUD + reminders
12. **Calendar** — Monthly view with event integration
13. **Copilot** — Chat UI + demo AI engine
14. **Settings** — Preferences + persistence
15. **Global search** — Cross-data search
16. **Polish** — Animations, loading states, error states, responsive fixes
17. **Testing** — Full walkthrough, bug fixes, console cleanup
