The **WEMBA 51 Pathway Planner** is a comprehensive curriculum planning tool designed specifically for Wharton Executive MBA (WEMBA) students. It empowers students to navigate the complexities of the WEMBA curriculum, explore potential majors, and build a customized academic pathway to meet the 19.0 CU graduation requirements.

Built with a focus on simplicity and interactivity, the planner handles the heavy lifting of prerequisite validation and schedule conflict detection, allowing students to focus on their academic goals.

---

## 🚀 Key Features

### 🎓 Personalized Cohort Experience
Select your specific cohort—**Philadelphia**, **San Francisco**, or **Global**—to see tailored course offerings, schedules, and specific graduation requirements unique to your location.

### 🗺️ Interactive Graph Builder
Visualize your entire academic journey with an interactive SVG-based graph.
- **Drag-and-Drop:** Move courses between terms to see how they fit into your schedule.
- **Dependency Mapping:** Visual arrows indicate prerequisites (blue) and courses unlocked by core requirements (green).
- **Conflict Highlighting:** Instant visual feedback when courses overlap in the same schedule slot.

### 📊 Dashboard & Progress Tracking
Stay on top of your academic progress with a central dashboard:
- **CU Counter:** Real-time calculation of Core and Elective Credits (target: 19.0 CU).
- **Major Eligibility:** Track your progress toward specific majors (e.g., Finance, Management, Marketing) and see exactly which requirements are remaining.
- **Finance Decision Support:** Specialized handling for the Term 3 finance choice (FNCE 6110 vs. 6210).

### 🔍 Course Explorer
Browse the complete WEMBA elective catalog by department or by major. Detailed course descriptions, professors, and term availability are all at your fingertips.

### ⚠️ Intelligent Validation
- **Prerequisite Engine:** Automatically checks if you've met the necessary requirements before adding an elective.
- **Slot-Based Conflict Detection:** Uses Wharton's slot system (A, B, C) to identify real schedule conflicts while allowing non-overlapping weekend courses.

---

## 🛠️ Tech Stack

This project is built using modern web standards without the overhead of heavy frameworks or build tools, ensuring high performance and ease of deployment.

- **Frontend:** HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6+)
- **Visualization:** SVG (Scalable Vector Graphics) for the interactive graph.
- **State Management:** LocalStorage-persisted global state.
- **Testing:** Playwright for End-to-End (E2E) testing.
- **Deployment:** Vercel.

- ## 📂 Project Structure

```text
├── index.html          # Main entry point and DOM structure
├── app.js              # Core logic: state management, validation, and view updates
├── router.js           # Hash-based routing and navigation guards
├── pathway-graph.js    # PathwayGraph class for SVG visualization
├── data.js             # Static curriculum data (courses, cohorts, schedules)
├── styles.css          # Modern, responsive UI styling
├── tests/              # Playwright E2E test suites
└── docs/               # Feature design documents and plans
```

---

## 🏛️ Architecture Overview

The application follows a **State-View-Update** pattern:
1.  **State:** A single global object (persisted to `localStorage`) tracks the selected cohort, planned courses, and target majors.
2.  **Update:** User actions trigger state changes which are validated against the curriculum data in `data.js`.
3.  **View:** Functional components in `app.js` and `pathway-graph.js` reactively update the DOM/SVG whenever the state changes.

---

## 📄 License

This project is licensed under the MIT License - see the [package.json](package.json) file for details.

---

*Note: This tool is an unofficial planning aid and should be used in conjunction with official Wharton academic advising resources.*
