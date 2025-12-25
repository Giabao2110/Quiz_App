import { distance } from './utils.js';

export class GestureRecognizer {
    constructor() {
        this.history = [];
        this.maxHistory = 8;
        this.lastGesture = null;
        this.pinchCounter = 0; // smoothing counter for pinch
        this.pinchThresholdFrames = 2; // require this many frames to confirm
    }

    recognize(landmarks, videoW, videoH) {
        if (!landmarks || landmarks.length === 0) return null;

        // convert normalized to screen points
        const pts = landmarks.map(p => ({ x: p.x * videoW, y: p.y * videoH, z: p.z }));

        const g = this.detectPinch(pts) || this.detectOpenHand(pts) || this.detectFist(pts) || this.detectPoint(pts) || this.detectSwipe(pts);
        if (g) this.record(g, pts[8]);
        return g;
    }

    record(gesture, refPoint) {
        this.history.push({ gesture, x: refPoint.x, y: refPoint.y, t: Date.now() });
        if (this.history.length > this.maxHistory) this.history.shift();
        this.lastGesture = gesture;
    }

    detectPinch(pts) {
        const thumb = pts[4];
        const idx = pts[8];
        const wrist = pts[0];
        const indexMcp = pts[5];
        if (!thumb || !idx || !wrist || !indexMcp) return null;

        // hand size estimate (distance wrist -> index mcp)
        const handSize = distance(wrist, indexMcp) || 1;
        const d = distance(thumb, idx);

        // normalized distance (relative to hand size) is more robust across cameras
        const norm = d / handSize;

        // raw detection
        const rawPinch = norm < 0.5 || d < 40; // either normalized close or small absolute

        // smoothing: require a few consecutive frames
        if (rawPinch) {
            this.pinchCounter = Math.min(this.pinchCounter + 1, 6);
        } else {
            this.pinchCounter = Math.max(0, this.pinchCounter - 1);
        }

        if (this.pinchCounter >= this.pinchThresholdFrames) {
            // once confirmed, reduce counter slightly so we can detect release
            this.pinchCounter = this.pinchThresholdFrames; 
            return 'PINCH';
        }

        return null;
    }

    detectOpenHand(pts) {
        // check index/middle/ring/pinky tips are above wrist (open)
        const wrist = pts[0];
        const tips = [8,12,16,20];
        if (!wrist) return null;
        const open = tips.every(i => pts[i] && pts[i].y < wrist.y - 10);
        return open ? 'OPEN_HAND' : null;
    }

    detectFist(pts) {
        const wrist = pts[0];
        const tips = [8,12,16,20];
        if (!wrist) return null;
        const closed = tips.every(i => pts[i] && pts[i].y > wrist.y - 5);
        return closed ? 'FIST' : null;
    }

    detectPoint(pts) {
        const idx = pts[8];
        const others = [12,16,20];
        if (!idx) return null;
        const pointing = others.every(i => pts[i] && distance(idx, pts[i]) > 60);
        return pointing ? 'POINT' : null;
    }

    detectSwipe(pts) {
        if (this.history.length < 3) return null;
        const recent = this.history.slice(-3);
        const dx = recent[recent.length-1].x - recent[0].x;
        const dy = recent[recent.length-1].y - recent[0].y;
        if (Math.abs(dx) < 60 && Math.abs(dy) < 60) return null;
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'SWIPE_RIGHT' : 'SWIPE_LEFT';
        } else {
            return dy > 0 ? 'SWIPE_DOWN' : 'SWIPE_UP';
        }
    }
}
