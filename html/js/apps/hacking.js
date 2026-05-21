// Hacking/DarkNet Application
const HackingApp = {
    lines: [],
    commands: {
        help: 'Available commands: scan, crack, exploit, decrypt, clear, exit',
        scan: 'Scanning network... Found 3 vulnerable targets.\n  > 192.168.1.45 [OPEN] Port 22, 80, 443\n  > 10.0.0.12 [FILTERED] Port 8080\n  > 172.16.0.1 [OPEN] Port 21, 25',
        crack: 'Initiating brute force...\n  [████████░░] 80% - Testing combinations...\n  [██████████] 100% - Hash cracked: a1b2c3d4\n  Password: ********',
        exploit: 'Deploying payload...\n  > Establishing connection...\n  > Injecting shellcode...\n  > Access granted. Shell opened on target.',
        decrypt: 'Decrypting file...\n  [████████░░] 78%\n  [██████████] 100%\n  File decrypted successfully. Contents: [CLASSIFIED]',
        clear: '__CLEAR__',
        exit: 'Connection closed.'
    },

    open() {
        const content = this.render();
        WindowManager.create('hacking', 'DarkNet Terminal', 'skull-crossbones', '#dc2626', content, {
            width: 750,
            height: 500
        });
        this.addLine('info', '╔══════════════════════════════════════════╗');
        this.addLine('info', '║         DARKNET TERMINAL v2.1            ║');
        this.addLine('info', '║     Unauthorized access prohibited        ║');
        this.addLine('info', '╚══════════════════════════════════════════╝');
        this.addLine('', '');
        this.addLine('info', 'Type "help" for available commands.');
    },

    render() {
        return `
            <div style="margin:-16px;height:calc(100% + 32px);display:flex;flex-direction:column;background:#0a0a0a">
                <div class="hacking-terminal" id="hacking-output" style="flex:1;overflow-y:auto">
                </div>
                <div class="hacking-input" style="padding:12px;border-top:1px solid #222">
                    <span>root@darknet:~$</span>
                    <input type="text" id="hacking-cmd-input" placeholder="Enter command..." 
                        onkeypress="if(event.key==='Enter')HackingApp.executeCommand()">
                </div>
            </div>
        `;
    },

    addLine(type, text) {
        const output = document.getElementById('hacking-output');
        if (!output) return;

        const lines = text.split('\n');
        lines.forEach((line, i) => {
            const el = document.createElement('div');
            el.className = 'terminal-line';
            el.style.animationDelay = (i * 0.05) + 's';

            if (type === 'prompt') {
                el.innerHTML = `<span class="terminal-prompt">root@darknet:~$</span> ${Utils.escapeHtml(line)}`;
            } else if (type === 'error') {
                el.innerHTML = `<span class="terminal-error">${Utils.escapeHtml(line)}</span>`;
            } else if (type === 'info') {
                el.innerHTML = `<span class="terminal-info">${Utils.escapeHtml(line)}</span>`;
            } else {
                el.textContent = line;
            }

            output.appendChild(el);
        });

        output.scrollTop = output.scrollHeight;
    },

    executeCommand() {
        const input = document.getElementById('hacking-cmd-input');
        if (!input) return;

        const cmd = input.value.trim().toLowerCase();
        input.value = '';

        if (!cmd) return;

        this.addLine('prompt', cmd);

        if (this.commands[cmd]) {
            if (this.commands[cmd] === '__CLEAR__') {
                const output = document.getElementById('hacking-output');
                if (output) output.innerHTML = '';
                return;
            }
            setTimeout(() => {
                this.addLine('', this.commands[cmd]);
            }, 500);
        } else {
            setTimeout(() => {
                this.addLine('error', `Command not found: ${cmd}. Type "help" for available commands.`);
            }, 200);
        }
    }
};
