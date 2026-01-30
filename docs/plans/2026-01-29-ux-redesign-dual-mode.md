# UX Redesign: Dual-Mode SPA with Shared Progress Drawer

**Date:** 2026-01-29
**Status:** Approved
**Goal:** Reduce navigation from 5 views to 2 modes + drawer, optimized for iOS

---

## Executive Summary

Transform the WEMBA Pathway Planner from a 5-view application into a streamlined 2-mode experience:
- **Explore Mode:** Immersive course and major discovery
- **Build Mode:** Interactive graph-based course planning
- **Progress Drawer:** Shared graduation tracking, accessible from both modes

### Key Metrics
| Before | After |
|--------|-------|
| 5 views | 2 modes + drawer |
| 2-3 taps to any feature | 1 tap max |
| Top navigation tabs | Bottom tab bar (iOS) / Sidebar (desktop) |
| Dashboard as separate page | Progress always accessible via drawer |
| Full-page cohort selection | One-time modal |

---

## Architecture

### App Shell Structure

```
┌─────────────────────────────────────────┐
│  Status Bar (iOS) / Browser Chrome      │
├─────────────────────────────────────────┤
│                                         │
│           MAIN CONTENT AREA             │
│      (Explore Mode OR Build Mode)       │
│                                         │
├─────────────────────────────────────────┤
│  ┌─────────────┬─────────────┐          │
│  │ 📚 Explore  │  🔧 Build   │  ← iOS   │
│  └─────────────┴─────────────┘          │
└─────────────────────────────────────────┘
         ↑
    Progress drawer slides up from here
```

### State Model

```javascript
let state = {
  // Existing (keep)
  selectedCohort: 'philadelphia' | 'san_francisco' | 'global' | null,
  plannedCourses: [],
  completedBlockCourses: [],
  financeChoice: null,
  targetMajors: [],
  waivedCourses: [],

  // Modified
  currentView: 'explore' | 'build',  // Simplified from 4 options

  // New
  hasCompletedOnboarding: boolean,
  progressDrawerOpen: boolean,
  progressDrawerHeight: 'collapsed' | 'partial' | 'full',

  // Removed (no longer needed)
  // explorerMode - always show majors first, departments via filter
  // selectedMajor - handled by navigation within Explore
  // selectedDepartment - handled by navigation within Explore
};
```

---

## View Specifications

### 1. First-Run Onboarding (Modal)

**Trigger:** `!state.hasCompletedOnboarding`

**Screen 1: Cohort Selection**
- Full-screen modal overlay
- Three cohort cards: Philadelphia, San Francisco, Global
- Each shows: name, format (In-Person/Virtual), short code
- Tap to select

**Screen 2: Confirmation**
- Shows selected cohort
- "Your core curriculum is loaded"
- Primary CTA: "Start Exploring"
- Secondary: "or jump to Build"
- Sets `hasCompletedOnboarding: true`

**After Onboarding:**
- Modal never shows again
- Cohort changeable via Settings in Progress Drawer

---

### 2. Explore Mode

**Purpose:** Deep research into courses and majors without planning distractions

**Layout (Mobile):**
```
┌─────────────────────────────────────────┐
│ 🔍 Search courses, majors...            │ ← Sticky search bar
├─────────────────────────────────────────┤
│  [Majors] ─────────── [Departments]     │ ← Segmented control
├─────────────────────────────────────────┤
│                                         │
│  SCROLLABLE CONTENT                     │
│                                         │
│  Major/Department Cards with:           │
│  - Name, CU requirement                 │
│  - Course count                         │
│  - Progress chips (if targeted)         │
│  - STEM certified badge                 │
│                                         │
├─────────────────────────────────────────┤
│  [📚 Explore ●]  [🔧 Build]             │ ← Bottom tabs
└─────────────────────────────────────────┘
```

**Major Card Component:**
```
┌─────────────────────────────────────────┐
│ 💼 Finance                       6.0 CU │
│ STEM Certified • 12 elective courses    │
│ ┌───────┐ ┌───────┐ ┌───────┐          │
│ │+2.0 CU│ │ 4/6   │ │ ★ Tgt │          │ ← Only if targeted
│ │in plan│ │ done  │ │       │          │
│ └───────┘ └───────┘ └───────┘          │
└─────────────────────────────────────────┘
```

**Major Detail View (tap to expand):**
- Full description
- Requirements breakdown
- Course list with status indicators:
  - ✓ In Plan (green)
  - 🔒 Locked (gray) - prerequisites not met
  - ○ Available (blue outline)
- "Set as Target Major" toggle
- Warnings/restrictions

**Course Detail Sheet (slide up):**
```
┌─────────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ← Drag handle
├─────────────────────────────────────────┤
│ FNCE 7050                        1.0 CU │
│ Investment Management                   │
├─────────────────────────────────────────┤
│ Term: T5 • Slot A                       │
│ Professor: Christopher Geczy            │
├─────────────────────────────────────────┤
│ Description text...                     │
├─────────────────────────────────────────┤
│ PREREQUISITES                           │
│ ✓ FNCE 6110 (in core)                  │
├─────────────────────────────────────────┤
│ COUNTS TOWARD                           │
│ Finance, Quantitative Finance           │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │         ＋ Add to Plan              │ │ ← Primary CTA
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Search Behavior:**
- Searches across major names, course codes, course titles
- Results grouped: Majors first, then Courses
- Tap result to navigate to detail

---

### 3. Build Mode (Graph)

**Purpose:** Visual, interactive course planning with full prerequisite/conflict context

**Layout (Mobile):**
```
┌─────────────────────────────────────────┐
│ [14.5/19 CU ▼]     PHL     [⚙ Filter]  │ ← Compact header
├─────────────────────────────────────────┤
│                                         │
│  Horizontally scrollable graph canvas   │
│                                         │
│   T1    T2    T3    T4    T5    T6      │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐  │
│  │▓▓▓│ │▓▓▓│ │▓▓▓│ │   │ │   │ │   │  │
│  │COR│ │COR│ │COR│ │   │ │   │ │   │  │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘  │
│         ↑                              │
│    Prerequisite arrows                 │
│                                         │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │         ＋ Add Course               │ │ ← Opens catalog sheet
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  [📚 Explore]  [🔧 Build ●]            │
└─────────────────────────────────────────┘
```

**Graph Header:**
- Left: CU counter (tappable → opens Progress Drawer)
- Center: Cohort badge
- Right: Filter button (major filtering modes)

**Graph Canvas:**
- Terms as columns (T1-T6 + BW)
- Core courses (T1-T3): muted colors, no remove button
- Elective courses (T4-T6, BW): vibrant, interactive
- Prerequisite arrows: blue, animated on selection
- Conflict indicators: red glow, pulse animation

**Course Node (Graph):**
```
┌──────────────────────┐
│█│ FNCE 7050    T5   │  ← Dept color bar, term badge
│ │ Investment Mgmt   │
│ │ 1.0 CU        [×] │  ← Credits, remove button (electives only)
│ │ ✓ Ready          │  ← Status badge
└──────────────────────┘
```

**Node Status Badges:**
- "✓ Ready" - prerequisites met
- "⚠ Missing prereq" - warning
- "⚡ Conflict" - schedule conflict
- "🔒 Core" - core curriculum (can't remove)

**Tap Node → Course Detail Sheet:**
- Same as Explore mode, but with:
- "Remove from Plan" instead of "Add to Plan"
- Highlighted prerequisite chain in graph

**"+ Add Course" → Catalog Sheet:**
```
┌─────────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
├─────────────────────────────────────────┤
│ ADD COURSE                    [× Close] │
├─────────────────────────────────────────┤
│ 🔍 Search available courses...          │
├─────────────────────────────────────────┤
│ [By Term ▼]  [By Major ▼]              │ ← Filter controls
├─────────────────────────────────────────┤
│ TERM 4 (3 available)                    │
│ ┌─────────────────────────────────────┐ │
│ │ FNCE 7050 • Investment Mgmt • 1.0  [+]│
│ │ MGMT 8010 • Leading Teams   • 0.5  [+]│
│ │ MKTG 7120 • Digital Marketing• 1.0 [🔒]│ ← Locked (prereqs)
│ └─────────────────────────────────────┘ │
│ TERM 5 (5 available)                    │
│ ...                                     │
└─────────────────────────────────────────┘
```

**Gestures (iOS):**
- Pinch: Zoom in/out (0.5x - 2.0x)
- Two-finger drag: Pan canvas
- Tap node: Select, show details
- Long-press node: Quick action menu (remove, info)

---

### 4. Progress Drawer

**Purpose:** Graduation tracking, major progress, alerts - always accessible

**Trigger:** Tap CU indicator in header, or swipe up from bottom edge

**States:**
1. **Collapsed:** Hidden, only CU indicator visible in header
2. **Partial:** Shows graduation bar + alert count
3. **Full:** Complete progress view + settings

**Full Layout:**
```
┌─────────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ← Drag handle
├─────────────────────────────────────────┤
│ GRADUATION PROGRESS                     │
│ ████████████████████░░░░░░  14.5/19 CU │
│ ──────────────────────────────────────  │
│ Core Curriculum     9.5 CU    ✓        │
│ Electives          5.0 CU    (need 4.5)│
│ Block Weeks        0.0 CU    (need 1.0)│
├─────────────────────────────────────────┤
│ TARGET MAJORS                    [Edit] │
│ ┌─────────────────────────────────────┐ │
│ │ 💼 Finance              4.0/6.0 CU  │ │
│ │ ████████████░░░░░░░░          67%   │ │
│ │ Need: FNCE 7030, FNCE 7050          │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🤖 AI for Business      2.0/4.0 CU  │ │
│ │ ████████░░░░░░░░░░░░          50%   │ │
│ └─────────────────────────────────────┘ │
│ [+ Add Target Major]                    │
├─────────────────────────────────────────┤
│ ALERTS                            3 ⚠️  │
│ ┌─────────────────────────────────────┐ │
│ │ ⚠️ FNCE 7050: missing prereq         │ │
│ │ ⚡ MGMT 8010 conflicts with MKTG 7120│ │
│ │ ℹ️ Consider FNCE 6110 for Finance    │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ [⚙ Settings]          [📤 Export Plan] │
└─────────────────────────────────────────┘
```

**Alert Actions:**
- Tap alert → Jump to relevant course in Build mode
- Swipe alert → Dismiss (for info-level only)

**Settings (in drawer):**
- Change cohort (confirms data reset)
- Finance choice (FNCE 6110 vs 6210)
- Clear all electives
- Reset app (full reset)

---

### 5. Desktop Layout (≥1024px)

**Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  WEMBA Pathway Planner          [14.5/19 CU]  PHL  [⚙ Settings] │
├────────────┬─────────────────────────────────────────────────────┤
│            │                                                     │
│  📚 Explore│                                                     │
│     ●      │                                                     │
│  🔧 Build  │              MAIN CONTENT AREA                      │
│            │                                                     │
│ ────────── │         (Full width for active mode)                │
│            │                                                     │
│ PROGRESS   │                                                     │
│ ████░ 76%  │                                                     │
│            │                                                     │
│ Finance    │                                                     │
│ ███░░ 67%  │                                                     │
│            │                                                     │
│ ⚠️ 3 alerts │                                                     │
│            │                                                     │
└────────────┴─────────────────────────────────────────────────────┘
```

**Desktop Differences:**
- Left sidebar: Navigation + inline progress summary
- No bottom tabs
- Progress details expand in sidebar (click to expand section)
- Graph can show right-side panel for course details
- Hover states on all interactive elements
- Keyboard shortcuts: E (Explore), B (Build), / (Search), Esc (close sheets)

---

## Component Inventory

### New Components

| Component | Description |
|-----------|-------------|
| `BottomTabBar` | iOS-style bottom navigation |
| `ProgressDrawer` | Slide-up progress panel with gesture handling |
| `OnboardingModal` | First-run cohort selection flow |
| `CourseSheet` | Bottom sheet for course details |
| `CatalogSheet` | Bottom sheet for adding courses in Build mode |
| `MajorCard` | Enhanced card with inline progress |
| `GraphHeader` | Compact header for Build mode |
| `DesktopSidebar` | Left navigation panel for desktop |
| `SegmentedControl` | iOS-style toggle (Majors/Departments) |
| `AlertItem` | Tappable alert row with action |

### Modified Components

| Component | Changes |
|-----------|---------|
| `PathwayGraph` | Mobile-first layout, horizontal scroll, gesture zoom |
| `CourseCatalog` | Now a sheet instead of sidebar |
| `CourseModal` | Convert to bottom sheet pattern |

### Removed Components

| Component | Replacement |
|-----------|-------------|
| Dashboard view | Progress Drawer |
| Pathway view | Build mode (Graph) |
| TopNavTabs | Bottom tabs (mobile) / Sidebar (desktop) |
| CohortSelectionPage | Onboarding modal |

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Create new state model
- [ ] Implement BottomTabBar component
- [ ] Implement basic view switching (Explore/Build)
- [ ] Hide old navigation, Dashboard, Pathway views

### Phase 2: Progress Drawer
- [ ] Create ProgressDrawer component
- [ ] Implement drag gesture handling
- [ ] Move Dashboard content into drawer
- [ ] Add CU indicator tap trigger

### Phase 3: Explore Mode
- [ ] Enhance MajorCard with progress chips
- [ ] Create CourseSheet (bottom sheet)
- [ ] Implement "Add to Plan" flow
- [ ] Add search functionality

### Phase 4: Build Mode
- [ ] Create GraphHeader component
- [ ] Create CatalogSheet for adding courses
- [ ] Implement mobile-first graph layout
- [ ] Add pinch-to-zoom gestures

### Phase 5: Onboarding
- [ ] Create OnboardingModal
- [ ] Implement first-run detection
- [ ] Add cohort change to Settings

### Phase 6: Desktop Adaptations
- [ ] Create DesktopSidebar
- [ ] Implement responsive breakpoint handling
- [ ] Add keyboard shortcuts
- [ ] Polish hover states

### Phase 7: Polish
- [ ] Animations and transitions
- [ ] Edge cases and error states
- [ ] Performance optimization
- [ ] Accessibility audit

---

## Success Criteria

1. **Navigation:** Maximum 1 tap to reach any feature
2. **Discoverability:** New users can start planning within 30 seconds
3. **iOS Feel:** Passes "feels native" test on iPhone
4. **Desktop Parity:** Full functionality on desktop with appropriate adaptations
5. **Performance:** No jank on 60fps animations
6. **Accessibility:** VoiceOver compatible, keyboard navigable

---

## Appendix: Removed Features

Features intentionally removed or simplified:

1. **Pathway Timeline View** - Redundant with Graph; visual timeline wasn't adding value over graph view
2. **Dashboard as Page** - All information now in Progress Drawer
3. **Top Tab Navigation** - Replaced with bottom tabs (mobile) and sidebar (desktop)
4. **Explorer Mode Toggle** - Simplified; departments accessible via filter in Explore
5. **Multiple Entry Points for Same Action** - Consolidated to single, consistent patterns
