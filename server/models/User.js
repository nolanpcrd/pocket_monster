const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
    static async create(userData) {
        const { username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const db = getDB();

        try {
            const result = await db.run(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );
            return result.lastID;
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        const db = getDB();
        try {
            return await db.get('SELECT * FROM users WHERE email = ?', [email]);
        } catch (error) {
            throw error;
        }
    }

    static async findByToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const db = getDB();
            const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            return user;
        } catch (error) {
            throw new Error('Token invalide ou expiré: ' + error.message);
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;