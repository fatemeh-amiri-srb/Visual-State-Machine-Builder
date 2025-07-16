# 🧠 Visual State Machine Builder

A visual editor for building finite state machines using drag-and-drop interactions. Built with **Next.js 14 (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

---

## 🚀 Features

* 📦 Add and position **state nodes** interactively
* 🔁 Create **connections (transitions)** between states
* 🧭 Export as clean, structured **JSON** for further use
* 🔗 Share your entire state machine via **encoded URL**
* 💾 Automatic **localStorage persistence**
* ↩️ Undo / Redo support
* 🧹 Clear all states and connections with confirmation

---

## 🛠️ Technologies Used

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| **Next.js 14**   | App router, SSR/CSR     |
| **React**        | Interactive UI          |
| **TypeScript**   | Type safety             |
| **Tailwind CSS** | Utility-first styling   |
| **Zustand**      | Global state management |
| **uuid**         | Unique ID generation    |

---

## 📁 Project Structure (Simplified)

```
/components
  └── Canvas.tsx        # Main editor UI
  └── Node.tsx          # State node component
/store
  └── useEditorStore.ts # Zustand store for nodes and transitions
```

---

## 🧑‍💻 How It Works

### Add a State

Click `Add State` to insert a new node in the canvas.

### Create Transitions

Drag from one node to another (in full version) or define via code to connect two states.

### Export

Click `Export JSON` to generate a structured JSON format like this:

```json
{
  "Idle": {
    "on": {
      "start": "Running"
    }
  },
  "Running": {
    "on": {
      "stop": "Idle"
    }
  }
}
```

### Share

Click `Share Link` to copy a URL with base64-encoded machine data.

### Persistent Storage

Uses `localStorage` to automatically save and restore your last graph.

### Clear All

Deletes all nodes and connections after confirmation.

### Undo/Redo

Step through the history of edits using `Undo` and `Redo` buttons.

---

## ✨ Possible Improvements

* 📝 Edit transition labels and state names inline
* 🧲 Snap-to-grid for better layout control
* 💡 Visual connection creator (drag from node to node)
* 📷 Export to image or SVG
* ☁️ Collaboration (multi-user editing)
* 🔍 Mini-map or zoom support

---

## 🧪 Tests

Tests are not included yet — but would be ideally written with **Jest** and **React Testing Library**.

---

## 📬 Contact

Created by \Fatemeh Amiri. Connect on https://www.linkedin.com/in/fatemeh-amiri-srb
