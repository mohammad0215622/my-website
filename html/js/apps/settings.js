// Settings Application
const SettingsApp = {
    currentSection: 'personalization',

    open() {
        const content = this.render();
        WindowManager.create('settings', 'Settings', 'gear', '#6b7280', content, {
            width: 800,
            height: 550
        });
    },

    render() {
        return `
            <div class="settings-layout" style="height:100%;margin:-16px">
                <div class="settings-nav">
                    <div class="settings-nav-item active" onclick="SettingsApp.switchSection('personalization', this)">
                        <i class="fas fa-palette"></i> Personalization
                    </div>
                    <div class="settings-nav-item" onclick="SettingsApp.switchSection('display', this)">
                        <i class="fas fa-display"></i> Display
                    </div>
                    <div class="settings-nav-item" onclick="SettingsApp.switchSection('sound', this)">
                        <i class="fas fa-volume-up"></i> Sound
                    </div>
                    <div class="settings-nav-item" onclick="SettingsApp.switchSection('security', this)">
                        <i class="fas fa-shield-halved"></i> Security
                    </div>
                    <div class="settings-nav-item" onclick="SettingsApp.switchSection('about', this)">
                        <i class="fas fa-info-circle"></i> About
                    </div>
                </div>
                <div class="settings-content" id="settings-main">
                    ${this.renderPersonalization()}
                </div>
            </div>
        `;
    },

    switchSection(section, el) {
        this.currentSection = section;
        document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
        if (el) el.classList.add('active');

        const content = document.getElementById('settings-main');
        if (!content) return;

        switch (section) {
            case 'personalization': content.innerHTML = this.renderPersonalization(); break;
            case 'display': content.innerHTML = this.renderDisplay(); break;
            case 'sound': content.innerHTML = this.renderSound(); break;
            case 'security': content.innerHTML = this.renderSecurity(); break;
            case 'about': content.innerHTML = this.renderAbout(); break;
        }
    },

    renderPersonalization() {
        return `
            <div class="settings-section">
                <h3>Theme</h3>
                <div style="display:flex;gap:8px;margin-bottom:20px">
                    <button class="app-btn ${Computer.theme === 'dark' ? 'primary' : ''}" onclick="SettingsApp.setTheme('dark')">
                        <i class="fas fa-moon"></i> Dark
                    </button>
                    <button class="app-btn ${Computer.theme === 'light' ? 'primary' : ''}" onclick="SettingsApp.setTheme('light')">
                        <i class="fas fa-sun"></i> Light
                    </button>
                    <button class="app-btn ${Computer.theme === 'cyberpunk' ? 'primary' : ''}" onclick="SettingsApp.setTheme('cyberpunk')">
                        <i class="fas fa-bolt"></i> Cyberpunk
                    </button>
                </div>
            </div>
            <div class="settings-section">
                <h3>Wallpaper</h3>
                <div class="wallpaper-grid">
                    <div class="wallpaper-option ${Computer.wallpaper === 1 ? 'active' : ''}" 
                        onclick="SettingsApp.setWallpaper(1)"
                        style="background:linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)"></div>
                    <div class="wallpaper-option ${Computer.wallpaper === 2 ? 'active' : ''}" 
                        onclick="SettingsApp.setWallpaper(2)"
                        style="background:linear-gradient(135deg, #0a0014, #1a0033, #2a0052)"></div>
                    <div class="wallpaper-option ${Computer.wallpaper === 3 ? 'active' : ''}" 
                        onclick="SettingsApp.setWallpaper(3)"
                        style="background:linear-gradient(135deg, #0d1117, #161b22, #1c2128)"></div>
                    <div class="wallpaper-option ${Computer.wallpaper === 4 ? 'active' : ''}" 
                        onclick="SettingsApp.setWallpaper(4)"
                        style="background:linear-gradient(135deg, #ff6b6b, #ee5a24, #f0932b)"></div>
                    <div class="wallpaper-option ${Computer.wallpaper === 5 ? 'active' : ''}" 
                        onclick="SettingsApp.setWallpaper(5)"
                        style="background:linear-gradient(135deg, #6c5ce7, #a29bfe, #74b9ff)"></div>
                    <div class="wallpaper-option ${Computer.wallpaper === 6 ? 'active' : ''}" 
                        onclick="SettingsApp.setWallpaper(6)"
                        style="background:linear-gradient(135deg, #00b894, #00cec9, #0984e3)"></div>
                </div>
            </div>
        `;
    },

    renderDisplay() {
        return `
            <div class="settings-section">
                <h3>Display Settings</h3>
                <div class="settings-option">
                    <div>
                        <div class="option-label">Animations</div>
                        <div class="option-desc">Enable window animations and effects</div>
                    </div>
                    <div class="toggle-switch active" onclick="this.classList.toggle('active')"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <div class="option-label">Transparency</div>
                        <div class="option-desc">Enable blur and transparency effects</div>
                    </div>
                    <div class="toggle-switch active" onclick="this.classList.toggle('active')"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <div class="option-label">Desktop Icons</div>
                        <div class="option-desc">Show application icons on desktop</div>
                    </div>
                    <div class="toggle-switch active" onclick="this.classList.toggle('active')"></div>
                </div>
            </div>
        `;
    },

    renderSound() {
        return `
            <div class="settings-section">
                <h3>Sound Settings</h3>
                <div class="settings-option">
                    <div>
                        <div class="option-label">Sound Effects</div>
                        <div class="option-desc">Enable UI sound effects</div>
                    </div>
                    <div class="toggle-switch ${SoundManager.enabled ? 'active' : ''}" 
                        onclick="SoundManager.toggle();this.classList.toggle('active')"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <div class="option-label">Volume</div>
                        <div class="option-desc">Adjust sound volume</div>
                    </div>
                    <input type="range" min="0" max="100" value="${SoundManager.volume * 100}" 
                        style="width:120px" oninput="SoundManager.setVolume(this.value/100)">
                </div>
                <div class="settings-option">
                    <div>
                        <div class="option-label">Notification Sounds</div>
                        <div class="option-desc">Play sound on new notifications</div>
                    </div>
                    <div class="toggle-switch active" onclick="this.classList.toggle('active')"></div>
                </div>
            </div>
        `;
    },

    renderSecurity() {
        return `
            <div class="settings-section">
                <h3>Change Password</h3>
                <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
                    <input type="password" class="app-input" id="settings-old-pass" placeholder="Current password">
                    <input type="password" class="app-input" id="settings-new-pass" placeholder="New password">
                    <input type="password" class="app-input" id="settings-confirm-pass" placeholder="Confirm new password">
                    <button class="app-btn primary" onclick="SettingsApp.changePassword()">
                        <i class="fas fa-key"></i> Update Password
                    </button>
                </div>
            </div>
        `;
    },

    renderAbout() {
        return `
            <div class="settings-section">
                <h3>About This Computer</h3>
                <div style="padding:20px;background:var(--bg-surface);border-radius:var(--radius);border:1px solid var(--border)">
                    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
                        <svg viewBox="0 0 88 88" width="48" height="48">
                            <rect x="0" y="0" width="40" height="40" fill="#00adef"/>
                            <rect x="44" y="0" width="40" height="40" fill="#7fba00"/>
                            <rect x="0" y="44" width="40" height="40" fill="#f25022"/>
                            <rect x="44" y="44" width="40" height="40" fill="#ffb900"/>
                        </svg>
                        <div>
                            <h2 style="color:var(--text-primary);font-size:18px">FiveM OS</h2>
                            <p style="color:var(--text-muted);font-size:13px">Version 1.0.0</p>
                        </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
                        <span style="color:var(--text-muted)">Developer:</span>
                        <span style="color:var(--text-primary)">Mohammad</span>
                        <span style="color:var(--text-muted)">Framework:</span>
                        <span style="color:var(--text-primary)">QBCore / ESX</span>
                        <span style="color:var(--text-muted)">Build:</span>
                        <span style="color:var(--text-primary)">2024.1.0</span>
                        <span style="color:var(--text-muted)">License:</span>
                        <span style="color:var(--text-primary)">Private</span>
                    </div>
                </div>
            </div>
        `;
    },

    setTheme(theme) {
        Computer.applyTheme(theme);
        Utils.nuiCallback('updateSettings', { theme, wallpaper: Computer.wallpaper });
        Computer.notify('success', 'Theme updated');
        // Re-render to update active buttons
        const content = document.getElementById('settings-main');
        if (content && this.currentSection === 'personalization') {
            content.innerHTML = this.renderPersonalization();
        }
    },

    setWallpaper(index) {
        Computer.wallpaper = index;
        const wallpapers = [
            'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
            'linear-gradient(135deg, #0a0014, #1a0033, #2a0052)',
            'linear-gradient(135deg, #0d1117, #161b22, #1c2128)',
            'linear-gradient(135deg, #ff6b6b, #ee5a24, #f0932b)',
            'linear-gradient(135deg, #6c5ce7, #a29bfe, #74b9ff)',
            'linear-gradient(135deg, #00b894, #00cec9, #0984e3)'
        ];
        const wp = document.getElementById('desktop-wallpaper');
        if (wp) wp.style.background = wallpapers[index - 1] || wallpapers[0];

        Utils.nuiCallback('updateSettings', { theme: Computer.theme, wallpaper: index });
        Computer.notify('success', 'Wallpaper updated');

        const content = document.getElementById('settings-main');
        if (content && this.currentSection === 'personalization') {
            content.innerHTML = this.renderPersonalization();
        }
    },

    changePassword() {
        const oldPass = document.getElementById('settings-old-pass')?.value;
        const newPass = document.getElementById('settings-new-pass')?.value;
        const confirmPass = document.getElementById('settings-confirm-pass')?.value;

        if (!oldPass || !newPass || !confirmPass) {
            Computer.notify('error', 'Please fill all fields');
            return;
        }

        if (newPass !== confirmPass) {
            Computer.notify('error', 'Passwords do not match');
            return;
        }

        if (newPass.length < 4) {
            Computer.notify('error', 'Password must be at least 4 characters');
            return;
        }

        Utils.nuiCallback('updatePassword', { oldPassword: oldPass, newPassword: newPass });
    }
};
