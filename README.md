# Modern Developer Portfolio & CMS

A high-performance, full-stack developer portfolio featuring a custom-built Content Management System (CMS). This project is designed to be fully dynamic, allowing you to manage projects, skills, and profile information without touching the code.

## 🚀 Features

- **Public Portfolio:** Responsive, modern UI with smooth animations and clean typography.
- **Admin CMS:** Secure dashboard to manage your entire portfolio.
- **Dynamic Projects:** CRUD operations for projects with support for multiple images and Markdown descriptions.
- **Skill Management:** Categorized skill tracking (Frontend/Backend) with proficiency levels.
- **Live Profile Editing:** Update your bio, social links, and profile picture instantly.
- **Contact System:** Integrated contact form that sends real-time email notifications.
- **Cloud Hosting:** Images stored on Cloudinary, Database on Turso (Edge SQLite), and Emails via Resend.

---

## 🛠️ Tech Stack

### Frontend

- **React (Vite):** Fast, modern UI development.
- **React Router 7:** Handling Single Page Application (SPA) routing.
- **Context API:** Global state management for Auth and Profile data.
- **CSS3:** Custom variables and responsive design (no heavy frameworks).

### Backend

- **Node.js & Express:** Lightweight and scalable API.
- **Turso (libSQL):** Edge-compatible SQLite database for ultra-low latency.
- **Cloudinary:** Cloud-based image management and optimization.
- **Resend:** Developer-first email API for contact form notifications.
- **JWT & Bcrypt:** Secure authentication and password hashing.

---

## 📂 Project Structure

```text
/
├── client/             # React Frontend (Vite)
├── server/             # Node.js API
├── vercel.json         # Vercel Deployment Config
└── package.json        # Root scripts for monorepo management
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js (v18+)
- A Cloudinary Account (Free)
- A Turso Account (Free)
- A Resend Account (Free)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/your-repo.git
cd Developer_Portfolio
npm run install:all
```

### 2. Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Config
PORT=4000
JWT_SECRET=your_random_secret_string

# Admin Credentials
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD_HASH=your_bcrypt_hash (Use node server/hash.js to generate)

# Turso Database
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your_turso_token

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Resend Email
RESEND_API_KEY=re_your_key
```

### 3. Initialize Database

```bash
cd server
npm run seed
```

### 4. Run Development Servers

From the root directory:

```bash
npm run dev
```

---

## ☁️ Deployment (Vercel)

### 1. Repository Setup

Push your code to a GitHub/GitLab repository.

### 2. Vercel Configuration

1. Import the project into Vercel.
2. Ensure the **Root Directory** is set to the project root.
3. Add all environment variables from your `server/.env` to the Vercel Dashboard.
4. Add `VITE_API_URL` and set it to an empty string `""` (this ensures the frontend uses relative API calls).

### 3. Build Settings

Vercel should automatically detect the settings from `vercel.json` and the root `package.json`.

---

## 🔐 Security Settings

The portfolio includes a **Security Tab** in the Admin Dashboard. This allows you to:

1. Change your Admin Email.
2. Update your Password.

The credentials are stored in the `users` table in your Turso database, making them independent of environment variables after the initial seed.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the UI or add features:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
