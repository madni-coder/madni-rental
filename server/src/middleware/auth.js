const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorised — no token' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id, email: payload.email };
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorised — invalid token' });
    }
}

module.exports = auth;
