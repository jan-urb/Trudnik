const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;

    if (status >= 500) {
        console.error(err);
        return res.status(status).json({ message: 'Internal Server Error' });
    }

    res.status(status).json({ message: err.message });
};

export default errorHandler;
