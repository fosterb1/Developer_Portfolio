const { client } = require("./db");

const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description || "",
    fullDescription: row.full_description || "",
    techStack: row.tech_stack ? JSON.parse(row.tech_stack) : [],
    repoUrl: row.repo_url || "",
    liveUrl: row.live_url || "",
    images: row.images ? JSON.parse(row.images) : [],
    published: Boolean(row.published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const serializeProject = (input) => ({
  title: input.title,
  short_description: input.shortDescription || "",
  full_description: input.fullDescription || "",
  tech_stack: JSON.stringify(input.techStack || []),
  repo_url: input.repoUrl || "",
  live_url: input.liveUrl || "",
  images: JSON.stringify(input.images || []),
  published: input.published ? 1 : 0,
});

const listProjects = async ({ includeDrafts = false } = {}) => {
  const sql = includeDrafts
    ? "SELECT * FROM projects ORDER BY created_at DESC"
    : "SELECT * FROM projects WHERE published = 1 ORDER BY created_at DESC";
  
  const result = await client.execute(sql);
  return result.rows.map(mapRow);
};

const getProject = async (id, { includeDrafts = false } = {}) => {
  const sql = includeDrafts
    ? "SELECT * FROM projects WHERE id = ?"
    : "SELECT * FROM projects WHERE id = ? AND published = 1";
    
  const result = await client.execute({ sql, args: [id] });
  const row = result.rows[0];
  return mapRow(row);
};

const createProject = async (project) => {
  const payload = serializeProject(project);
  const sql = `
    INSERT INTO projects (title, short_description, full_description, tech_stack, repo_url, live_url, images, published, created_at, updated_at)
    VALUES (@title, @short_description, @full_description, @tech_stack, @repo_url, @live_url, @images, @published, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;
  
  const result = await client.execute({ sql, args: payload });
  // lastInsertRowid is available in result as lastInsertRowid (bigint)
  return getProject(result.lastInsertRowid, { includeDrafts: true });
};

const updateProject = async (id, project) => {
  const payload = serializeProject(project);
  const sql = `
    UPDATE projects
    SET title = @title,
        short_description = @short_description,
        full_description = @full_description,
        tech_stack = @tech_stack,
        repo_url = @repo_url,
        live_url = @live_url,
        images = @images,
        published = @published,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `;
  
  await client.execute({ sql, args: { ...payload, id } });
  return getProject(id, { includeDrafts: true });
};

const updateVisibility = async (id, published) => {
  const sql = "UPDATE projects SET published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
  await client.execute({ sql, args: [published ? 1 : 0, id] });
  return getProject(id, { includeDrafts: true });
};

const deleteProject = async (id) => {
  const sql = "DELETE FROM projects WHERE id = ?";
  const result = await client.execute({ sql, args: [id] });
  return result.rowsAffected > 0;
};

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateVisibility,
};
