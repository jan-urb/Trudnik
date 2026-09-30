const getCompanyCareerWebsiteQuery = () => {
  const text = `
    SELECT
    id, company_name, registration_number, career_page
    FROM company
    WHERE
      career_page IS NOT NULL
      AND (last_checked_at IS NULL OR last_checked_at < NOW() - INTERVAL '10 days')
    ORDER BY id;
  `;

  const values = [];

  return { text, values };
};


const getCategoryQuery = () => {
  const text = `
    SELECT
    id, name
    FROM category
    ORDER BY id;
  `;

  const values = [];

  return { text, values };
};


export { getCompanyCareerWebsiteQuery, getCategoryQuery };
