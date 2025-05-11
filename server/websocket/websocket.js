const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { Monsters } = require('../game/monsters');

let monstersMgr = null;
const wss = new WebSocket.Server({ port: 8080 });
const active = new Map();

module.exports.initializeWebSocket = () => {
    monstersMgr = new Monsters();
    console.log('Serveur WebSocket démarré sur le port 8080');
};

wss.on('connection', async (ws, req) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const token = url.searchParams.get('token');
        if (!token) {
            ws.close(1008, 'Token manquant');
            return;
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error('Token invalide:', err);
            ws.close(1008, 'Token invalide');
            return;
        }

        ws.userId = decoded.id;
        ws.token = token;

        const monster = await monstersMgr.getOrCreateByToken(token);
        active.set(monster.id, { ws, monster });

        monster.setUpdateCallback(m => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'monster_update',
                    data: {
                        hungry: m.hungry,
                        happy: m.happy,
                        poos: m.poos,
                        sick: m.sick,
                        age: m.age,
                        alive: m.alive
                    }
                }));
            }
        });

        ws.send(JSON.stringify({
            type: 'monster_init',
            data: {
                hungry: monster.hungry,
                happy: monster.happy,
                poos: monster.poos,
                sick: monster.sick,
                age: monster.age,
                alive: monster.alive
            }
        }));

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                if (!monster.alive) return;

                switch (data.type) {
                    case 'feed':    monster.feed();      break;
                    case 'play':    monster.play();      break;
                    case 'heal':    monster.heal();      break;
                    case 'clean':   monster.cleanPoop(); break;
                    default: break;
                }
            } catch (error) {
                console.error('Erreur de traitement du message:', error);
            }
        });

        ws.on('close', () => {
            active.delete(monster.id);
        });

    } catch (error) {
        console.error('Erreur de gestion de connexion WebSocket:', error);
        if (ws.readyState === WebSocket.OPEN) {
            ws.close(1011, 'Erreur serveur');
        }
    }
});