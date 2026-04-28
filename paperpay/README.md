# PaperPay: The Fintech Sketchbook Dashboard

Welcome to **PaperPay**, a unique fintech dashboard designed with a "sketchbook" aesthetic. This project combines high-end financial functionality with a hand-drawn, organic visual style that stands out from typical flat UI designs.

## 🚀 Programming Languages Used

### 1. **Frontend: TypeScript & React (Next.js)**
- **Why?**: We used TypeScript for **type safety**, which is critical for a fintech app where handling currency and transaction data requires precision. **Next.js** was chosen for its powerful routing, server-side rendering (for SEO), and seamless developer experience.

### 2. **Backend: Java (Spring Boot)**
- **Why?**: Java is the industry standard for **fintech and banking**. It offers robust security, multi-threading capabilities for high-concurrency transactions, and a mature ecosystem (Spring Boot) that ensures scalability and reliability.

### 3. **Styling: Tailwind CSS**
- **Why?**: Tailwind allowed us to build a **completely custom design system** (wobbly borders, ink colors, and paper textures) without writing thousands of lines of manual CSS. It provides the utility classes needed to achieve the "sketch" look efficiently.

---

## 🎨 How the 3D Animations Work

The "3D" feel of PaperPay isn't just about depth—it's about making the UI feel like physical objects on a desk.

### **1. Framer Motion Integration**
We use `framer-motion` to handle smooth physical transitions. 
- **Spring Physics**: Instead of rigid linear animations, we use "spring" transitions (`stiffness: 300`) to make cards feel like they have weight.
- **Hover Effects**: When you hover over a card, it doesn't just change color; it lifts up (`y: -4`) and tilts slightly, mimicking the movement of a real piece of paper.

### **2. CSS 3D Transforms**
Every card has a slight random rotation (e.g., `rotate: -1.5deg`). This breaks the "perfect grid" of a computer and creates a natural, layered 3D appearance.
- **Wobbly Borders**: We use complex `border-radius` (e.g., `255px 15px 225px 15px / 15px 225px 15px 255px`) to simulate hand-cut paper edges.

### **3. Thick Block Shadows**
Unlike soft "web" shadows, we use **solid block shadows** (e.g., `5px 5px 0px #1A1611`). This creates a "Paper Cutout" or "Pop-up Book" effect, giving the interface distinct layers of depth.

---

## 📂 Program Codes & Key Functions

Below is a breakdown of the core files and their most important functions:

### **Frontend Components (`/components`)**

#### **1. `PaperCard.tsx`**
The foundational component for all UI containers.
- **Key Function**: `PaperCard({ children, rotate, shadow, hasTape })`
- **Purpose**: Wraps content in a "paper" container with organic borders, rotation, and optional decorations like tape or clips.

#### **2. `WalletCard.tsx`**
The heart of the dashboard's balance management.
- **Key Function**: `useEffect()` for counter animation.
- **Logic**: It fetches the balance from the API and "counts up" the numbers visually using an interval timer to create a premium feel.

#### **3. `SVGDecorations.tsx`**
A library of hand-drawn SVG elements.
- **Important Parts**: `TapeStrip`, `PaperClip`, `CircleHighlight`.
- **Purpose**: Provides the "physical" items that hold the papers together, adding to the 3D layered realism.

#### **4. `SketchButton.tsx`**
A custom button component.
- **Key Logic**: Uses `whileTap={{ scale: 0.95 }}` for tactile feedback and `btn-wobbly` classes for the hand-drawn look.

### **Application Logic (`/app`)**

#### **1. `page.tsx` (Dashboard Home)**
The main entry point for the user.
- **Logic**: Orchestrates the layout of the `WalletCard`, `SpendingSummary`, and `RecentTransactions`, ensuring they all fit the sketchbook theme.

#### **2. `send-money/page.tsx`**
Handles the transaction flow.
- **Key Logic**: Integration with the `react-hook-form` and `zod` for validating amount inputs and recipient IDs before sending to the backend.

### **Backend (`/paperpay-backend`)**

#### **1. `TransactionController.java`**
- **Important Functions**: `processPayment()`, `getTransactionHistory()`.
- **Purpose**: Manages the core business logic of moving money between accounts and ensuring ACID compliance.

#### **2. `WalletService.java`**
- **Key Logic**: `calculateBalance()`.
- **Purpose**: Handles the mathematical operations for wallet balances, ensuring no "double-spending" occurs.

---

## 🛠️ Important Helper Functions

- **`cn(...)`**: A utility in `lib/utils.ts` that merges Tailwind classes. This is crucial for dynamically changing card styles (like changing a sticky note from yellow to pink).
- **`toLocaleString('en-IN')`**: Used throughout the app to format currency specifically for the Indian Rupee (₹) format.
- **`whileHover` / `whileTap`**: Framer Motion props used in every interactive element to provide "micro-interactions" that make the app feel alive.
