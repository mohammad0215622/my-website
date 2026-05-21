// MDT Application (Police/EMS)
const MDTApp = {
    records: [],
    currentTab: 'records',

    open() {
        const content = this.render();
        WindowManager.create('mdt', 'MDT - Records System', 'shield-halved', '#3b82f6', content, {
            width: 900,
            height: 600
        });
        Utils.nuiCallback('getMDT', { query: '' });
    },

    render() {
        return `
            <div class="mdt-layout" style="height:100%">
                <div class="mdt-sidebar">
                    <div class="mdt-sidebar-item active" onclick="MDTApp.switchTab('records')">
                        <i class="fas fa-file-alt"></i> Records
                    </div>
                    <div class="mdt-sidebar-item" onclick="MDTApp.switchTab('search')">
                        <i class="fas fa-search"></i> Search
                    </div>
                    <div class="mdt-sidebar-item" onclick="MDTApp.switchTab('new')">
                        <i class="fas fa-plus"></i> New Record
                    </div>
                    <div class="mdt-sidebar-item" onclick="MDTApp.switchTab('warrants')">
                        <i class="fas fa-gavel"></i> Warrants
                    </div>
                    <div class="mdt-sidebar-item" onclick="MDTApp.switchTab('officers')">
                        <i class="fas fa-users"></i> Officers
                    </div>
                </div>
                <div class="mdt-content" id="mdt-main-content">
                    <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted)">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            </div>
        `;
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.mdt-sidebar-item').forEach(el => el.classList.remove('active'));
        event.currentTarget.classList.add('active');

        const content = document.getElementById('mdt-main-content');
        if (!content) return;

        switch (tab) {
            case 'records':
                this.renderRecords(content);
                break;
            case 'search':
                this.renderSearch(content);
                break;
            case 'new':
                this.renderNewRecord(content);
                break;
            case 'warrants':
                content.innerHTML = '<p style="color:var(--text-muted);padding:20px;text-align:center">No active warrants</p>';
                break;
            case 'officers':
                content.innerHTML = '<p style="color:var(--text-muted);padding:20px;text-align:center">Officer roster not available</p>';
                break;
        }
    },

    renderRecords(container) {
        if (this.records.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);padding:20px;text-align:center">No records found</p>';
            return;
        }

        let html = '<div style="padding:12px">';
        this.records.forEach(record => {
            html += `
                <div class="mdt-record">
                    <div class="record-name">${Utils.escapeHtml(record.name || 'Unknown')}</div>
                    <span class="record-category">${Utils.escapeHtml(record.category || 'General')}</span>
                    <p class="record-details">${Utils.escapeHtml(record.details || 'No details')}</p>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    renderSearch(container) {
        container.innerHTML = `
            <div style="padding:16px">
                <div style="display:flex;gap:8px;margin-bottom:16px">
                    <input type="text" class="app-input" id="mdt-search-input" placeholder="Search by name or details...">
                    <button class="app-btn primary" onclick="MDTApp.doSearch()">
                        <i class="fas fa-search"></i> Search
                    </button>
                </div>
                <div id="mdt-search-results"></div>
            </div>
        `;
    },

    renderNewRecord(container) {
        container.innerHTML = `
            <div style="padding:16px;display:flex;flex-direction:column;gap:12px">
                <h3 style="color:var(--text-primary);font-size:16px">New Record</h3>
                <input type="text" class="app-input" id="mdt-new-name" placeholder="Subject Name">
                <select class="app-input" id="mdt-new-category">
                    <option value="arrest">Arrest</option>
                    <option value="citation">Citation</option>
                    <option value="report">Report</option>
                    <option value="warrant">Warrant</option>
                    <option value="general">General</option>
                </select>
                <textarea class="app-textarea" id="mdt-new-details" placeholder="Details..."></textarea>
                <button class="app-btn primary" onclick="MDTApp.submitRecord()">
                    <i class="fas fa-save"></i> Submit Record
                </button>
            </div>
        `;
    },

    doSearch() {
        const query = document.getElementById('mdt-search-input')?.value || '';
        Utils.nuiCallback('getMDT', { query });
    },

    submitRecord() {
        const name = document.getElementById('mdt-new-name')?.value;
        const category = document.getElementById('mdt-new-category')?.value;
        const details = document.getElementById('mdt-new-details')?.value;

        if (!name || !details) {
            Computer.notify('error', 'Please fill in all fields');
            return;
        }

        Utils.nuiCallback('addMDTRecord', { name, category, details });
        Computer.notify('success', 'Record submitted');
    },

    onData(records) {
        this.records = records || [];
        const content = document.getElementById('mdt-main-content');
        if (content && this.currentTab === 'records') {
            this.renderRecords(content);
        }
        if (content && this.currentTab === 'search') {
            const results = document.getElementById('mdt-search-results');
            if (results) {
                let html = '';
                this.records.forEach(record => {
                    html += `
                        <div class="mdt-record">
                            <div class="record-name">${Utils.escapeHtml(record.name || 'Unknown')}</div>
                            <span class="record-category">${Utils.escapeHtml(record.category || 'General')}</span>
                            <p class="record-details">${Utils.escapeHtml(record.details || '')}</p>
                        </div>
                    `;
                });
                results.innerHTML = html || '<p style="color:var(--text-muted)">No results found</p>';
            }
        }
    }
};
