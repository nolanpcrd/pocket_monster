const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');

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

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;