const { getDB } = require('../config/db');

class Friendship {
    static async create(user_id1, user_id2) {
        const db = getDB();
        try {
            const user1 = await db.get('SELECT id FROM users WHERE id = ?', [user_id1]);
            const user2 = await db.get('SELECT id FROM users WHERE id = ?', [user_id2]);

            if (!user1 || !user2) {
                throw new Error('Un ou plusieurs utilisateurs n\'existent pas');
            }

            const existingFriendship = await db.get(
                'SELECT * FROM friendships WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?)',
                [user_id1, user_id2, user_id2, user_id1]
            );

            if (existingFriendship) {
                throw new Error('Une relation d\'amitié existe déjà entre ces utilisateurs');
            }

            const result = await db.run(
                'INSERT INTO friendships (user_id1, user_id2) VALUES (?, ?)',
                [user_id1, user_id2]
            );

            return result.lastID;
        } catch (error) {
            throw error;
        }
    }

    static async accept(friendshipId, userId) {
        const db = getDB();
        try {
            const friendship = await db.get(
                'SELECT * FROM friendships WHERE id = ? AND user_id2 = ? AND status_id = 1',
                [friendshipId, userId]
            );

            if (!friendship) {
                throw new Error('Demande d\'amitié non trouvée ou vous n\'êtes pas autorisé à l\'accepter');
            }

            await db.run(
                'UPDATE friendships SET status_id = 2 WHERE id = ?',
                [friendshipId]
            );

            return true;
        } catch (error) {
            throw error;
        }
    }

    static async delete(friendshipId, userId) {
        const db = getDB();
        try {
            const friendship = await db.get(
                'SELECT * FROM friendships WHERE id = ? AND (user_id1 = ? OR user_id2 = ?)',
                [friendshipId, userId, userId]
            );

            if (!friendship) {
                throw new Error('Relation d\'amitié non trouvée ou vous n\'êtes pas autorisé à la supprimer');
            }

            await db.run('DELETE FROM friendships WHERE id = ?', [friendshipId]);

            return true;
        } catch (error) {
            throw error;
        }
    }

    static async getPendingRequests(userId) {
        const db = getDB();
        try {
            return await db.all(`
                SELECT f.id, f.user_id1, f.created_at, u.username 
                FROM friendships f
                JOIN users u ON f.user_id1 = u.id
                WHERE f.user_id2 = ? AND f.status_id = 1
            `, [userId]);
        } catch (error) {
            throw error;
        }
    }

    static async getFriends(userId) {
        const db = getDB();
        try {
            return await db.all(`
                SELECT 
                    f.id as friendship_id,
                    CASE 
                        WHEN f.user_id1 = ? THEN f.user_id2
                        ELSE f.user_id1
                    END as friend_id,
                    u.username,
                    u.email,
                    f.created_at
                FROM friendships f
                JOIN users u ON (
                    CASE 
                        WHEN f.user_id1 = ? THEN u.id = f.user_id2
                        ELSE u.id = f.user_id1
                    END
                )
                WHERE (f.user_id1 = ? OR f.user_id2 = ?) AND f.status_id = 2
            `, [userId, userId, userId, userId]);
        } catch (error) {
            throw error;
        }
    }

    static async areFriends(user_id1, user_id2) {
        const db = getDB();
        try {
            const friendship = await db.get(`
                SELECT * FROM friendships 
                WHERE ((user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?)) 
                AND status_id = 2
            `, [user_id1, user_id2, user_id2, user_id1]);

            return !!friendship;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Friendship;