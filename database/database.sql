CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status TEXT NOT NULL
);

INSERT INTO status (status) VALUES
('pending'),
('accepted');

CREATE TABLE IF NOT EXISTS friendships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id1 INTEGER NOT NULL,
  user_id2 INTEGER NOT NULL,
  status_id INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id1) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id2) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES status(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS monsters_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL
);

INSERT INTO monsters_types (type) VALUES
('Egg'),
('Baby'),
('AdolescentNinja'),
('AdolescentFlower'),
('AdolescentAstronaut'),
('AdolescentPirate'),
('AdolescentKnight'),
('AdolescentVampire'),
('AdolescentDragon'),
('AdolescentRobot'),
('AdultNinja'),
('AdultFlower'),
('AdultAstronaut'),
('AdultPirate'),
('AdultKnight'),
('AdultVampire'),
('AdultDragon'),
('AdultRobot'),
('ElderNinja'),
('ElderFlower'),
('ElderAstronaut'),
('ElderPirate'),
('ElderKnight'),
('ElderVampire'),
('ElderDragon'),
('ElderRobot');

CREATE TABLE IF NOT EXISTS monsters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  hungry INTEGER NOT NULL DEFAULT 100,
  happy INTEGER NOT NULL DEFAULT 100,
  sick INTEGER NOT NULL DEFAULT 0,
  age INTEGER NOT NULL DEFAULT 0,
  money INTEGER NOT NULL DEFAULT 0,
  type_id INTEGER NOT NULL DEFAULT 1,
  level INTEGER NOT NULL DEFAULT 0,
  experience INTEGER NOT NULL DEFAULT 0,
  alive INTEGER NOT NULL DEFAULT 1,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (type_id) REFERENCES monsters_types(id) ON DELETE CASCADE
);