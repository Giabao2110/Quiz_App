## Purpose
Short guidance for AI coding agents working on this repo: a single-file, front-end web app for creating and taking multiple-choice quizzes.

## Big Picture
- Entry point: `index.html` — a single-file HTML app (HTML/CSS/JS all inline). No backend or build system.
- Main flow: Upload / Paste text -> Review parsed questions -> Take quiz -> Result & Review.
- Parsing & heuristics live in the front-end JS: functions like `phanTichVanBan` and `hoanThienCauHoi` produce `danhSachCauHoi`.

## Key files to inspect
- `index.html` — complete app and UI. Edit here for UI, parsing, and behavior.
- `InputSample.txt` — realistic sample input demonstrating parsing edge cases.
- `readme.txt` — project intent and prompts history (useful for regeneration or feature requests).

## Important patterns & conventions
- Single-file mindset: keep changes minimal and contained in `index.html` rather than introducing complex build tooling.
- Vietnamese identifiers and comments are common (e.g., `xuLyNhapLieu`, `danhSachCauHoi`) — preserve names where callers reference them.
- Parsing strategy:
  - Questions often start with `Câu <n>:`; the parser looks for that pattern.
  - Options are expected as `A.`/`B.`/`C.`/`D.` (or `A:` etc.).
  - Correct-answer detection uses keywords like `đáp án đúng`, `đáp án`, `DA` (case-insensitive).
  - Editing or improving parsing: update `phanTichVanBan` and `hoanThienCauHoi` in `index.html`.

## Libraries & integrations
- Uses CDN libraries only: `mammoth.browser.min.js` (for .docx) and `pdf.js` (for .pdf). Keep using CDN links unless adding a build step.
- Google Fonts: `Inter` loaded via Google Fonts.

## Developer workflows
- No build: open `index.html` in Chrome/Edge to run locally.
- To test parsing quickly: paste sample text from `InputSample.txt` into the textarea or upload it as `.txt`.
- To modify behavior: edit JS functions in `index.html`, then reload the page.

## Where to implement common changes
- Improve parser accuracy: edit `phanTichVanBan` and `hoanThienCauHoi`.
- Change UI/UX (Glassmorphism, animations): update the `<style>` block in `index.html`.
- Add new file support: extend `xuLyFile()` to detect and transform new formats.

## Safety & constraints
- Keep the app front-end only. If you introduce server components, document the reason and add a minimal README explaining the new workflow.
- Avoid large dependency trees; prefer CDN-hosted libs for quick edits and portability.

## Examples (how to patch)
- Example: to relax answer-key detection add more keywords in the regex inside `hoanThienCauHoi` (search for `regexTimDapAn`).
- Example: to change the review coloring, edit CSS classes `.review-card.correct`/`.review-card.wrong`.

If any section is unclear or you want a different level of detail (e.g., a short contributor guide, or converting to a multi-file app), tell me which parts to expand. 