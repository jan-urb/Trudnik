import pool from '../db.js';

// Companies
export const getCompaniesQuery = async (limit, offset) => {
  const { rows } = await pool.query(
    'SELECT c.id, c.company_name, c.company_website, a.activity_name, er.lower AS employees_lower, er.upper AS employees_upper, ci.name as city_name FROM company c LEFT JOIN employees_range er ON c.employees_range_id = er.id LEFT JOIN city ci ON c.city_id = ci.id LEFT JOIN activity a ON c.activity_id = a.id ORDER BY c.id LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return rows;
};

export const getCompaniesTotalCount = async () => {
  const { rows } = await pool.query('SELECT COUNT(*) FROM company');
  return parseInt(rows[0].count, 10);
};

export const getCompanyByIdQuery = async (id) => {
  const { rows } = await pool.query('SELECT c.id, c.company_name, c.company_website, c.registration_number, c.address, c.founded_date, a.activity_name, er.lower AS employees_lower, er.upper AS employees_upper, ci.name as city_name FROM company c LEFT JOIN city ci ON c.city_id = ci.id LEFT JOIN employees_range er ON c.employees_range_id = er.id LEFT JOIN activity a ON c.activity_id = a.id WHERE c.id=$1', [id]);
  return rows[0];
};

// Company name with punctuation and spaces removed
const normalizedCompanyName = "regexp_replace(c.company_name, '[^[:alnum:]]', '', 'g')";

export const getCompaniesBySearchQuery = async (limit, offset, search) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.company_name, c.company_website, ci.name AS city_name FROM company c LEFT JOIN city ci ON c.city_id = ci.id WHERE ${normalizedCompanyName} ILIKE '%' || $1 || '%' ORDER BY (${normalizedCompanyName} ILIKE $1 || '%') DESC, c.id LIMIT $2 OFFSET $3`,
    [search, limit, offset]
  );
  return rows;
};

export const getCompaniesBySearchTotalCount = async (search) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM company c LEFT JOIN city ci ON c.city_id = ci.id WHERE ${normalizedCompanyName} ILIKE '%' || $1 || '%'`,
    [search]
  );
  return parseInt(rows[0].count, 10);
};



// Jobs
export const getJobsQuery = async (limit, offset) => {
  const { rows } = await pool.query(
    'select j.id, j.title, j.technologies, c.company_name, j.company_id, j.category_id, ci.name as city_name FROM jobs j LEFT JOIN company c ON j.company_id=c.id LEFT JOIN city ci ON c.city_id=ci.id WHERE j.is_active ORDER BY j.created_at DESC, j.id DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return rows;
};

export const getJobsTotalCount = async () => {
  const { rows } = await pool.query('SELECT COUNT(*) FROM jobs j WHERE j.is_active');
  return parseInt(rows[0].count, 10);
};

export const getJobsByCategoryQuery = async (limit, offset, category_id) => {
  const { rows } = await pool.query(
    'SELECT j.id, j.title, j.technologies, c.company_name, j.company_id, j.category_id, ci.name AS city_name FROM jobs j LEFT JOIN company c ON j.company_id = c.id LEFT JOIN city ci ON c.city_id = ci.id WHERE j.category_id = $3 AND j.is_active ORDER BY j.created_at DESC, j.id DESC LIMIT $1 OFFSET $2',
    [limit, offset, category_id]
  );
  return rows;
};

export const getJobsByCategoryTotalCount = async (category_id) => {
  const { rows } = await pool.query('SELECT COUNT(*) FROM jobs j WHERE j.category_id = $1 AND j.is_active',
    [category_id]);
  return parseInt(rows[0].count, 10);
};

export const getJobsBySearchQuery = async (limit, offset, search) => {
  const { rows } = await pool.query(
    `SELECT j.id, j.title, j.technologies, c.company_name, j.company_id, j.category_id, ci.name AS city_name FROM jobs j LEFT JOIN company c ON j.company_id = c.id LEFT JOIN city ci ON c.city_id = ci.id WHERE
  to_tsvector('english',
    COALESCE(j.title, '') || ' ' ||
    COALESCE(array_to_string(j.technologies, ' '), '')
  ) @@ plainto_tsquery('english', $1)
AND j.is_active ORDER BY j.created_at DESC, j.id DESC LIMIT $2 OFFSET $3`,
    [search, limit, offset]
  );
  return rows;
};

export const getJobsBySearchTotalCount = async (search) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM jobs j LEFT JOIN company c ON j.company_id = c.id LEFT JOIN city ci ON c.city_id = ci.id WHERE
  to_tsvector('english',
    COALESCE(j.title, '') || ' ' ||
    COALESCE(array_to_string(j.technologies, ' '), '')
  ) @@ plainto_tsquery('english', $1)
AND j.is_active`,
    [search]
  );
  return parseInt(rows[0].count, 10);
};

export const getJobsBySearchAndCityQuery = async (limit, offset, search, city) => {
  const { rows } = await pool.query(
    `SELECT j.id, j.title, j.technologies, c.company_name, j.company_id, j.category_id, ci.name AS city_name FROM jobs j LEFT JOIN company c ON j.company_id = c.id LEFT JOIN city ci ON c.city_id = ci.id WHERE
  to_tsvector('english',
    COALESCE(j.title, '') || ' ' ||
    COALESCE(array_to_string(j.technologies, ' '), '')
  ) @@ plainto_tsquery('english', $1)
AND LOWER(ci.name) = LOWER($2) AND j.is_active ORDER BY j.created_at DESC, j.id DESC LIMIT $3 OFFSET $4`,
    [search, city, limit, offset]
  );
  return rows;
};

export const getJobsBySearchAndCityTotalCount = async (search, city) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) 
FROM jobs j
LEFT JOIN company c ON j.company_id = c.id
LEFT JOIN city ci ON c.city_id = ci.id
WHERE to_tsvector('english',
    COALESCE(j.title, '') || ' ' || 
    COALESCE(array_to_string(j.technologies, ' '), '')
  ) @@ plainto_tsquery('english', $1) 
AND LOWER(ci.name) = LOWER($2)
AND j.is_active`,
    [search, city]
  );
  return parseInt(rows[0].count, 10);
};

export const getJobsByCityQuery = async (limit, offset, city) => {
  const { rows } = await pool.query(
    `SELECT j.id, j.title, j.technologies, c.company_name, j.company_id, j.category_id, ci.name AS city_name FROM jobs j LEFT JOIN company c ON j.company_id = c.id LEFT JOIN city ci ON c.city_id = ci.id WHERE LOWER(ci.name) = LOWER($1) AND j.is_active ORDER BY j.created_at DESC, j.id DESC LIMIT $2 OFFSET $3`,
    [city, limit, offset]
  );
  return rows;
};

export const getJobsByCityTotalCount = async (city) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) FROM jobs j LEFT JOIN company c ON j.company_id = c.id LEFT JOIN city ci ON c.city_id = ci.id WHERE LOWER(ci.name) = LOWER($1) AND j.is_active`,
    [city]
  );
  return parseInt(rows[0].count, 10);
};

export const getJobByIdQuery = async (id) => {
  const { rows } = await pool.query('select j.id, j.title, j.requirements, j.responsibilities, j.url, j.created_at, j.technologies, j.company_id, j.is_active, ca.name AS category_name FROM jobs j LEFT JOIN category ca ON j.category_id = ca.id WHERE j.id=$1',
    [id]);
  return rows[0];
};

//other
export const getTotalJobsCompaniesCountQuery = async () => {
  const { rows } = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM company) AS "companiesCount",
      (SELECT COUNT(*) FROM jobs WHERE is_active) AS "jobsCount"
  `);

  return {
    companiesCount: parseInt(rows[0].companiesCount, 10),
    jobsCount: parseInt(rows[0].jobsCount, 10),
  };
};

export const getCategoriesQuery = async () => {
  const { rows } = await pool.query(
    'SELECT c.id, c.si_name, COUNT(j.id) AS job_count FROM category c LEFT JOIN jobs j ON j.category_id = c.id AND j.is_active GROUP BY c.id ORDER BY c.id;'
  );
  return rows;
};

export const getCitiesQuery = async () => {
  const { rows: cities } = await pool.query(
    'SELECT id, name FROM city order by name',
  );
  return cities;
};