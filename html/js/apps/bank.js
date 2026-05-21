// Bank Application
const BankApp = {
    balance: 0,
    transactions: [],
    showTransfer: false,

    open() {
        const content = this.render();
        WindowManager.create('bank', 'Bank - Maze Bank', 'building-columns', '#10b981', content, {
            width: 700,
            height: 550
        });
        Utils.nuiCallback('getBank');
    },

    render() {
        return `
            <div style="padding:4px">
                <div class="bank-balance">
                    <h3>Available Balance</h3>
                    <div class="balance-amount" id="bank-balance-display">$0</div>
                </div>
                <div style="display:flex;gap:8px;margin-bottom:16px">
                    <button class="app-btn primary" onclick="BankApp.toggleTransfer()">
                        <i class="fas fa-paper-plane"></i> Transfer
                    </button>
                    <button class="app-btn" onclick="Utils.nuiCallback('getBank')">
                        <i class="fas fa-refresh"></i> Refresh
                    </button>
                </div>
                <div id="bank-transfer-form" class="hidden">
                    <div class="transfer-form">
                        <input type="text" class="app-input" id="transfer-target" placeholder="Recipient ID">
                        <input type="number" class="app-input" id="transfer-amount" placeholder="Amount ($)">
                        <input type="text" class="app-input" id="transfer-note" placeholder="Note (optional)">
                        <div style="display:flex;gap:8px">
                            <button class="app-btn primary" onclick="BankApp.doTransfer()">
                                <i class="fas fa-check"></i> Confirm
                            </button>
                            <button class="app-btn" onclick="BankApp.toggleTransfer()">Cancel</button>
                        </div>
                    </div>
                </div>
                <h3 style="color:var(--text-primary);font-size:14px;margin-bottom:12px">Recent Transactions</h3>
                <div class="bank-transactions" id="bank-transactions-list">
                    <p style="color:var(--text-muted);text-align:center;padding:20px">Loading...</p>
                </div>
            </div>
        `;
    },

    toggleTransfer() {
        this.showTransfer = !this.showTransfer;
        const form = document.getElementById('bank-transfer-form');
        if (form) form.classList.toggle('hidden');
    },

    doTransfer() {
        const target = document.getElementById('transfer-target')?.value;
        const amount = document.getElementById('transfer-amount')?.value;
        const note = document.getElementById('transfer-note')?.value;

        if (!target || !amount || amount <= 0) {
            Computer.notify('error', 'Please fill in recipient and amount');
            return;
        }

        Utils.nuiCallback('bankTransfer', { targetId: target, amount: parseFloat(amount), note });
        this.toggleTransfer();
    },

    onData(data) {
        this.balance = data.balance || 0;
        this.transactions = data.transactions || [];

        const balanceEl = document.getElementById('bank-balance-display');
        if (balanceEl) balanceEl.textContent = Utils.formatCurrency(this.balance);

        const listEl = document.getElementById('bank-transactions-list');
        if (listEl) {
            if (this.transactions.length === 0) {
                listEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">No transactions</p>';
            } else {
                listEl.innerHTML = this.transactions.map(tx => `
                    <div class="bank-transaction">
                        <div class="tx-info">
                            <span class="tx-type">${Utils.escapeHtml(tx.type || 'Transaction')}</span>
                            <span class="tx-date">${tx.created_at ? Utils.formatRelativeTime(tx.created_at) : ''}</span>
                        </div>
                        <span class="tx-amount ${tx.type === 'transfer_out' ? 'negative' : 'positive'}">
                            ${tx.type === 'transfer_out' ? '-' : '+'}${Utils.formatCurrency(tx.amount || 0)}
                        </span>
                    </div>
                `).join('');
            }
        }
    }
};
