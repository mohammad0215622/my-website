// Files Application
const FilesApp = {
    currentFolder: 'documents',
    folders: {
        documents: [
            { name: 'Resume.docx', icon: 'file-word', color: '#2b579a' },
            { name: 'Notes.txt', icon: 'file-lines', color: '#6b7280' },
            { name: 'Budget.xlsx', icon: 'file-excel', color: '#217346' }
        ],
        downloads: [
            { name: 'photo_001.jpg', icon: 'file-image', color: '#f59e0b' },
            { name: 'setup.exe', icon: 'file-code', color: '#6366f1' },
            { name: 'invoice.pdf', icon: 'file-pdf', color: '#dc2626' }
        ],
        pictures: [
            { name: 'vacation.jpg', icon: 'file-image', color: '#f59e0b' },
            { name: 'family.png', icon: 'file-image', color: '#f59e0b' },
            { name: 'car.jpg', icon: 'file-image', color: '#f59e0b' },
            { name: 'screenshot.png', icon: 'file-image', color: '#f59e0b' }
        ],
        desktop: [
            { name: 'shortcut.lnk', icon: 'file', color: '#6b7280' },
            { name: 'todo.txt', icon: 'file-lines', color: '#6b7280' }
        ]
    },

    open() {
        const content = this.render();
        WindowManager.create('files', 'File Explorer', 'folder', '#f59e0b', content, {
            width: 800,
            height: 500
        });
    },

    render() {
        return `
            <div class="files-layout" style="height:100%;margin:-16px">
                <div class="files-sidebar">
                    <div class="files-sidebar-item active" onclick="FilesApp.switchFolder('documents', this)">
                        <i class="fas fa-file-alt"></i> Documents
                    </div>
                    <div class="files-sidebar-item" onclick="FilesApp.switchFolder('downloads', this)">
                        <i class="fas fa-download"></i> Downloads
                    </div>
                    <div class="files-sidebar-item" onclick="FilesApp.switchFolder('pictures', this)">
                        <i class="fas fa-image"></i> Pictures
                    </div>
                    <div class="files-sidebar-item" onclick="FilesApp.switchFolder('desktop', this)">
                        <i class="fas fa-desktop"></i> Desktop
                    </div>
                </div>
                <div class="files-content" id="files-grid-content">
                    ${this.renderFiles('documents')}
                </div>
            </div>
        `;
    },

    renderFiles(folder) {
        const files = this.folders[folder] || [];
        if (files.length === 0) {
            return '<p style="color:var(--text-muted);text-align:center;padding:40px">Folder is empty</p>';
        }

        return `
            <div class="files-grid">
                ${files.map(f => `
                    <div class="file-item" ondblclick="FilesApp.openFile('${f.name}')">
                        <i class="fas fa-${f.icon}" style="color:${f.color}"></i>
                        <span>${f.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    switchFolder(folder, el) {
        this.currentFolder = folder;
        document.querySelectorAll('.files-sidebar-item').forEach(i => i.classList.remove('active'));
        if (el) el.classList.add('active');

        const content = document.getElementById('files-grid-content');
        if (content) content.innerHTML = this.renderFiles(folder);
    },

    openFile(name) {
        Computer.notify('info', `Opening ${name}...`);
    }
};
