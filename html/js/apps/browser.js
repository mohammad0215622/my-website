// Browser Application
const BrowserApp = {
    history: [],
    bookmarks: [
        { name: 'Maze Bank', url: 'www.mazebank.com', icon: 'building-columns' },
        { name: 'LifeInvader', url: 'www.lifeinvader.com', icon: 'thumbs-up' },
        { name: 'Bleeter', url: 'www.bleeter.biz', icon: 'hashtag' },
        { name: 'Dynasty 8', url: 'www.dynasty8realestate.com', icon: 'home' },
        { name: 'San Andreas DMV', url: 'www.sadmv.gov', icon: 'id-card' },
        { name: 'Legendary Motorsport', url: 'www.legendarymotorsport.net', icon: 'car' }
    ],

    open() {
        const content = this.render();
        WindowManager.create('browser', 'Browser', 'globe', '#6366f1', content, {
            width: 900,
            height: 600
        });
    },

    render() {
        return `
            <div style="display:flex;flex-direction:column;height:100%;margin:-16px">
                <div class="browser-toolbar">
                    <button class="browser-nav-btn"><i class="fas fa-arrow-left"></i></button>
                    <button class="browser-nav-btn"><i class="fas fa-arrow-right"></i></button>
                    <button class="browser-nav-btn"><i class="fas fa-rotate-right"></i></button>
                    <input type="text" class="browser-url-bar" id="browser-url" placeholder="Enter URL..." value="">
                    <button class="browser-nav-btn"><i class="fas fa-star"></i></button>
                </div>
                <div class="browser-content" id="browser-page">
                    <div class="browser-homepage">
                        <h1 style="font-size:24px;margin-bottom:8px">
                            <i class="fas fa-globe" style="color:var(--primary)"></i> iFruit Browser
                        </h1>
                        <p style="color:var(--text-muted);margin-bottom:24px">Search the web or visit a site</p>
                        <div style="display:flex;gap:8px;max-width:500px;margin:0 auto 30px">
                            <input type="text" class="app-input" placeholder="Search..." id="browser-search-input"
                                style="border-radius:20px;padding:10px 16px">
                            <button class="app-btn primary" style="border-radius:20px" onclick="BrowserApp.search()">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:500px;margin:0 auto">
                            ${this.bookmarks.map(b => `
                                <div class="start-app-item" onclick="BrowserApp.navigate('${b.url}')" style="padding:12px">
                                    <div class="app-icon" style="background:var(--bg-hover);width:36px;height:36px">
                                        <i class="fas fa-${b.icon}" style="font-size:14px;color:var(--text-primary)"></i>
                                    </div>
                                    <span class="app-name" style="font-size:11px">${b.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    navigate(url) {
        const urlBar = document.getElementById('browser-url');
        const page = document.getElementById('browser-page');
        if (urlBar) urlBar.value = url;
        if (page) {
            page.innerHTML = `
                <div style="text-align:center;padding:40px">
                    <div class="loading-spinner" style="margin:0 auto 16px"></div>
                    <p style="color:var(--text-muted)">Loading ${Utils.escapeHtml(url)}...</p>
                    <p style="color:var(--text-muted);font-size:12px;margin-top:20px">
                        This is a simulated browser. External sites are not accessible.
                    </p>
                </div>
            `;
        }
        this.history.push(url);
    },

    search() {
        const input = document.getElementById('browser-search-input');
        if (input && input.value) {
            this.navigate('search.web/' + encodeURIComponent(input.value));
        }
    }
};
