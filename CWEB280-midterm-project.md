# CWEB280 Midterm Project

## 1. Project Overview & Presentation

Teams of 5 or 6 students will design and build a multi-feature web application using **Node.js, Express, Handlebars, JWT authentication, and TypeORM with MySQL**.

Teams will present their web applications in a **Mock Client Meeting**. Where the client happens to be an IT specialist and will question the application flow, stored data and architecture of each section. Each team membe must prepare a thorough presentation of how their section is user friendly and works as intended (including error handling)

Teams will particpate in peer evalautions, on how well teammates understood the content, communication, team work and overall contribution.

Teams must strictly use the packages, technologies, and code patterns covered in the course modules (Express, Handlebars, TypeORM, `express-validator`, Multer, and JWT with `cookie-parser`). The use of unapproved 3rd-party libraries, alternative ORMs/frameworks, or code patterns not taught in class is prohibited. The goal of this project is to demonstrate mastery of the concepts covered in this course.

Teams may propose their own web application idea or choose from the suggested project concepts. The project architecture must be modular, where **each team member is responsible for 1 or 2 pages** of the application.

---

## 2. Academic Integrity & Generative AI Policy

> ### **Strict Policy on Generative AI and Code Generation**
>
> - **Prohibited:** The use of generative AI tools (e.g., Google or Bing search AI, ChatGPT, GitHub Copilot , Claude, Cursor, DeepSeek, etc.) to **write, generate, auto-complete, or refactor code, routes, Handlebars templates, or database schemas** is strictly forbidden.
> - **Prohibited:** Signing into VSCode with a GitHub account is strictly forbidden.
> - **Permitted:** Students may use the **MS Copilot "Study and Learn" agent** exclusively as a conceptual tutor to explain error stack traces, clarify syntax rules, or ask high-level questions.
> - **Enforcement & Penalty:** If any member of a team is found to have violated the policy, **the entire team will receive a grade of ZERO (0)** for the project.

---

## 3. General Technical Requirements

Every submitted project must satisfy the following baseline architecture:

1. **Application start point (`app.js`):**
   - Express server initialization with standard middleware (`express.json()`, `express.urlencoded({ extended: true })`, `cookieParser()`).
   - Centralized TypeORM `DataSource` connection to a MySQL database.
   - Handlebars view engine setup with layout templates (`main.handlebars`) and partials.

2. **Authentication & Authorization (JWT):**
   - User registration and login flows issuing signed JWT tokens stored securely in **`HttpOnly` cookies**.
   - Custom authentication middleware (e.g., `authenticateTokenFromCookie`) to protect restricted routes and attach `req.user` payload.

3. **Database Integration (TypeORM + MySQL):**
   - Relational database tables mapped using TypeORM entities or entity schemas.
   - All database operations abstracted using TypeORM repositories (`AppDataSource.getRepository(...)`).

4. **Input Validation (`express-validator`):**
   - All incoming form inputs and API payloads validated at the route level using `express-validator`.
   - When validation fails (`validationResult(req)`), controllers must re-render the Handlebars view with feedback messages and preserved input fields.

5. **File Handling & Multipart Data (Multer):**
   - At least one section of the application must implement file uploads using **Multer** disk storage, enforcing file size limits and MIME-type restrictions.

---

## 4. Team Member Structure (1 or 2 Pages per Student)

Each team member owns **1 section** of the application. For their assigned page, each student must independently create and maintain:

- \*_1 or 2 Handlebars Views_ (`.handlebars` file rendered within `main.handlebars`)
- **Corresponding Express Routes & Handlers** (`GET` handler to display the view, `POST` handler to process form submissions)
- **1 TypeORM Entity** (MySQL database table representing data owned by that module)
- **`express-validator` Rules** applied to incoming form submissions

---

## 5. Mock Client Meeting

Teams will present their web application in a **Mock Client Meeting** where the client is an **IT Specialist**.
The client will evaluate both the business/user experience and the technical implementation.

- **Live UI Demo:** Demonstrate the Handlebars views, user workflows, form interactions, and site navigation.
- **Technical Code Review:** Explain your Express route handlers, TypeORM entity definitions, `express-validator` rules, Multer configuration, and JWT security (`HttpOnly` cookies).
- **Individual Defense:** Every team member must independently present their assigned page (1 page per student) and answer technical questions regarding their code and architecture.

---

### **Bakery / Coffee Shop Order Hub**
* **MINE (Page 3 - Custom Orders):** `/custom-order` view. Catering request form (date selection, quantities, special instructions).
