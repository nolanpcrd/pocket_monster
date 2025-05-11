const { Monster } = require("./monster");
const { getDB } = require("../config/db");
const jwt = require('jsonwebtoken');

class Monsters {
    constructor() {
        this.monsters = new Map();
        this.loadAll();
        this.saveLoop();
    }

    async loadAll() {
        const db = getDB();
        try {
            const rows = await db.all('SELECT * FROM monsters');
            rows.forEach(row => {
                const monster = new Monster(
                    row.id, row.name, row.type_id,
                    row.happy, row.hungry, row.sick,
                    row.age, row.money, row.level, row.exp, row.alive
                );
                this.monsters.set(row.user_id, monster);
            });
        } catch (err) {
            console.error('Error loading monsters:', err);
        }
    }

    async getOrCreateByToken(token) {
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            throw new Error('Invalid or expired token: ' + err.message);
        }

        let monster = this.monsters.get(userId);

        if (!monster) {
            monster = new Monster(null, "Monster", 1, 100, 100, 0, 0, 0, 1, 0, true);
            const db = getDB();
            try {
                db.run(
                    `INSERT INTO monsters
                 (name, type_id, happy, hungry, sick, age, money, level, user_id, experience, alive)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [monster.name, monster.typeId, monster.happy,
                        monster.hungry, monster.sick, monster.age,
                        monster.money, monster.level, userId, monster.exp, monster.alive]);
                const newId = await db.get('SELECT last_insert_rowid() AS id');
                console.log('New monster created with ID:', newId.id);
                monster.id = newId.id;
            } catch (error) {
                console.error('Erreur lors de la création du monstre:', error);
                throw error;
            }
            this.monsters.set(userId, monster);
            monster.new = true;
        } else {
            monster.new = false;
        }
        return monster;
    }

    async saveAll() {
        for (const monster of this.monsters.values()) {
            await monster.save();
        }
    }

    saveLoop() {
        setInterval(() => this.saveAll(), 30000);
    }
}

module.exports = { Monsters };