const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const authRoutes = require('./routes/auth');
const friendshipRoutes = require('./routes/friendships');
const { initializeDB } = require('./config/db');
const { initializeWebSocket } = require('./websocket/websocket');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/friendships', friendshipRoutes);
app.use(express.static('public'));

async function startServer() {
    try {
        await initializeDB();

        const server = http.createServer(app);

        initializeWebSocket();

        server.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

startServer();