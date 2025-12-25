import { HandDetector } from './handDetector.js';
import { GestureRecognizer } from './gestureRecognizer.js';
import { GameEngine } from './gameEngine.js';
import { UIManager } from './ui.js';

class HandGestureGame {
    constructor(){
        this.video = document.getElementById('video');
        this.videoCanvas = document.getElementById('video-canvas');
        this.vctx = this.videoCanvas.getContext('2d');
        this.handDetector = new HandDetector();
        this.gestureRecognizer = new GestureRecognizer();
        this.gameEngine = new GameEngine(640,480);
        this.ui = new UIManager();
        this.lastTime = Date.now();
        this.mirror = true; // default: mirror camera for natural webcam feel
        this.rotation = 0; // 0, 90, 180, 270 degrees
        this.init();
    }
    async init(){
        try{ const stream = await navigator.mediaDevices.getUserMedia({ video:{ width:640, height:480 } }); this.video.srcObject = stream; this.video.onloadedmetadata = ()=>{ this.video.play(); this.startLoop(); }; }
        catch(e){ alert('Camera required: '+e.message); return; }
        await this.handDetector.init();

        // Restart button
        document.getElementById('restart-btn').addEventListener('click', ()=>{ this.gameEngine.reset(); this.ui.hideGameOver(); document.getElementById('restart-btn').classList.add('hidden'); });

        // Mirror toggle button (flip camera + logical coordinates)
        const mirrorBtn = document.getElementById('mirror-toggle');
        if (mirrorBtn) {
            const setLabel = () => { mirrorBtn.textContent = this.mirror ? '🔁 Mirror: ON' : '🔁 Mirror: OFF'; };
            setLabel();
            mirrorBtn.addEventListener('click', () => { this.mirror = !this.mirror; setLabel(); });
        }

        // Rotate toggle button (cycle 0 -> 90 -> 180 -> 270)
        const rotateBtn = document.getElementById('rotate-toggle');
        if (rotateBtn) {
            const setRotLabel = () => { rotateBtn.textContent = `⤾ Rotate: ${this.rotation}°`; };
            setRotLabel();
            rotateBtn.addEventListener('click', () => { this.rotation = (this.rotation + 90) % 360; setRotLabel(); });
        }
    }
    startLoop(){ const loop = ()=>{ const now = Date.now(); const dt = (now - this.lastTime)/1000; this.lastTime = now; // draw video frame to canvas
                // draw webcam frame to canvas with rotation + mirror and compute transformed landmarks
                const vw = this.videoCanvas.width;
                const vh = this.videoCanvas.height;

                // draw video with rotation and optional mirror
                this.vctx.save();
                if (this.rotation === 0) {
                    if (this.mirror) { this.vctx.translate(vw, 0); this.vctx.scale(-1, 1); }
                    this.vctx.drawImage(this.video, 0, 0, vw, vh);
                } else if (this.rotation === 90) {
                    this.vctx.translate(vw, 0);
                    this.vctx.rotate(Math.PI / 2);
                    if (this.mirror) { this.vctx.translate(vh, 0); this.vctx.scale(-1, 1); }
                    this.vctx.drawImage(this.video, 0, 0, vh, vw);
                } else if (this.rotation === 180) {
                    this.vctx.translate(vw, vh);
                    this.vctx.rotate(Math.PI);
                    if (this.mirror) { this.vctx.translate(vw, 0); this.vctx.scale(-1, 1); }
                    this.vctx.drawImage(this.video, 0, 0, vw, vh);
                } else if (this.rotation === 270) {
                    this.vctx.translate(0, vh);
                    this.vctx.rotate(-Math.PI / 2);
                    if (this.mirror) { this.vctx.translate(vh, 0); this.vctx.scale(-1, 1); }
                    this.vctx.drawImage(this.video, 0, 0, vh, vw);
                } else {
                    // fallback
                    if (this.mirror) { this.vctx.translate(vw, 0); this.vctx.scale(-1, 1); }
                    this.vctx.drawImage(this.video, 0, 0, vw, vh);
                }
                this.vctx.restore();

                // get raw landmarks from detector
                const rawLandmarks = this.handDetector.detectForVideo(this.video, now);
                let landmarks = null;
                if (rawLandmarks) {
                    // transform normalized landmarks according to rotation and mirror so they match the visual
                    const transform = (l) => {
                        let x = l.x, y = l.y;
                        let tx, ty;
                        switch (this.rotation) {
                            case 0: tx = x; ty = y; break;
                            case 90: tx = y; ty = 1 - x; break;
                            case 180: tx = 1 - x; ty = 1 - y; break;
                            case 270: tx = 1 - y; ty = x; break;
                            default: tx = x; ty = y;
                        }
                        if (this.mirror) tx = 1 - tx;
                        return { x: tx, y: ty, z: l.z, visibility: l.visibility };
                    };
                    landmarks = rawLandmarks.map(transform);
                }

                if (landmarks) {
                    this.drawLandmarks(landmarks);
                    const gesture = this.gestureRecognizer.recognize(landmarks, this.video.videoWidth, this.video.videoHeight);
                    if (gesture) { this.gameEngine.handleGesture(gesture); this.ui.showGesture(gesture); }
                }
            this.gameEngine.update(dt); this.gameEngine.draw(); const st = this.gameEngine.getState(); this.ui.updateStats(st.level, st.coins, st.score);
            if(this.gameEngine.score > 5000 && !this.gameEngine.isGameOver){ this.gameEngine.isGameOver=true; this.ui.showGameOver(this.gameEngine.score, Math.floor(this.gameEngine.coins)); document.getElementById('restart-btn').classList.remove('hidden'); }
            requestAnimationFrame(loop);
        }; loop(); }
    drawLandmarks(landmarks){ const w = this.video.videoWidth; const h = this.video.videoHeight; const conns = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20]]; this.vctx.strokeStyle='rgba(0,255,0,0.6)'; this.vctx.lineWidth=2; conns.forEach(([s,e])=>{ const a = landmarks[s]; const b = landmarks[e]; this.vctx.beginPath(); this.vctx.moveTo(a.x*w,a.y*h); this.vctx.lineTo(b.x*w,b.y*h); this.vctx.stroke(); }); this.vctx.fillStyle='rgba(255,0,0,0.8)'; landmarks.forEach(l=>{ this.vctx.beginPath(); this.vctx.arc(l.x*w,l.y*h,4,0,Math.PI*2); this.vctx.fill(); }); }
}

new HandGestureGame();
