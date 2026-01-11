const path = require("path");
const dotenv = require("dotenv");
const { client, initSchema } = require("./db");
const { createProject } = require("./projectStore");
const { updateProfile } = require("./profileStore");
const { createSkill } = require("./skillStore");

dotenv.config({ path: path.join(__dirname, ".env") });

async function seed() {
  console.log("Starting seed...");
  try {
    // Ensure schema is initialized
    await initSchema();

    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    if (adminEmail && adminPasswordHash) {
      await client.execute({
        sql: "INSERT OR REPLACE INTO users (id, email, password_hash) VALUES (1, ?, ?)",
        args: [adminEmail, adminPasswordHash]
      });
      console.log("Admin user seeded.");
    }

    // Clear existing tables
    await client.execute("DELETE FROM projects");
    await client.execute("DELETE FROM skills");

    // Seed Profile
    await updateProfile({
      name: "Foster Boadi",
      title: "Full-Stack Developer",
      heroBio: "Crafting digital experiences with clean code and modern technologies",
      aboutBio:
        "I am a passionate full-stack developer with experience in crafting dynamic, user-friendly web applications using modern technologies. My expertise spans both front-end and back-end development, with strong proficiency in JavaScript, React, Node.js, and Python.\n\nI'm committed to continuous learning and staying current with industry trends to deliver efficient, scalable, and innovative solutions that solve real-world problems.",
      profileImage: "/assets/foster.jpg",
      resumeUrl: "/assets/resume.pdf",
      email: "fosterboadi152@gmail.com",
      linkedin: "https://linkedin.com/in/fosterboadi",
      github: "https://github.com/fosterb1",
      twitter: "https://x.com/KobbyP4",
      facebook: "https://web.facebook.com/foster.boadi.52012/",
      experienceYears: "1+ Year Full-Stack Development",
      educationSummary: "Diploma in Software Development\nBSc. Computer Science",
    });

    // Seed Skills
    const skills = [
      // Frontend
      { name: "HTML5", level: "Expert", percentage: 95, category: "frontend" },
      { name: "CSS3", level: "Expert", percentage: 90, category: "frontend" },
      { name: "JavaScript", level: "Advanced", percentage: 85, category: "frontend" },
      { name: "React", level: "Advanced", percentage: 80, category: "frontend" },
      { name: "TypeScript", level: "Intermediate", percentage: 75, category: "frontend" },
      // Backend
      { name: "Node.js", level: "Advanced", percentage: 85, category: "backend" },
      { name: "Express.js", level: "Advanced", percentage: 80, category: "backend" },
      { name: "Python", level: "Intermediate", percentage: 75, category: "backend" },
      { name: "PostgreSQL", level: "Intermediate", percentage: 70, category: "backend" },
      { name: "Git", level: "Advanced", percentage: 85, category: "backend" },
    ];

    for (const skill of skills) {
      await createSkill(skill);
    }

    const seeds = [
      {
        title: "E-Commerce Platform",
        shortDescription: "Full-featured online shopping platform.",
        fullDescription:
          "Full-featured online shopping platform with user authentication, payment processing, and admin dashboard.",
        techStack: [
          "React",
          "Node.js",
          "MongoDB",
        ],
        repoUrl: "https://github.com/",
        liveUrl: "https://github.com/",
        images: [
          "/uploads/project1.png",
        ],
        published: 1,
      },
      {
        title: "Task Management App",
        shortDescription: "Collaborative task management application.",
        fullDescription:
          "Collaborative task management application with real-time updates and team collaboration features.",
        techStack: ["JavaScript", "Express", "PostgreSQL"],
        repoUrl: "https://github.com/",
        liveUrl: "https://github.com/",
        images: [
          "/uploads/project1.png",
        ],
        published: 1,
      },
      {
        title: "Weather Dashboard",
        shortDescription: "Real-time weather application.",
        fullDescription:
          "Real-time weather application with location-based forecasts, charts, and historical data.",
        techStack: ["React", "Python", "Django"],
        repoUrl: "https://github.com/",
        liveUrl: "https://github.com/",
        images: [
          "/uploads/project1.png",
        ],
        published: 1,
      },
    ];

    for (const project of seeds) {
      await createProject(project);
    }
    console.log(`Seeded ${seeds.length} projects.`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();