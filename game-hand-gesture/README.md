# Hand Gesture Mining Game

Prototype web game using webcam + MediaPipe hand tracking to control a 2D mining game.

Run locally:

1. Serve the folder (from workspace root):

```bash
cd "c:\Users\Gia Bao\Documents\Dạy thêm 2 bé lớp 7 vàà8\App ôn thi\game-hand-gesture"
python -m http.server 8001
```

2. Open http://localhost:8001 in Chrome/Edge and allow camera access.

Notes:
- This is a prototype. Tweak gesture thresholds in `js/gestureRecognizer.js` for your camera/device.
- MediaPipe Tasks Vision CDN is used; model downloads occur at runtime.

How to pick up gold (GẮP / PINCH) — troubleshooting & tips:
- Use a clear background and good lighting for best detection.
- To pick up (gắp) gold, perform a PINCH: bring thumb tip and index tip close together, hold for ~0.2s.
- If the game doesn't grab: move your hand closer/further from the camera so the hand occupies a larger portion of the frame, then try the pinch again.
- If false negatives occur, open `game-hand-gesture/js/gestureRecognizer.js` and adjust `pinchThresholdFrames` (lower to 1 for faster detection) or the normalized threshold in `detectPinch` (increase the 0.5 value to be more permissive).
- Use the on-screen `gesture-display` to confirm the game recognized `PINCH` before expecting collection.

Controls summary:
- Swipe Left / Right: move player
- Swipe Up: jump
- Swipe Down: mine below player
- Pinch (thumb+index): grab nearby gold
- Open Hand: stop
- Fist: hold position

Camera rotation & mirroring troubleshooting:
- If the camera image appears upside-down, use the `Rotate` button to cycle through `0°/90°/180°/270°` until the video is upright.
- If the image looks mirrored left/right, toggle `Mirror Camera` to match your natural webcam view.
- The game applies the same rotation and mirroring to the internal landmark coordinates so gestures map to what you see on-screen.

