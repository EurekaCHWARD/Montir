const jwt = require('jsonwebtoken');
require('dotenv').config();

const requireAuthUser = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ message: 'Token tidak terdeteksi, harap login terlebih dahulu!' });
    }

    const token = authHeader.split(' ')[1]; // Expecting 'Bearer <token>'
    if (!token) {
        return res.status(400).json({ message: 'Token tidak terdeteksi, harap login terlebih dahulu!' });
    }

    // Verify JWT
    jwt.verify(token, process.env.SECRET_STRING, (err, decodedToken) => {
        if (err) {
            return res.status(400).json({ message: 'Anda tidak memiliki hak untuk mengakses request ini!' });
        }
        req.user = decodedToken; // Set the decoded token to req.user
        next();
    });
};

const requireAuthAdmin = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(400).json({ message: 'Token tidak terdeteksi, harap login terlebih dahulu!' });
    }

    const token = authHeader.split(' ')[1]; // Expecting 'Bearer <token>'
    if (!token) {
        return res.status(400).json({ message: 'Token tidak terdeteksi, harap login terlebih dahulu!' });
    }

    // Verify JWT
    jwt.verify(token, process.env.SECRET_STRING_ADMIN, (err, decodedToken) => {
        if (err) {
            return res.status(400).json({ message: 'Request ini hanya bisa diakses oleh admin!' });
        }
        req.user = decodedToken; // Set the decoded token to req.user
        next();
    });
};

module.exports = { requireAuthUser, requireAuthAdmin };