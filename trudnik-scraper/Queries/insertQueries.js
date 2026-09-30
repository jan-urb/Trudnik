const insertJobsQuery = (company_id, title, requirements, responsibilities, url, technologies, category_id) => {
    const text = `
    INSERT INTO jobs (title, requirements, responsibilities, url, company_id, technologies, category_id, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, true);`;

    const values = [title, requirements, responsibilities, url, company_id, technologies, category_id];

    return { text, values };
};

export { insertJobsQuery };
