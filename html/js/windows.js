// Window Management System
const WindowManager = {
    windows: [],
    activeWindow: null,
    zIndex: 100,
    maxWindows: 8,

    create(appId, title, icon, color, content, options = {}) {
        if (this.windows.length >= this.maxWindows) {
            Computer.notify('warning', 'Maximum windows reached. Close some windows first.');
            return null;
        }

        const existing = this.windows.find(w => w.appId === appId);
        if (existing && !options.allowMultiple) {
            this.focus(existing.id);
            if (existing.minimized) this.restore(existing.id);
            return existing;
        }

        const id = Utils.generateId();
        const width = options.width || 800;
        const height = options.height || 550;
        const x = options.x || Math.max(50, (window.innerWidth - width) / 2 + Math.random() * 60 - 30);
        const y = options.y || Math.max(30, (window.innerHeight - height - 48) / 2 + Math.random() * 40 - 20);

        const win = {
            id, appId, title, icon, color,
            x, y, width, height,
            minimized: false,
            maximized: false,
            focused: true
        };

        this.windows.push(win);
        this.renderWindow(win, content);
        this.focus(id);
        this.updateTaskbar();
        SoundManager.play('click');

        return win;
    },

    renderWindow(win, content) {
        const container = document.getElementById('windows-container');
        const el = document.createElement('div');
        el.id = `window-${win.id}`;
        el.className = 'window focused';
        el.style.cssText = `left:${win.x}px;top:${win.y}px;width:${win.width}px;height:${win.height}px;z-index:${++this.zIndex}`;

        el.innerHTML = `
            <div class="window-titlebar" data-window="${win.id}">
                <div class="window-titlebar-left">
                    <div class="window-titlebar-icon" style="color:${win.color}">
                        <i class="fas fa-${win.icon}"></i>
                    </div>
                    <span class="window-titlebar-title">${Utils.escapeHtml(win.title)}</span>
                </div>
                <div class="window-titlebar-actions">
                    <button class="window-btn minimize" onclick="WindowManager.minimize('${win.id}')">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="window-btn maximize" onclick="WindowManager.toggleMaximize('${win.id}')">
                        <i class="fas fa-square"></i>
                    </button>
                    <button class="window-btn close" onclick="WindowManager.close('${win.id}')">
                        <i class="fas fa-xmark"></i>
                    </button>
                </div>
            </div>
            <div class="window-content" id="window-content-${win.id}">${content}</div>
            <div class="window-resize" data-window="${win.id}"></div>
        `;

        container.appendChild(el);
        this.initDrag(el, win);
        this.initResize(el, win);

        el.addEventListener('mousedown', () => this.focus(win.id));
    },

    initDrag(el, win) {
        const titlebar = el.querySelector('.window-titlebar');
        let isDragging = false, startX, startY, startLeft, startTop;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-btn')) return;
            if (win.maximized) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = win.x;
            startTop = win.y;
            el.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            win.x = startLeft + dx;
            win.y = Math.max(0, startTop + dy);
            el.style.left = win.x + 'px';
            el.style.top = win.y + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                el.style.transition = '';
            }
        });
    },

    initResize(el, win) {
        const handle = el.querySelector('.window-resize');
        let isResizing = false, startX, startY, startW, startH;

        handle.addEventListener('mousedown', (e) => {
            if (win.maximized) return;
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startW = win.width;
            startH = win.height;
            el.style.transition = 'none';
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            win.width = Math.max(400, startW + dx);
            win.height = Math.max(300, startH + dy);
            el.style.width = win.width + 'px';
            el.style.height = win.height + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                el.style.transition = '';
            }
        });
    },

    focus(id) {
        this.windows.forEach(w => {
            const el = document.getElementById(`window-${w.id}`);
            if (el) {
                if (w.id === id) {
                    w.focused = true;
                    el.classList.add('focused');
                    el.style.zIndex = ++this.zIndex;
                } else {
                    w.focused = false;
                    el.classList.remove('focused');
                }
            }
        });
        this.activeWindow = id;
        this.updateTaskbar();
    },

    minimize(id) {
        const win = this.windows.find(w => w.id === id);
        if (!win) return;
        win.minimized = true;
        const el = document.getElementById(`window-${id}`);
        if (el) el.classList.add('minimized');
        this.updateTaskbar();
    },

    restore(id) {
        const win = this.windows.find(w => w.id === id);
        if (!win) return;
        win.minimized = false;
        const el = document.getElementById(`window-${id}`);
        if (el) el.classList.remove('minimized');
        this.focus(id);
    },

    toggleMaximize(id) {
        const win = this.windows.find(w => w.id === id);
        if (!win) return;
        const el = document.getElementById(`window-${id}`);
        if (!el) return;

        win.maximized = !win.maximized;
        el.classList.toggle('maximized');

        if (!win.maximized) {
            el.style.left = win.x + 'px';
            el.style.top = win.y + 'px';
            el.style.width = win.width + 'px';
            el.style.height = win.height + 'px';
        }
    },

    close(id) {
        const idx = this.windows.findIndex(w => w.id === id);
        if (idx === -1) return;

        const el = document.getElementById(`window-${id}`);
        if (el) {
            el.style.animation = 'windowClose 0.15s ease forwards';
            setTimeout(() => el.remove(), 150);
        }

        this.windows.splice(idx, 1);

        if (this.activeWindow === id && this.windows.length > 0) {
            this.focus(this.windows[this.windows.length - 1].id);
        }

        this.updateTaskbar();
    },

    closeAll() {
        [...this.windows].forEach(w => this.close(w.id));
    },

    updateTaskbar() {
        const taskbarApps = document.getElementById('taskbar-apps');
        if (!taskbarApps) return;

        taskbarApps.innerHTML = '';
        this.windows.forEach(win => {
            const btn = document.createElement('button');
            btn.className = 'taskbar-app-btn';
            if (win.focused && !win.minimized) btn.classList.add('active');
            if (win.minimized) btn.classList.add('minimized');
            btn.innerHTML = `<i class="fas fa-${win.icon}" style="color:${win.color}"></i>`;
            btn.title = win.title;
            btn.onclick = () => {
                if (win.minimized) {
                    this.restore(win.id);
                } else if (win.focused) {
                    this.minimize(win.id);
                } else {
                    this.focus(win.id);
                }
            };
            taskbarApps.appendChild(btn);
        });
    },

    getContentElement(id) {
        return document.getElementById(`window-content-${id}`);
    }
};
