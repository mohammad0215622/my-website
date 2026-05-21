// Sound Manager
const SoundManager = {
    sounds: {},
    enabled: true,
    volume: 0.5,

    init() {
        this.preload('click', 'sounds/click.ogg');
        this.preload('boot', 'sounds/boot.ogg');
        this.preload('login', 'sounds/login.ogg');
        this.preload('notify', 'sounds/notify.ogg');
        this.preload('error', 'sounds/error.ogg');
        this.preload('shutdown', 'sounds/shutdown.ogg');
    },

    preload(name, src) {
        const audio = new Audio(src);
        audio.volume = this.volume;
        audio.preload = 'auto';
        this.sounds[name] = audio;
    },

    play(name) {
        if (!this.enabled) return;
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0;
            sound.volume = this.volume;
            sound.play().catch(() => {});
        }
    },

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        Object.values(this.sounds).forEach(s => s.volume = this.volume);
    },

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};

SoundManager.init();
