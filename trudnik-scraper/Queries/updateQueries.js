const updateCompanyLastCheckedAtQuery = (id) => {
    const text = `
    UPDATE company SET last_checked_at=NOW() WHERE id=$1;`;

    const values = [id];

    return { text, values };
};

const deactivateCompanyJobsQuery = (companyId) => {
    const text = `
    UPDATE jobs SET is_active=false WHERE company_id=$1 AND is_active;`;

    const values = [companyId];

    return { text, values };
};

export { updateCompanyLastCheckedAtQuery, deactivateCompanyJobsQuery };
