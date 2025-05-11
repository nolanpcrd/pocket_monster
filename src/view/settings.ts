let settingsView: SettingsView | null = null;

document.getElementById("settings-button")?.addEventListener("click", () => {
    if (!settingsView) {
        settingsView = new SettingsView();
    } else {
        settingsView.render();
    }
});

class SettingsView {
    constructor() {
        this.render();
    }

    render() {
        if (document.getElementById("settings-container")) {
            return;
        }
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = "/settings.css";
        document.head.appendChild(style);
        const settingsContainer = document.createElement("div");
        settingsContainer.id = "settings-container";
        if (settingsContainer) {
            settingsContainer.innerHTML = `
                <button id="close-settings">X</button>
                <h1>Settings</h1>
                <div>
                    <label for="sound">Sound:</label>
                    <input type="checkbox" id="sound" checked />
                </div>
                <button id="save-settings">Save Settings</button>
            `;
            document.body.appendChild(settingsContainer);
            document.getElementById("save-settings")?.addEventListener("click", () => {
                this.saveSettings();
            });
            document.getElementById("close-settings")?.addEventListener("click", () => {
                this.closeSettings();
            });
        }
    }

    saveSettings() {
        const soundEnabled = (document.getElementById("sound") as HTMLInputElement).checked;
        localStorage.setItem("sound", soundEnabled.toString());
        this.closeSettings();
    }

    closeSettings() {
        const settingsContainer = document.getElementById("settings-container");
        if (settingsContainer) {
            settingsContainer.remove();
        }
    }
}