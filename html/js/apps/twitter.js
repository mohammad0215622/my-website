// Twitter/Chirper Application
const TwitterApp = {
    tweets: [],
    charCount: 0,

    open() {
        const content = this.render();
        WindowManager.create('twitter', 'Chirper', 'hashtag', '#06b6d4', content, {
            width: 600,
            height: 600
        });
        Utils.nuiCallback('getTwitter');
    },

    render() {
        return `
            <div style="margin:-16px;display:flex;flex-direction:column;height:calc(100% + 32px)">
                <div class="tweet-composer">
                    <textarea placeholder="What's happening?" id="tweet-input" 
                        oninput="TwitterApp.updateCharCount()" maxlength="280"></textarea>
                    <div class="tweet-composer-actions">
                        <span class="tweet-char-count" id="tweet-char-count">0/280</span>
                        <button class="app-btn primary" onclick="TwitterApp.postTweet()">
                            <i class="fas fa-paper-plane"></i> Post
                        </button>
                    </div>
                </div>
                <div class="tweet-list" id="tweet-list">
                    <div style="text-align:center;padding:20px">
                        <div class="loading-spinner" style="margin:0 auto"></div>
                    </div>
                </div>
            </div>
        `;
    },

    updateCharCount() {
        const input = document.getElementById('tweet-input');
        const counter = document.getElementById('tweet-char-count');
        if (input && counter) {
            this.charCount = input.value.length;
            counter.textContent = `${this.charCount}/280`;
            counter.style.color = this.charCount > 260 ? 'var(--error)' : 'var(--text-muted)';
        }
    },

    postTweet() {
        const input = document.getElementById('tweet-input');
        if (!input || !input.value.trim()) {
            Computer.notify('error', 'Tweet cannot be empty');
            return;
        }

        Utils.nuiCallback('postTweet', { content: input.value.trim() });
        input.value = '';
        this.updateCharCount();
    },

    onData(tweets) {
        this.tweets = tweets || [];
        const list = document.getElementById('tweet-list');
        if (!list) return;

        if (this.tweets.length === 0) {
            list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px">No tweets yet. Be the first!</p>';
            return;
        }

        list.innerHTML = this.tweets.map(tweet => `
            <div class="tweet-item">
                <div class="tweet-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="tweet-body">
                    <div class="tweet-header">
                        <span class="tweet-username">${Utils.escapeHtml(tweet.username || 'Anonymous')}</span>
                        <span class="tweet-time">${tweet.created_at ? Utils.formatRelativeTime(tweet.created_at) : ''}</span>
                    </div>
                    <p class="tweet-content">${Utils.escapeHtml(tweet.content || '')}</p>
                    <div class="tweet-actions">
                        <span class="tweet-action"><i class="fas fa-comment"></i> 0</span>
                        <span class="tweet-action"><i class="fas fa-retweet"></i> 0</span>
                        <span class="tweet-action"><i class="fas fa-heart"></i> 0</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
};
