// Main Computer System
const Computer = {
    state: 'closed', // closed, booting, login, desktop
    userData: null,
    apps: [],
    job: null,
    theme: 'dark',
    wallpaper: 1,
    clockInterval: null,

    init() {
        this.setupNUIListener();
        this.setupEventListeners();
        this.startClock();
    },

    setupNUIListener() {
        window.addEventListener('message', (event) => {
            const data = event.data;
            switch (data.action) {
                case 'open':
                    this.open();
                    break;
                case 'close':
                    this.shutdown();
                    break;
                case 'initData':
                    this.onInitData(data);
                    break;
                case 'notify':
                    this.notify(data.type, data.message);
                    break;
                case 'bankData':
                    if (typeof BankApp !== 'undefined') BankApp.onData(data.data);
                    break;
                case 'emailData':
                    if (typeof EmailApp !== 'undefined') EmailApp.onData(data.data);
                    break;
                case 'twitterData':
                    if (typeof TwitterApp !== 'undefined') TwitterApp.onData(data.data);
                    break;
                case 'notesData':
                    if (typeof NotesApp !== 'undefined') NotesApp.onData(data.data);
                    break;
                case 'mdtData':
                    if (typeof MDTApp !== 'undefined') MDTApp.onData(data.data);
                    break;
            }
        });
    },

    setupEventListeners() {
        // Login
        const loginBtn = document.getElementById('login-btn');
        const loginInput = document.getElementById('login-password');
        if (loginBtn) loginBtn.addEventListener('click', () => this.attemptLogin());
        if (loginInput) loginInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.attemptLogin();
        });

        // Start menu
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.addEventListener('click', () => this.toggleStartMenu());

        // Power button
        const powerBtn = document.getElementById('power-btn');
        if (powerBtn) powerBtn.addEventListener('click', () => this.close());

        // Notification panel
        const notifBtn = document.getElementById('notification-btn');
        if (notifBtn) notifBtn.addEventListener('click', () => this.toggleNotifPanel());

        // Close panels on desktop click
        const desktop = document.getElementById('desktop-icons');
        if (desktop) desktop.addEventListener('click', () => {
            this.hideStartMenu();
            this.hideNotifPanel();
        });

        // Start menu search
        const startSearch = document.querySelector('.start-search');
        if (startSearch) startSearch.addEventListener('input', (e) => this.filterApps(e.target.value));

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.state === 'desktop') {
                    this.close();
                }
            }
        });
    },

    open() {
        const container = document.getElementById('computer-container');
        container.classList.remove('hidden');
        this.state = 'booting';
        this.showScreen('boot-screen');
        SoundManager.play('boot');

        setTimeout(() => {
            this.showScreen('login-screen');
            this.state = 'login';
            this.updateLoginTime();
        }, 3000);
    },

    onInitData(data) {
        this.userData = data.userData;
        this.job = data.job;
        this.apps = data.apps || [];
        this.theme = data.userData?.theme || 'dark';
        this.wallpaper = data.userData?.wallpaper || 1;

        this.applyTheme(this.theme);
    },

    attemptLogin() {
        const input = document.getElementById('login-password');
        const error = document.getElementById('login-error');
        const password = input.value;

        if (!this.userData) {
            if (password === '1234') {
                this.loginSuccess();
            } else {
                this.loginFail(error, input);
            }
            return;
        }

        if (password === this.userData.password) {
            this.loginSuccess();
        } else {
            this.loginFail(error, input);
        }
    },

    loginSuccess() {
        SoundManager.play('login');
        this.state = 'desktop';
        this.showScreen('desktop-screen');
        this.renderDesktopIcons();
        this.renderStartMenuApps();
        document.getElementById('login-password').value = '';
    },

    loginFail(error, input) {
        SoundManager.play('error');
        error.classList.remove('hidden');
        input.parentElement.classList.add('shake');
        setTimeout(() => {
            error.classList.add('hidden');
            input.parentElement.classList.remove('shake');
        }, 2000);
    },

    close() {
        SoundManager.play('shutdown');
        WindowManager.closeAll();
        this.hideStartMenu();
        this.hideNotifPanel();
        this.state = 'closed';

        const container = document.getElementById('computer-container');
        container.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            container.classList.add('hidden');
            container.style.animation = '';
            this.showScreen('boot-screen');
            Utils.nuiCallback('close');
        }, 300);
    },

    shutdown() {
        this.state = 'closed';
        const container = document.getElementById('computer-container');
        container.classList.add('hidden');
        WindowManager.closeAll();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.remove('hidden');
    },

    // Desktop
    renderDesktopIcons() {
        const container = document.getElementById('desktop-icons');
        container.innerHTML = '';

        const filteredApps = this.apps.filter(app => {
            if (!app.enabled) return false;
            if (app.jobs && app.jobs.length > 0) {
                return app.jobs.includes(this.job);
            }
            return true;
        });

        filteredApps.forEach(app => {
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            icon.innerHTML = `
                <div class="desktop-icon-img" style="background:${app.color}">
                    <i class="fas fa-${app.icon}"></i>
                </div>
                <span class="desktop-icon-name">${app.name}</span>
            `;
            icon.addEventListener('dblclick', () => this.openApp(app.id));
            container.appendChild(icon);
        });
    },

    renderStartMenuApps() {
        const container = document.getElementById('start-menu-apps');
        container.innerHTML = '';

        const filteredApps = this.apps.filter(app => {
            if (!app.enabled) return false;
            if (app.jobs && app.jobs.length > 0) {
                return app.jobs.includes(this.job);
            }
            return true;
        });

        filteredApps.forEach(app => {
            const item = document.createElement('div');
            item.className = 'start-app-item';
            item.innerHTML = `
                <div class="app-icon" style="background:${app.color}">
                    <i class="fas fa-${app.icon}"></i>
                </div>
                <span class="app-name">${app.name}</span>
            `;
            item.addEventListener('click', () => {
                this.openApp(app.id);
                this.hideStartMenu();
            });
            container.appendChild(item);
        });
    },

    openApp(appId) {
        SoundManager.play('click');
        switch (appId) {
            case 'mdt': MDTApp.open(); break;
            case 'bank': BankApp.open(); break;
            case 'browser': BrowserApp.open(); break;
            case 'files': FilesApp.open(); break;
            case 'twitter': TwitterApp.open(); break;
            case 'cameras': CamerasApp.open(); break;
            case 'emails': EmailApp.open(); break;
            case 'hacking': HackingApp.open(); break;
            case 'settings': SettingsApp.open(); break;
            case 'notes': NotesApp.open(); break;
        }
    },

    filterApps(query) {
        const items = document.querySelectorAll('.start-app-item');
        const q = query.toLowerCase();
        items.forEach(item => {
            const name = item.querySelector('.app-name').textContent.toLowerCase();
            item.style.display = name.includes(q) ? '' : 'none';
        });
    },

    // Start Menu
    toggleStartMenu() {
        const menu = document.getElementById('start-menu');
        menu.classList.toggle('hidden');
        this.hideNotifPanel();
    },

    hideStartMenu() {
        const menu = document.getElementById('start-menu');
        if (menu) menu.classList.add('hidden');
    },

    // Notification Panel
    toggleNotifPanel() {
        const panel = document.getElementById('notification-panel');
        panel.classList.toggle('hidden');
        this.hideStartMenu();
    },

    hideNotifPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) panel.classList.add('hidden');
    },

    // Theme
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.theme = theme;
    },

    // Notifications
    notify(type, message) {
        const container = document.getElementById('toast-container');
        const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle', warning: 'exclamation-triangle' };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i><span>${Utils.escapeHtml(message)}</span>`;

        container.appendChild(toast);
        SoundManager.play(type === 'error' ? 'error' : 'notify');

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    // Clock
    startClock() {
        const update = () => {
            const now = new Date();
            const timeStr = Utils.formatTime(now);
            const dateStr = Utils.formatShortDate(now);

            const clockTime = document.querySelector('.clock-time');
            const clockDate = document.querySelector('.clock-date');
            if (clockTime) clockTime.textContent = timeStr;
            if (clockDate) clockDate.textContent = dateStr;
        };

        update();
        this.clockInterval = setInterval(update, 1000);
    },

    updateLoginTime() {
        const now = new Date();
        const timeEl = document.getElementById('login-time');
        const dateEl = document.getElementById('login-date');
        if (timeEl) timeEl.textContent = Utils.formatTime(now);
        if (dateEl) dateEl.textContent = Utils.formatDate(now);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => Computer.init());
