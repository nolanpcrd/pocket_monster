const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', '..', 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'pocket_monster.db');
let db;

const initializeDB = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        console.log('Connexion à la base de données SQLite établie');
        return db;
    } catch (error) {
        console.error('Erreur d\'initialisation de SQLite:', error);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error('La base de données n\'a pas été initialisée');
    }
    return db;
};

module.exports = { initializeDB, getDB };