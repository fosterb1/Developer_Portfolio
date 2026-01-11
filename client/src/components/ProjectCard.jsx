import React from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../services/api";

const ProjectCard = ({ project }) => {
  const { id, title, shortDescription, techStack, images, repoUrl, liveUrl } =
    project;

  const imageUrl =
    images && images.length > 0
      ? images[0].startsWith("http")
        ? images[0]
        : `${API_BASE}${images[0]}`
      : "/assets/project1.png"; // Fallback image

  return (
    <div className="project-card">
      <div className="project-image">
        <img src={imageUrl} alt={title} />
        <div className="project-overlay">
          <div className="tech-stack">
            {techStack.slice(0, 3).map((tech, index) => (
              <span key={index} className="tech-tag">
                {tech}
              </span>
            ))}
            {techStack.length > 3 && (
              <span className="tech-tag">+{techStack.length - 3}</span>
            )}
          </div>
        </div>
      </div>
      <div className="project-content">
        <h3>{title}</h3>
        <p>{shortDescription}</p>
        <div className="project-links">
          <Link to={`/project/${id}`} className="project-link">
            <i className="fas fa-info-circle"></i> Details
          </Link>
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="project-link"
            >
              <i className="fab fa-github"></i> Code
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="project-link live-demo"
            >
              <i className="fas fa-external-link-alt"></i> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;