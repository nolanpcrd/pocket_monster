const express = require('express');
const Friendship = require('../models/Friendship');
const auth = require('../middleware/auth');
const { getDB } = require('../config/db');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const friends = await Friendship.getFriends(req.user.id);
        res.json(friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/pending', auth, async (req, res) => {
    try {
        const pendingRequests = await Friendship.getPendingRequests(req.user.id);
        res.json(pendingRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/sent', auth, async (req, res) => {
    try {
        const db = getDB();
        const sentRequests = await db.all(`
            SELECT f.id, f.user_id2, f.created_at, u.username 
            FROM friendships f
            JOIN users u ON f.user_id2 = u.id
            WHERE f.user_id1 = ? AND f.status_id = 1
        `, [req.user.id]);

        res.json(sentRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { friend_id } = req.body;

        if (req.user.id === parseInt(friend_id)) {
            return res.status(400).json({ message: 'You can t add yourself as a friend' });
        }

        const friendshipId = await Friendship.create(req.user.id, friend_id);
        res.status(201).json({ id: friendshipId });
    } catch (error) {
        console.error(error);
        if (error.message.includes('existe déjà')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const friendshipId = req.params.id;
        await Friendship.accept(friendshipId, req.user.id);
        res.json({ message: 'Friendship request accepted' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const friendshipId = req.params.id;
        await Friendship.delete(friendshipId, req.user.id);
        res.json({ message: 'Friendship deleted' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.get('/search', auth, async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Search term required' });
        }

        const db = getDB();
        const searchTerm = `%${query}%`;

        const users = await db.all(`
            SELECT id, username, email 
            FROM users 
            WHERE (username LIKE ?) AND id != ?
            LIMIT 20
        `, [searchTerm, req.user.id]);

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;