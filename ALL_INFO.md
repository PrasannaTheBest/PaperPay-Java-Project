# ALL_INFO.md - Project Complete Understanding Guide

## Project Title: Digital Payment and Personal Expense Tracking System (PaperPay)

---

## 📂 Project Structure & File Analysis

### 🖥️ Backend Analysis (`/paperpay-backend`)

#### **Package: `com.paperpay.entity`**
*These files represent the database tables and the core data models of the system.*

1.  **User.java**
    *   **Path**: `src/main/java/com/paperpay/entity/User.java`
    *   **Language**: Java
    *   **Why**: Stores identity information for everyone using the platform.
    *   **Role**: Primary entity for authentication and profile management.
    *   **Logic**: Uses JPA annotations to map to the `users` table.
    *   **Functions**: `preUpdate()` to track timestamps.
    *   **Input**: Email, Password, Name, Role (USER/ADMIN).
    *   **Output**: User object with unique ID and timestamps.
    *   **Connected**: `UserRepository`, `AuthService`, `Transaction`, `Wallet`.

2.  **Wallet.java**
    *   **Path**: `src/main/java/com/paperpay/entity/Wallet.java`
    *   **Language**: Java
    *   **Why**: Tracks the digital money balance for each user.
    *   **Role**: Financial account representation.
    *   **Logic**: One-to-one relationship with `User`.
    *   **Input**: User reference, Balance (BigDecimal), Currency.
    *   **Output**: Wallet details.
    *   **Connected**: `User`, `WalletRepository`, `WalletService`.

3.  **Transaction.java**
    *   **Path**: `src/main/java/com/paperpay/entity/Transaction.java`
    *   **Language**: Java
    *   **Why**: Records every movement of money (Send, Receive, Add Money).
    *   **Role**: Ledger for the system.
    *   **Logic**: Links a sender and a receiver with an amount and status.
    *   **Input**: Sender User, Receiver User, Amount, Status (COMPLETED/FAILED).
    *   **Output**: Transaction record with Reference ID.
    *   **Connected**: `TransactionRepository`, `TransactionService`, `FraudAlert`.

4.  **UpiAccount.java**
    *   **Path**: `src/main/java/com/paperpay/entity/UpiAccount.java`
    *   **Language**: Java
    *   **Why**: Stores the Virtual Payment Address (VPA) or UPI ID.
    *   **Role**: Alias for user identification during transfers.
    *   **Logic**: Maps a string like `user@paperpay` to a User ID.
    *   **Input**: UPI ID string, User reference.
    *   **Connected**: `UpiAccountRepository`, `TransactionService`.

5.  **Expense.java**
    *   **Path**: `src/main/java/com/paperpay/entity/Expense.java`
    *   **Language**: Java
    *   **Why**: Tracks personal spending for the Expense Tracker feature.
    *   **Role**: Data model for the user's personal budget management.
    *   **Connected**: `ExpenseRepository`, `ExpenseService`.

6.  **FraudAlert.java**
    *   **Path**: `src/main/java/com/paperpay/entity/FraudAlert.java`
    *   **Language**: Java
    *   **Why**: Stores details of suspicious activities.
    *   **Role**: Security monitoring record.
    *   **Connected**: `FraudAlertRepository`, `FraudDetectionService`.

---

#### **Package: `com.paperpay.controller`**
*These files act as the API gateways (endpoints) for the frontend.*

1.  **AuthController.java**: Handles `/api/auth` (Login, Register, Me).
2.  **TransactionController.java**: Handles `/api/transactions` (Send money, History).
3.  **WalletController.java**: Handles `/api/wallet` (Balance, Add money, Withdraw).
4.  **ExpenseController.java**: Handles `/api/expenses` (CRUD for personal expenses).
5.  **FraudController.java**: Handles `/api/fraud` (Fetching alerts for users).
6.  **AdminController.java**: Handles `/api/admin` (User management, system stats).

---

#### **Package: `com.paperpay.service`**
*This is where the actual business logic lives.*

1.  **AuthService.java**: Logic for hashing passwords, creating default wallets, and generating UPI IDs during registration.
2.  **TransactionService.java**: Orchestrates the transfer of money. It validates balances, updates sender/receiver wallets, and records the transaction.
3.  **WalletService.java**: Logic for adding/withdrawing money and balance calculations.
4.  **FraudDetectionService.java**: Runs security checks (e.g., checking if a user made too many transactions in a minute).
5.  **ExpenseService.java**: Logic for categorizing and calculating personal spending.

---

#### **Package: `com.paperpay.repository`**
*Interfaces that use Spring Data JPA to talk to the database (MySQL/PostgreSQL).*

*   `UserRepository`, `WalletRepository`, `TransactionRepository`, `ExpenseRepository`, `UpiAccountRepository`, `FraudAlertRepository`.
*   **Role**: Abstract away SQL queries using methods like `findByEmail()` or `findAllByUser()`.

---

#### **Security & JWT Analysis**

1.  **SecurityConfig.java**: The main configuration that defines which routes are public (login/register) and which require a token.
2.  **JwtTokenProvider.java**: Utility to create (generate) and validate (parse) the JWT tokens.
3.  **JwtAuthFilter.java**: A filter that intercepts every request, checks for a "Bearer" token in the header, and authenticates the user if the token is valid.
4.  **UserDetailsServiceImpl.java**: Connects Spring Security to our database to load user data during login.

---

### 🎨 Frontend Analysis (`/paperpay`)

#### **Pages (`/app`)**

1.  **layout.tsx**: The root layout providing the font and global styles.
2.  **page.tsx**: The landing page (Hero section, features).
3.  **login/page.tsx**: The login interface with form handling.
4.  **dashboard/page.tsx**: The main authenticated view showing the Wallet Card and Transactions.
5.  **send-money/page.tsx**: Form to enter UPI ID and amount to transfer money.
6.  **analytics/page.tsx**: Visualizes spending patterns using charts.
7.  **fraud-center/page.tsx**: Shows security alerts to the user.

#### **Components (`/components`)**

1.  **WalletCard.tsx**: High-end component with "count-up" animation for balance.
2.  **PaperCard.tsx**: The "Sketchbook" themed container with wobbly borders and shadows.
3.  **SketchButton.tsx**: Interactive buttons with hand-drawn styling.
4.  **SVGDecorations.tsx**: Decorative elements (Tape, PaperClip) that give the 3D feel.
5.  **Sidebar.tsx**: Main navigation menu for the dashboard.

#### **API & State (`/lib`)**

1.  **api/client.ts**: The centralized API handler using `fetch`. It automatically attaches the JWT token to every request and handles error responses.
2.  **auth/store.ts**: Uses `zustand` (or similar) or local storage to keep the user's login state across the app.

---

## 🗄️ Database Analysis

| Table | Primary Key | Foreign Key(s) | Role |
| :--- | :--- | :--- | :--- |
| **users** | id | None | Stores user profiles and credentials. |
| **wallets** | id | user_id | Tracks the current balance for each user. |
| **transactions** | id | sender_id, receiver_id | Records all money transfers. |
| **upi_accounts** | id | user_id | Maps unique UPI IDs to specific users. |
| **expenses** | id | user_id | Stores personal manual expense entries. |
| **fraud_alerts** | id | user_id, transaction_id | Security logs for suspicious activity. |

**Relationships**:
*   **User to Wallet**: 1-to-1 (One user has one wallet).
*   **User to Transaction**: 1-to-Many (One user can have many transactions).
*   **User to UpiAccount**: 1-to-1 (Primary UPI ID).

---

## 🔄 Full Project Flows

### **1. Complete Workflow (End-to-End)**
1.  **Frontend**: User enters a UPI ID and amount in `send-money/page.tsx` and clicks "Send".
2.  **API Call**: `client.ts` sends a POST request to `/api/transactions/send` with the JWT token.
3.  **Backend Processing**: `TransactionController` receives the request -> `TransactionService` validates balance -> `TransactionService` updates database.
4.  **Database**: The balance in `wallets` table is updated for both sender and receiver. A record is added to `transactions`.
5.  **Response**: Backend returns `TransactionResponse` (Success).
6.  **Frontend Update**: The UI shows a success message and redirects to the dashboard to show the new balance.

### **2. Authentication Flow (Signup/Login)**
1.  User enters details -> Frontend calls `/auth/register`.
2.  Backend hashes the password, saves user, creates a wallet, and generates a UPI ID.
3.  Backend returns a **JWT Token**.
4.  Frontend saves this token in `localStorage`.
5.  For every future request, the frontend adds `Authorization: Bearer <token>` to the header.

### **3. Transaction Flow (Internal)**
*   The `send()` method in `TransactionService` is marked `@Transactional`.
*   If the sender has ₹100 and sends ₹50:
    *   Step A: Subtract ₹50 from Sender.
    *   Step B: Add ₹50 to Receiver.
    *   If Step B fails, Step A is automatically rolled back (ACID properties).

### **4. Fraud Detection Flow**
*   After a transaction is saved, `FraudDetectionService` checks the transaction in a separate thread (`@Async`).
*   It counts how many transactions the user did in the last 60 seconds.
*   If count > 5, it creates a `FraudAlert` with level `CRITICAL`.
*   The user sees this alert in their "Fraud Center".

---

## 🧱 OOP Concepts in the Project

1.  **Encapsulation**:
    *   **Where**: In all Entity classes (e.g., `User.java`).
    *   **How**: Fields like `password` and `email` are `private`. Access is only provided through Getter and Setter methods (automated by Lombok `@Data`). This protects data integrity.

2.  **Inheritance**:
    *   **Where**: `UserRepository` extends `JpaRepository`.
    *   **How**: Our repository inherits powerful methods like `save()`, `delete()`, and `findById()` from the Spring Data framework without us having to write the code for them.

3.  **Polymorphism**:
    *   **Where**: `PasswordEncoder` interface.
    *   **How**: We use the `PasswordEncoder` interface in `AuthService`, but at runtime, it uses the `BCryptPasswordEncoder` implementation. We can swap different hashing algorithms without changing the service logic.

4.  **Abstraction**:
    *   **Where**: Repository Interfaces and Service Layers.
    *   **How**: The Controllers only know *what* the services do (e.g., `transactionService.send()`), not *how* they do it (the SQL or internal logic). This hides complexity.

---

## 🎓 Viva Preparation Section

### **Common Questions & Strong Answers**

**Q: What is the significance of the `@Transactional` annotation?**
*   **Answer**: It ensures "Atomicity". In a money transfer, we have two steps: debiting one account and crediting another. If one fails, the other must not happen. `@Transactional` ensures that either both steps succeed or both are rolled back, preventing money from "disappearing."

**Q: Why did you use JWT for authentication instead of Sessions?**
*   **Answer**: JWT is **stateless**. The server doesn't need to store session data in memory. This makes the system more scalable because any instance of the backend can validate the token using the secret key. It is also better for mobile app integration.

**Q: How does your system handle security vulnerabilities like SQL Injection?**
*   **Answer**: By using **Spring Data JPA**. JPA uses "Prepared Statements" behind the scenes, which automatically sanitizes user input, making it impossible for a user to inject malicious SQL code.

**Q: Explain your Fraud Detection logic.**
*   **Answer**: It uses a "Rule-Based" engine. Currently, it monitors three things: 1. Large transactions (over ₹50,000), 2. Rapid-fire transactions (more than 5 in a minute), and 3. High failure rates. These trigger alerts that are stored in the database for admin review.

**Q: Why did you choose React/Next.js for the frontend?**
*   **Answer**: Next.js provides excellent performance through Server-Side Rendering and a clean folder-based routing system. It allows us to build a highly responsive, single-page application (SPA) feel while maintaining good SEO and fast load times.

**Q: How do you ensure the 3D "Sketchbook" design is responsive?**
*   **Answer**: We use **Tailwind CSS** with responsive utilities (like `md:`, `lg:`). The "3D" effects (shadows and rotations) are applied using relative CSS units and Framer Motion, which adjust smoothly across different screen sizes.
