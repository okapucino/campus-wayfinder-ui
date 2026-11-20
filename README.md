# Campus WayFinder — Interactive UI Prototype

Interactive mobile-first UI/UX prototype for **Campus Parking-to-Classroom Navigation** (*Navigasi Rute Kampus: Dari Parkiran ke Ruangan Kelas sesuai Mata Kuliah*), built as a Human-Computer Interaction (HCI) midterm project.

## ✨ Key Features

- **Smart Home & Saved Parking Spot**: Select from multiple campus parking areas, save personal parking spot notes, and see upcoming class reminders at a glance.
- **Interactive 2D Multi-Floor Map (Floors 1–4)**: SVG floor plan with zoom controls, automatic floor switching, animated route paths, clickable room cards, and a real-time walk simulator (`Play / Pause`).
- **Dijkstra Pathfinding & Accessibility Mode**: Calculates shortest walking routes from any parking spot to any classroom/lab, with a **Lift Mode (No Stairs)** toggle that recalculates paths through the campus elevator.
- **Error Recovery ("Tersesat?")**: Quick re-routing from nearby campus landmarks if a student gets disoriented.
- **Schedule & Room Directory**: Grouped by day and floor, including a metacognitive empty-state guide with actionable suggestions.
- **Natural Language Assistant ("Tanya WayFinder")**: Conversational Q&A for finding classes, rooms, or parking recommendations with direct map-routing buttons.
- **Desktop Presentation Inspector**: Side-by-side HCI theory breakdown and 1-click demo scenarios for live presentations.

## 🧠 HCI Principles Applied

- **7 Main HCI Principles**: *Know the User, Understand the Task, Reduce Memory Load (5–9 STM), Strive for Consistency, Remind Users & Refresh Memory, Prevent Errors / Reversal of Action, Naturalness*.
- **5 Interaction Design Principles**: *Visibility, Feedback, Constraints, Consistency, Affordance*.
- **5 Cognitive Processes**: *Attention (grouping & contrast), Perception (familiar icons), Memory (recognize > recall), Language, Metacognition (constructive empty states)*.

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Vite 6**
- **Lucide React** icons

## 🚀 Getting Started

See `requirements.txt` and `package.json` for version details.

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open the local URL shown in the terminal (default: `http://localhost:5173`).

3. **Build for production**:
   ```bash
   npm run build
   ```

## 📁 Project Structure

```text
├── index.html
├── package.json
├── requirements.txt
├── vite.config.ts
└── src/
    ├── App.tsx                                 # Mobile frame + UTS presentation studio
    ├── data/
    │   ├── campusData.ts                       # Editable parking spots, 2D nodes/edges, schedules
    │   └── hciInsights.ts                      # HCI theory inspector metadata
    ├── utils/
    │   └── pathfinder.ts                       # Dijkstra multi-floor & accessible route solver
    └── components/
        ├── CampusMap2D.tsx                     # Interactive 2D SVG floor plan
        └── screens/
            ├── HomeScreen.tsx                  # Saved parking, reminder banner, today's classes
            ├── MapNavigationScreen.tsx         # Turn-by-turn steps, simulator & re-routing
            ├── ScheduleDirectoryScreen.tsx     # Weekly schedule & floor-grouped directory
            └── AssistantScreen.tsx             # Natural language WayFinder chat
```

## ✏️ Customizing Campus Data

All parking areas, 2D map coordinates, floor connections, and class schedules are centralized in `src/data/campusData.ts` for easy customization.
