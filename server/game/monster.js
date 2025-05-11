const { getDB } = require("../config/db");

class Monster {
    constructor(id, name, typeId, happy, hungry, sick, age, money, level, exp, alive = true) {
        this.id = id;
        this.name = name;
        this.typeId = typeId;
        this.happy = happy;
        this.hungry = hungry;
        this.sick = sick;
        this.ageSick = null;
        this.age = age;
        this.money = money;
        this.level = level;
        this.exp = 0;
        this.poos = 0;
        this.alive = alive;
        this.loopTimer = 1000 * 30; // 30 seconds

        this.updateCallback = null;
        this.ageLoop();
        this.dayLoop();
    }

    setUpdateCallback(cb) {
        this.updateCallback = cb;
    }

    triggerUpdate() {
        if (this.updateCallback && this.alive) {
            this.updateCallback(this);
        }
    }

    feed() {
        const RESTORE = 20;
        this.hungry = Math.min(100, this.hungry + RESTORE);
        this.triggerUpdate();
    }

    play() {
        const FILL = 15;
        this.happy = Math.min(100, this.happy + FILL);
        this.triggerUpdate();
    }

    heal() {
        if (this.sick) {
            this.sick = 0;
            this.ageSick = null;
            this.triggerUpdate();
        }
    }

    cleanPoop() {
        if (this.poos > 0) {
            this.poos--;
            this.triggerUpdate();
        }
    }

    die() {
        this.alive = false;
        this.triggerUpdate();
    }

    poop() {
        this.poos++;
        this.triggerUpdate();
    }

    sicken() {
        this.sick = 1;
        this.ageSick = this.age;
        this.triggerUpdate();
    }

    ageLoop() {
        setInterval(() => {
            if (!this.alive) return;
            this.age++;
            if (this.age > 90 && Math.random() < 0.1) this.die();
            if (this.ageSick != null) {
                this.ageSick++;
                if (this.age - this.ageSick > 5 && Math.random() < 0.5) {
                    this.die();
                }
            }
            this.triggerUpdate();
        }, this.loopTimer);
    }

    dayLoop() {
        setInterval(() => {
            if (!this.alive) return;

            const happyDecrease = Math.floor(Math.random() * 5) + 3;
            setTimeout(() => {
                if (this.alive) {
                    this.happy = Math.max(0, this.happy - happyDecrease);
                    this.triggerUpdate();
                }
            }, Math.random() * this.loopTimer * 0.5);

            const hungryDecrease = Math.floor(Math.random() * 6) + 5;
            setTimeout(() => {
                if (this.alive) {
                    this.hungry = Math.max(0, this.hungry - hungryDecrease);
                    if (this.hungry === 0 && Math.random() < 0.3) {
                        this.sicken();
                    }
                    this.triggerUpdate();
                }
            }, Math.random() * this.loopTimer * 0.7);

            const poops = Math.floor(Math.random() * 11) + 5;
            for (let i = 0; i < poops; i++) {
                setTimeout(() => this.alive && this.poop(), Math.random() * this.loopTimer);
            }
            setTimeout(() => this.alive && this.feed(), this.loopTimer);
            if (Math.random() < 0.2) {
                setTimeout(() => this.alive && this.sicken(), Math.random() * this.loopTimer);
            }
        }, this.loopTimer);
    }

    async save() {
        if (!this.id) return;
        const db = getDB();
        await db.run(
            `UPDATE monsters
             SET name = ?, type_id = ?, happy = ?, hungry = ?, sick = ?,
                 age = ?, money = ?, level = ?, experience = ?, alive = ?
             WHERE id = ?`,
            [this.name, this.typeId, this.happy, this.hungry, this.sick,
                this.age, this.money, this.level, this.exp, this.alive,
                this.id]
        );
    }
}

module.exports = { Monster };