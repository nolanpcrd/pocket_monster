const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesome);

const styles = document.createElement('link');
styles.rel = 'stylesheet';
styles.href = 'hud.css';
document.head.appendChild(styles);

const hudContainer = document.createElement('div');
hudContainer.id = 'hud';
document.body.appendChild(hudContainer);

const hudContent = `
    <div class="hud-stats">
        <div class="hud-item" id="hud-hunger">
            <div class="hud-icon">
                <i class="fas fa-utensils"></i>
            </div>
            <div class="hud-value">
                <div class="hud-label">Hunger</div>
                <span id="hungry">-%</span>
            </div>
        </div>
        
        <div class="hud-item" id="hud-happy">
            <div class="hud-icon">
                <i class="fas fa-smile-beam"></i>
            </div>
            <div class="hud-value">
                <div class="hud-label">Happiness</div>
                <span id="happy">-%</span>
            </div>
        </div>
        
        <div class="hud-item" id="hud-sick">
            <div class="hud-icon">
                <i class="fas fa-heartbeat"></i>
            </div>
            <div class="hud-value">
                <div class="hud-label">Sick</div>
                <span id="sick">-</span>
            </div>
        </div>
        
        <div class="hud-item" id="hud-age">
            <div class="hud-icon">
                <i class="fas fa-birthday-cake"></i>
            </div>
            <div class="hud-value">
                <div class="hud-label">Âge</div>
                <span id="age">- years</span>
            </div>
        </div>
    </div>
`;
hudContainer.innerHTML = hudContent;