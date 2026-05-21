// Cameras Application
const CamerasApp = {
    cameras: [
        { id: 1, name: 'CAM 01 - Main Entrance', status: 'online' },
        { id: 2, name: 'CAM 02 - Parking Lot', status: 'online' },
        { id: 3, name: 'CAM 03 - Back Alley', status: 'offline' },
        { id: 4, name: 'CAM 04 - Interior Hall', status: 'online' },
        { id: 5, name: 'CAM 05 - Rooftop', status: 'online' },
        { id: 6, name: 'CAM 06 - Storage Room', status: 'offline' }
    ],

    open() {
        const content = this.render();
        WindowManager.create('cameras', 'Security Cameras', 'video', '#ef4444', content, {
            width: 850,
            height: 550
        });
    },

    render() {
        return `
            <div style="margin:-16px">
                <div class="app-header">
                    <h2><i class="fas fa-video" style="color:var(--error);margin-right:8px"></i>Security Cameras</h2>
                    <div class="app-toolbar">
                        <span style="font-size:12px;color:var(--success)">
                            <i class="fas fa-circle" style="font-size:8px"></i> 
                            ${this.cameras.filter(c => c.status === 'online').length} Online
                        </span>
                        <span style="font-size:12px;color:var(--error);margin-left:12px">
                            <i class="fas fa-circle" style="font-size:8px"></i> 
                            ${this.cameras.filter(c => c.status === 'offline').length} Offline
                        </span>
                    </div>
                </div>
                <div style="padding:16px">
                    <div class="cameras-grid">
                        ${this.cameras.map(cam => `
                            <div class="camera-feed">
                                <span class="cam-label">${cam.name}</span>
                                <span class="cam-status" style="background:${cam.status === 'online' ? 'var(--success)' : 'var(--error)'}"></span>
                                ${cam.status === 'offline' 
                                    ? '<i class="fas fa-video-slash"></i>' 
                                    : '<i class="fas fa-video" style="color:var(--text-muted);opacity:0.3"></i>'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
};
