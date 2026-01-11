const { client } = require("./db");

const mapProfile = (row) => {
  if (!row) return null;
  return {
    name: row.name || "",
    title: row.title || "",
    heroBio: row.hero_bio || "",
    aboutBio: row.about_bio || "",
    profileImage: row.profile_image || "",
    resumeUrl: row.resume_url || "",
    email: row.email || "",
    linkedin: row.linkedin || "",
    github: row.github || "",
    twitter: row.twitter || "",
    facebook: row.facebook || "",
    experienceYears: row.experience_years || "",
    educationSummary: row.education_summary || "",
    updatedAt: row.updated_at,
  };
};

const getProfile = async () => {
  const result = await client.execute("SELECT * FROM profile WHERE id = 1");
  const row = result.rows[0];
  return mapProfile(row);
};

const updateProfile = async (data) => {
  const current = (await getProfile()) || {};
  
  // Merge current data with new data
  const merged = { ...current, ...data };

  const sql = `
    INSERT OR REPLACE INTO profile (
      id, name, title, hero_bio, about_bio, profile_image, resume_url, 
      email, linkedin, github, twitter, facebook, 
      experience_years, education_summary, updated_at
    ) VALUES (
      1, @name, @title, @heroBio, @aboutBio, @profileImage, @resumeUrl,
      @email, @linkedin, @github, @twitter, @facebook,
      @experienceYears, @educationSummary, CURRENT_TIMESTAMP
    )
  `;

  await client.execute({
    sql,
    args: {
      name: merged.name,
      title: merged.title,
      heroBio: merged.heroBio,
      aboutBio: merged.aboutBio,
      profileImage: merged.profileImage,
      resumeUrl: merged.resumeUrl,
      email: merged.email,
      linkedin: merged.linkedin,
      github: merged.github,
      twitter: merged.twitter,
      facebook: merged.facebook,
      experienceYears: merged.experienceYears,
      educationSummary: merged.educationSummary,
    }
  });

  return getProfile();
};

module.exports = {
  getProfile,
  updateProfile,
};
