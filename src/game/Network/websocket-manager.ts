import { Monster, type MonsterData } from '../Models/Monster';

export class WebSocketManager {
    private ws: WebSocket | undefined;
    public monster: Monster | null = null;

    constructor() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            return;
        }
        this.ws = new WebSocket(`ws://localhost:8080?token=${token}`);
        this.ws.onopen = () => console.log('WS connected');
        this.ws.onmessage = (event) => this.handleMessage(event);
        this.ws.onclose   = () => console.log('WS closed');
    }

    private handleMessage(event: MessageEvent) {
        const msg = JSON.parse(event.data);
        console.log('WS message', msg);
        switch (msg.type) {
            case 'monster_init':
                this.monster = new Monster(msg.data as MonsterData);
                this.updateUI();
                break;
            case 'monster_update':
                if (this.monster) {
                    this.monster.update(msg.data as Partial<MonsterData>);
                    this.updateUI();
                }
                break;
        }
    }

    sendAction(action: 'feed' | 'play' | 'heal' | 'clean') {
        this.ws?.send(JSON.stringify({ type: action }));
    }

    updateUI() {
        if (!this.monster) return;
        (document.getElementById('hungry') as HTMLElement).innerText = this.monster.hungry.toString()+ '%';
        (document.getElementById('happy')  as HTMLElement).innerText = this.monster.happy.toString() + '%';
        (document.getElementById('sick')   as HTMLElement).innerText = this.monster.sick.toString() === "1" ? 'Yes' : 'No';
        (document.getElementById('age')    as HTMLElement).innerText = this.monster.age.toString() + ' years';
    }
}