// Utility helpers
export function distance(p1, p2) { const dx = p1.x - p2.x; const dy = p1.y - p2.y; return Math.sqrt(dx*dx + dy*dy); }
export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
export function randomRange(min, max) { return Math.random() * (max - min) + min; }
