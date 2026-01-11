const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { signToken, requireAuth } = require("./auth");
const {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateVisibility,
} = require("./projectStore");
const { getProfile, updateProfile } = require("./profileStore");
const { listSkills, createSkill, deleteSkill } = require("./skillStore");
const { initSchema } = require("./db");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Initialize DB schema
initSchema().catch(console.error);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio",
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "svg"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use("/assets", express.static(path.join(__dirname, "../assets"))); // Serve root assets

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((t) => t.trim());
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed))
        return parsed.filter(Boolean).map((t) => String(t).trim());
    } catch (_) {
      return value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const parseImages = (existing, files) => {
  const current = normalizeArray(existing);
  const uploads = (files || []).map((file) => file.path); // Cloudinary URL is in file.path
  return [...current, ...uploads];
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- PROFILE ENDPOINTS ---

app.get("/api/profile", async (_req, res) => {
  try {
    const profile = await getProfile();
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put(
  "/api/profile",
  requireAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const data = req.body;
      const files = req.files || {};

      if (files.profileImage?.[0]) {
        data.profileImage = files.profileImage[0].path;
      }
      if (files.resume?.[0]) {
        data.resumeUrl = files.resume[0].path;
      }

      const updated = await updateProfile(data);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// --- SKILL ENDPOINTS ---

app.get("/api/skills", async (_req, res) => {
  try {
    const skills = await listSkills();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/skills", requireAuth, async (req, res) => {
  try {
    const { name, level, percentage, category } = req.body;
    if (!name || !level || !percentage || !category) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const skill = await createSkill({ name, level, percentage, category });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/skills/:id", requireAuth, async (req, res) => {
  try {
    await deleteSkill(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- AUTH ENDPOINTS ---

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      return res.status(500).json({ error: "Server auth is not configured" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (email !== adminEmail) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, adminPasswordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({ email, role: "owner" });
    res.json({ token, user: { email, role: "owner" } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: { email: req.user.email, role: req.user.role } });
});

app.get("/api/projects", async (_req, res) => {
  try {
    const projects = await listProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/projects", requireAuth, async (_req, res) => {
  try {
    const projects = await listProjects({ includeDrafts: true });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await getProject(req.params.id, { includeDrafts: false });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/api/projects",
  requireAuth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { title, shortDescription, fullDescription, repoUrl, liveUrl } =
        req.body;
      const techStack = normalizeArray(req.body.techStack);
      const published =
        req.body.published === "true" || req.body.published === true;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const images = parseImages([], req.files);

      const project = await createProject({
        title,
        shortDescription,
        fullDescription,
        techStack,
        repoUrl,
        liveUrl,
        images,
        published,
      });

      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.put(
  "/api/projects/:id",
  requireAuth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const existing = await getProject(req.params.id, { includeDrafts: true });
      if (!existing) return res.status(404).json({ error: "Project not found" });

      const { title, shortDescription, fullDescription, repoUrl, liveUrl } =
        req.body;
      const techStack =
        req.body.techStack !== undefined
          ? normalizeArray(req.body.techStack)
          : undefined;
      const published =
        req.body.published !== undefined
          ? req.body.published === "true" || req.body.published === true
          : existing.published;
      const existingImages = normalizeArray(
        req.body.existingImages || existing.images || []
      );
      const images = parseImages(existingImages, req.files);

      const project = await updateProject(req.params.id, {
        title: title || existing.title,
        shortDescription: shortDescription ?? existing.shortDescription,
        fullDescription: fullDescription ?? existing.fullDescription,
        techStack: techStack !== undefined ? techStack : existing.techStack,
        repoUrl: repoUrl ?? existing.repoUrl,
        liveUrl: liveUrl ?? existing.liveUrl,
        images,
        published,
      });

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.patch("/api/projects/:id/visibility", requireAuth, async (req, res) => {
  try {
    const { published } = req.body;
    if (published === undefined) {
      return res.status(400).json({ error: "published flag is required" });
    }
    const project = await updateVisibility(req.params.id, Boolean(published));
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/projects/:id", requireAuth, async (req, res) => {
  try {
    const project = await getProject(req.params.id, { includeDrafts: true });
    if (!project) return res.status(404).json({ error: "Project not found" });

    await deleteProject(req.params.id);
    // Note: In a real app, you might want to delete images from Cloudinary here
    // but for now we'll just remove the DB record.
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const clientBuildPath = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

