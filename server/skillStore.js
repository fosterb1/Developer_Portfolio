const { client } = require("./db");

const mapSkill = (row) => ({
  id: row.id,
  name: row.name,
  level: row.level,
  percentage: row.percentage,
  category: row.category, // 'frontend' | 'backend'
});

const listSkills = async () => {
  const result = await client.execute("SELECT * FROM skills ORDER BY category, percentage DESC");
  return result.rows.map(mapSkill);
};

const createSkill = async (skill) => {
  const sql = `
    INSERT INTO skills (name, level, percentage, category)
    VALUES (@name, @level, @percentage, @category)
  `;
  const result = await client.execute({ sql, args: skill });
  return { id: result.lastInsertRowid, ...skill };
};

const deleteSkill = async (id) => {
  const sql = "DELETE FROM skills WHERE id = ?";
  const result = await client.execute({ sql, args: [id] });
  return result.rowsAffected > 0;
};

module.exports = {
  listSkills,
  createSkill,
  deleteSkill,
};
