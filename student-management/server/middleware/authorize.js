const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        // 1. Get the token from the request header
        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json({ error: "Not Authorized" });
        }

        // 2. Verify the token using the secret key
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

        // 3. Attach the user payload to the request for the next function to use
        req.user = payload;
        next();

    } catch (err) {
        console.error(err.message);
        return res.status(403).json({ error: "Not Authorized" });
    }
};