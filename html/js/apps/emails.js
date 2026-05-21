// Email Application
const EmailApp = {
    emails: [],
    currentView: 'inbox',
    selectedEmail: null,

    open() {
        const content = this.render();
        WindowManager.create('emails', 'Email', 'envelope', '#8b5cf6', content, {
            width: 800,
            height: 550
        });
        Utils.nuiCallback('getEmails');
    },

    render() {
        return `
            <div style="margin:-16px;display:flex;flex-direction:column;height:calc(100% + 32px)">
                <div class="app-header">
                    <h2><i class="fas fa-envelope" style="color:#8b5cf6;margin-right:8px"></i>Email</h2>
                    <div class="app-toolbar">
                        <button class="app-btn primary" onclick="EmailApp.showCompose()">
                            <i class="fas fa-pen"></i> Compose
                        </button>
                        <button class="app-btn" onclick="Utils.nuiCallback('getEmails')">
                            <i class="fas fa-refresh"></i>
                        </button>
                    </div>
                </div>
                <div id="email-content" style="flex:1;overflow-y:auto;padding:12px">
                    <div style="text-align:center;padding:30px">
                        <div class="loading-spinner" style="margin:0 auto"></div>
                    </div>
                </div>
            </div>
        `;
    },

    showCompose() {
        const content = document.getElementById('email-content');
        if (!content) return;

        content.innerHTML = `
            <div style="padding:8px;display:flex;flex-direction:column;gap:12px">
                <h3 style="color:var(--text-primary);font-size:16px">New Email</h3>
                <input type="text" class="app-input" id="email-to" placeholder="To (Citizen ID)">
                <input type="text" class="app-input" id="email-subject" placeholder="Subject">
                <textarea class="app-textarea" id="email-body" placeholder="Write your message..." style="min-height:200px"></textarea>
                <div style="display:flex;gap:8px">
                    <button class="app-btn primary" onclick="EmailApp.sendEmail()">
                        <i class="fas fa-paper-plane"></i> Send
                    </button>
                    <button class="app-btn" onclick="EmailApp.showInbox()">Cancel</button>
                </div>
            </div>
        `;
    },

    showInbox() {
        this.currentView = 'inbox';
        this.renderEmails();
    },

    sendEmail() {
        const recipient = document.getElementById('email-to')?.value;
        const subject = document.getElementById('email-subject')?.value;
        const body = document.getElementById('email-body')?.value;

        if (!recipient || !subject || !body) {
            Computer.notify('error', 'Please fill in all fields');
            return;
        }

        Utils.nuiCallback('sendEmail', { recipient, subject, body });
        this.showInbox();
    },

    deleteEmail(id) {
        Utils.nuiCallback('deleteEmail', { id });
        this.emails = this.emails.filter(e => e.id !== id);
        this.renderEmails();
        Computer.notify('success', 'Email deleted');
    },

    viewEmail(id) {
        const email = this.emails.find(e => e.id === id);
        if (!email) return;

        const content = document.getElementById('email-content');
        if (!content) return;

        content.innerHTML = `
            <div style="padding:8px">
                <button class="app-btn" onclick="EmailApp.showInbox()" style="margin-bottom:16px">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <div style="border:1px solid var(--border);border-radius:var(--radius);padding:20px;background:var(--bg-surface)">
                    <h3 style="font-size:18px;color:var(--text-primary);margin-bottom:8px">
                        ${Utils.escapeHtml(email.subject || 'No Subject')}
                    </h3>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border)">
                        <span style="font-size:13px;color:var(--text-secondary)">
                            From: <strong>${Utils.escapeHtml(email.sender || 'Unknown')}</strong>
                        </span>
                        <span style="font-size:12px;color:var(--text-muted)">
                            ${email.created_at ? Utils.formatRelativeTime(email.created_at) : ''}
                        </span>
                    </div>
                    <p style="color:var(--text-primary);line-height:1.6;font-size:14px;white-space:pre-wrap">
                        ${Utils.escapeHtml(email.body || '')}
                    </p>
                </div>
                <div style="margin-top:12px;display:flex;gap:8px">
                    <button class="app-btn" onclick="EmailApp.showCompose()">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    <button class="app-btn danger" onclick="EmailApp.deleteEmail(${email.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    },

    renderEmails() {
        const content = document.getElementById('email-content');
        if (!content) return;

        if (this.emails.length === 0) {
            content.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px">No emails</p>';
            return;
        }

        content.innerHTML = `
            <div class="email-list">
                ${this.emails.map(email => `
                    <div class="email-item" onclick="EmailApp.viewEmail(${email.id})">
                        <span class="email-sender">${Utils.escapeHtml(email.sender || 'Unknown')}</span>
                        <span class="email-subject">${Utils.escapeHtml(email.subject || 'No Subject')}</span>
                        <span class="email-preview">${Utils.escapeHtml((email.body || '').substring(0, 50))}</span>
                        <span class="email-time">${email.created_at ? Utils.formatRelativeTime(email.created_at) : ''}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    onData(emails) {
        this.emails = emails || [];
        this.renderEmails();
    }
};
