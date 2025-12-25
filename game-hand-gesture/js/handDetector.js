// MediaPipe Hand Detector wrapper using Tasks Vision
import { FilesetResolver, HandLandmarker } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0';

export class HandDetector {
    constructor() {
        this.hands = null;
        this.isReady = false;
        this.lastLandmarks = null;
    }

    async init() {
        const resolver = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm');
        this.hands = await HandLandmarker.createFromOptions(resolver, {
            baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task' },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.6,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        this.isReady = true;
        console.log('HandDetector ready');
    }

    detectForVideo(video, timestampMs) {
        if (!this.isReady) return null;
        try {
            const results = this.hands.detectForVideo(video, timestampMs);
            if (results && results.landmarks && results.landmarks.length) {
                this.lastLandmarks = results.landmarks[0];
                return this.lastLandmarks;
            }
        } catch (e) {
            console.error('Hand detect error', e);
        }
        return null;
    }
}
