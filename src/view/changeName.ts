import type {WebSocketManager} from "../game/Network/websocket-manager.ts";


function init() {
    const existingContainer = document.getElementById('change-name');
    const existingStyles = document.querySelector('link[href="changeName.css"]');
    if (existingContainer) {
        existingContainer.remove();
    }
    if (existingStyles) {
        existingStyles.remove();
    }
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = 'changeName.css';
    document.head.appendChild(styles);

    const changeNameContainer = document.createElement('div');
    changeNameContainer.id = 'change-name';

    changeNameContainer.innerHTML = `
    <div class="change-name-content">
        <h2>Change Monster Name</h2>
        <input type="text" id="name-input" placeholder="Enter new name" />
        <button id="change-name-button">Change Name</button>
    </div>
    `;
    return changeNameContainer;
}

export function changeName(websocketManager: WebSocketManager) {
    const changeNameContainer = init();
    document.body.appendChild(changeNameContainer);
    const nameInput = document.getElementById('name-input') as HTMLInputElement;
    const changeNameButton = document.getElementById('change-name-button') as HTMLButtonElement;
    nameInput.value = localStorage.getItem('monsterName') || 'Monster';

    changeNameButton.addEventListener('click', () => {
        const newName = nameInput.value.trim();
        if (newName) {
            websocketManager.sendName(newName);
            changeNameContainer.remove();
        } else {
            alert('Please enter a valid name.');
        }
    });
}