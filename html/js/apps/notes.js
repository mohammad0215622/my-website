// Notes Application
const NotesApp = {
    notes: [],
    selectedNote: null,

    open() {
        const content = this.render();
        WindowManager.create('notes', 'Notes', 'sticky-note', '#fbbf24', content, {
            width: 750,
            height: 500
        });
        Utils.nuiCallback('getNotes');
    },

    render() {
        return `
            <div class="notes-layout" style="height:100%;margin:-16px">
                <div class="notes-sidebar">
                    <div class="notes-sidebar-header">
                        <span style="font-size:13px;font-weight:600;color:var(--text-primary)">Notes</span>
                        <button class="app-btn" onclick="NotesApp.newNote()" style="padding:4px 8px">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="notes-list" id="notes-sidebar-list">
                        <p style="color:var(--text-muted);text-align:center;padding:16px;font-size:12px">No notes</p>
                    </div>
                </div>
                <div class="notes-editor" id="notes-editor">
                    <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted)">
                        <p>Select a note or create a new one</p>
                    </div>
                </div>
            </div>
        `;
    },

    newNote() {
        this.selectedNote = null;
        const editor = document.getElementById('notes-editor');
        if (!editor) return;

        editor.innerHTML = `
            <input type="text" id="note-title-input" placeholder="Note title..." 
                style="border:none;background:none;color:var(--text-primary);font-size:18px;font-weight:600;outline:none;width:100%;margin-bottom:12px">
            <textarea id="note-content-input" placeholder="Start writing..." 
                style="flex:1;border:none;background:none;color:var(--text-primary);font-size:14px;outline:none;resize:none;line-height:1.6;width:100%"></textarea>
            <div style="display:flex;gap:8px;margin-top:12px">
                <button class="app-btn primary" onclick="NotesApp.saveNote()">
                    <i class="fas fa-save"></i> Save
                </button>
            </div>
        `;

        document.getElementById('note-title-input')?.focus();
    },

    selectNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (!note) return;
        this.selectedNote = note;

        const editor = document.getElementById('notes-editor');
        if (!editor) return;

        editor.innerHTML = `
            <input type="text" id="note-title-input" placeholder="Note title..." value="${Utils.escapeHtml(note.title || '')}"
                style="border:none;background:none;color:var(--text-primary);font-size:18px;font-weight:600;outline:none;width:100%;margin-bottom:12px">
            <textarea id="note-content-input" placeholder="Start writing..." 
                style="flex:1;border:none;background:none;color:var(--text-primary);font-size:14px;outline:none;resize:none;line-height:1.6;width:100%">${Utils.escapeHtml(note.content || '')}</textarea>
            <div style="display:flex;gap:8px;margin-top:12px">
                <button class="app-btn primary" onclick="NotesApp.saveNote()">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="app-btn danger" onclick="NotesApp.deleteNote(${note.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

        // Update sidebar active state
        document.querySelectorAll('.note-item').forEach(el => el.classList.remove('active'));
        const noteEl = document.querySelector(`[data-note-id="${id}"]`);
        if (noteEl) noteEl.classList.add('active');
    },

    saveNote() {
        const title = document.getElementById('note-title-input')?.value;
        const content = document.getElementById('note-content-input')?.value;

        if (!title) {
            Computer.notify('error', 'Please enter a title');
            return;
        }

        Utils.nuiCallback('saveNote', {
            id: this.selectedNote?.id || null,
            title,
            content: content || ''
        });
    },

    deleteNote(id) {
        Utils.nuiCallback('deleteNote', { id });
        this.notes = this.notes.filter(n => n.id !== id);
        this.selectedNote = null;
        this.renderNotesList();

        const editor = document.getElementById('notes-editor');
        if (editor) {
            editor.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted)">
                    <p>Select a note or create a new one</p>
                </div>
            `;
        }
    },

    renderNotesList() {
        const list = document.getElementById('notes-sidebar-list');
        if (!list) return;

        if (this.notes.length === 0) {
            list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:16px;font-size:12px">No notes</p>';
            return;
        }

        list.innerHTML = this.notes.map(note => `
            <div class="note-item ${this.selectedNote?.id === note.id ? 'active' : ''}" 
                data-note-id="${note.id}" onclick="NotesApp.selectNote(${note.id})">
                <div class="note-title">${Utils.escapeHtml(note.title || 'Untitled')}</div>
                <div class="note-date">${note.updated_at ? Utils.formatRelativeTime(note.updated_at) : ''}</div>
            </div>
        `).join('');
    },

    onData(notes) {
        this.notes = notes || [];
        this.renderNotesList();
    }
};
