export interface MonsterData {
    hungry: number;
    happy: number;
    poos: number;
    sick: number;
    age: number;
    alive: boolean;
}

export class Monster {
    hungry: number;
    happy: number;
    poos: number;
    sick: number;
    age: number;
    alive: boolean;

    constructor(data: MonsterData) {
        this.hungry = data.hungry;
        this.happy = data.happy;
        this.poos = data.poos;
        this.sick = data.sick;
        this.age = data.age;
        this.alive = data.alive;
    }

    update(data: Partial<MonsterData>) {
        if (data.hungry !== undefined) this.hungry = data.hungry;
        if (data.happy  !== undefined) this.happy  = data.happy;
        if (data.poos   !== undefined) this.poos   = data.poos;
        if (data.sick   !== undefined) this.sick   = data.sick;
        if (data.age    !== undefined) this.age    = data.age;
        if (data.alive  !== undefined) this.alive  = data.alive;
    }
}
