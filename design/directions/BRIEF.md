# I2D alternative design directions: shared brief

Inspiration 2 Dance (I2D) is a ballroom and Latin dance studio in a listed 1920s speakeasy ballroom at The Dilly, Floor C, 21 Piccadilly, London W1J 0BH. The owner has seen the current redesign mockup (`/home/leith/I2D-web/design/index.html`, `book.html`, `studio-hire.html`, CSS in `design/assets/site.css`) and says "I don't hate it, but not fully convinced". They want to see OTHER directions they could pivot to. You are building ONE of those directions.

## What to build
A single self-contained page at `design/directions/<slug>/index.html` (+ its own `style.css` and an optional small `script.js` in the same folder). Don't touch anything outside your folder, except you may ADD font files to `design/assets/fonts/`. It's a "direction board" page: a full homepage design that also shows, as sections on the same page:
1. Hero + navigation (mobile menu should work)
2. Ways to dance / offers (taster £40 for 30 min, private lesson £105 for 60 min, 5 hour package £495, 10 hour package £950, group classes, wedding first dance, Pro-Am and IDTA exams)
3. A booking widget section (pick lesson type, teacher, date strip, time slots, summary with price). Interactive in vanilla JS is a plus but keep it short; static is fine.
4. A studio hire section: shared floor hire £22 per 60 min (45 or 60 min slots, book at least 12 h ahead, cancel up to 24 h before), exclusive hire on request; rooms: Main room 9×15 m (chandeliers, painted ceiling), Small room 10×10 m, Balcony with 3 seating areas overlooking the floor. Show a slot-availability picker.
5. Team strip (8 teachers, photos below), visit/contact info, footer.
Hours: Mon to Fri 10:00 to 21:45, Sat and Sun 10:00 to 19:45. Phone 07711 652 875, info@inspiration2dance.com. Styles: Ballroom, Latin, American Smooth, Salsa, Argentine Tango. Since 2015. Teachers: Viktoriya Wilton (lead), Byron Rowe, Roman Sukhomlyn, Olga Gandembul, Maksym Svyatobatko, Oleksandr Kutniakov, Anastasia Sheptitskaya, Oleksandr Yasynskyi.

Read `design/index.html` for existing copy you can reuse. Don't invent facts (no fake reviews, awards, sprung floors, prices not listed above). Sample timetable/availability data is fine.

## Assets (relative path from your page: `../../assets/...`)
Images in `assets/img/`: social-night.webp (social dance in the ballroom, bright), ballroom-ceiling.webp, ballroom-floor.webp, red-dresses.webp, competition-ballroom.webp, competition-latin.webp, gala-waltz.webp, i2d-logo.png (orange/red "i2D" with dancer), team-<slug>.webp (4:5 headshots, slugs: viktoriya-wilton byron-rowe roman-sukhomlyn olga-gandembul maksym-svyatobatko oleksandr-kutniakov anastasia-sheptitskaya oleksandr-yasynskyi). Fonts in `assets/fonts/` (Bodoni Moda, DM Sans woff2). You may download other open fonts (e.g. from cdn.jsdelivr.net/fontsource/fonts/<name>@latest/latin-wght-normal.woff2) into assets/fonts with a direction-specific name. Self-host only, no Google Fonts links.

## Brand constraints
- Keep the I2D flame orange (#e8501c; use a deeper #c4380f for text/buttons on light for contrast) and the logo. Everything else is open.
- Owner's taste (from their other sites): rounded-rectangle option cards with no separator lines; elevated white controls; Chrome-style tabs; primary + ghost CTA pairs; text fills its card (no narrow max-width caps inside cards). AVOID: left-border callout boxes, yellow/amber/gold anywhere, em dashes in copy, wordy copy, generic "AI design" tells (purple gradients, glassmorphism blobs, emoji icons, centred everything, "Elevate your..." copy, three identical icon cards).
- Must look like a real, considered studio site. Minimal copy, British English.
- Add `<meta name="robots" content="noindex">`.
- Responsive: must look good at 1440px and 390px wide.

## Verify
A static server already serves `design/` at http://localhost:8765/ (if it's down: `cd /home/leith/I2D-web/design && python3 -m http.server 8765 &`). Screenshot with `/tmp/shoot.sh <url> <out.png> <width> <height>` (headless Chrome; e.g. 1440x5000 and 390x9000), then view crops (split tall shots into ~1800px slices with PIL, e.g. `python3 - <<EOF ... EOF` run from /home/leith/I2D-web). Fix anything broken, cramped, overflowing or ugly. Iterate at least twice.

## Efficiency
Every turn re-reads the whole conversation, so turn count is the cost. Batch independent tool calls in one turn. Grep or outline big files before reading, and pull all ranges you need at once.

## Report back
A few lines: the direction's idea, fonts/palette used, and anything you'd flag. Do not git commit.
