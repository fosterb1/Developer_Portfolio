# Dynamic Developer Portfolio

A fully dynamic, full-stack developer portfolio application with a content management system (CMS). Built to replace the static version while maintaining the original visual identity.

## Features

- **Public Portfolio:**
  - Responsive design matching the original aesthetic (Light/Clean theme).
  - Dynamic project listing fetched from the backend.
  - Detailed project pages with Markdown support.
  - Sections: Hero, About, Experience, Projects, Contact.
- **Admin Dashboard:**
  - Secure authentication (Owner only).
  - Create, Read, Update, Delete (CRUD) projects.
  - Toggle visibility (Draft/Published).
  - Image upload support.
  - Markdown editor for project descriptions.

## Tech Stack

- **Frontend:** React (Vite), React Router v6.
- **Backend:** Node.js, Express.js.
- **Database:** Turso (SQLite via `@libsql/client`).
- **Storage:** Cloudinary (Image management).
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt.
- **Deployment:** Vercel.

## Setup Instructions (Local)

### Prerequisites
- Node.js (v18+)
- npm
- [Turso CLI](https://docs.turso.tech/cli) (optional, for remote DB)
- [Cloudinary Account](https://cloudinary.com/)

### 1. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
TURSO_DATABASE_URL=file:./data/portfolio.db
TURSO_AUTH_TOKEN=
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
JWT_SECRET=any_long_random_string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=... (Use node hash.js yourpassword to generate)
```

Initialize and seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm start
```

### 2. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```

## Deployment to Vercel

This project is configured for easy deployment to Vercel as a monorepo.

### 1. Prepare Turso & Cloudinary
- Create a database on [Turso](https://turso.tech/).
- Copy the **Database URL** and **Auth Token**.
- (Optional) Run `TURSO_DATABASE_URL=your_url TURSO_AUTH_TOKEN=your_token npm run seed` inside the `server/` folder to populate your remote database.
- Get your Cloudinary API credentials from the dashboard.

### 2. Vercel Project Setup
- Push your code to GitHub.
- Connect your repository to [Vercel](https://vercel.com).
- Add the following **Environment Variables** in Vercel:
  - `TURSO_DATABASE_URL`
  - `TURSO_AUTH_TOKEN`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `JWT_SECRET`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD_HASH`
  - `VITE_API_URL` (Set to an empty string `""`)

### 3. Deploy
Vercel will automatically detect the `vercel.json` and build both the frontend and backend.

## Environment Variables

### Server (`server/.env`)
Already configured for local development:
```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=supersecretkey123
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=... (Bcrypt hash)
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:4000
```

## How to Log In (Admin)

1.  Navigate to `http://localhost:5173/admin` (or click "Login" if you added a link, otherwise type the URL).
2.  Use the following credentials:
    - **Email:** `admin@example.com`
    - **Password:** `admin123`

## Managing Projects

Once logged in, you will be directed to the Admin Dashboard.

- **Add Project:** Click the "Add New Project" button. Fill in the title, description, tech stack, and upload images.
- **Edit Project:** Click the "Edit" button on any project card.
- **Publish/Unpublish:** Use the toggle button to show/hide projects from the public page.
- **Delete:** Permanently remove a project.

## Project Structure

- `client/`: React frontend application.
- `server/`: Node.js/Express backend API.
- `server/data/`: SQLite database file.
- `server/uploads/`: User-uploaded project images.
- `index.html` & `styles.css`: (Root) Original static reference files.

## Visual Style

The project strictly follows the design defined in the root `styles.css`, featuring a clean layout with blue/purple accents (`#2563eb`, `#7c3aed`) and Poppins typography.