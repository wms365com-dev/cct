# Maple Mentor

Interactive Canadian citizenship practice app built as a static site.

Official source:
https://www.canada.ca/content/dam/ircc/migration/ircc/english/pdf/pub/discover-large.pdf

## What it includes

- Responsive mobile and desktop layout
- Study Deck, Quiz Sprint, and Mock Test modes
- Built-in text-to-speech for reading questions aloud
- Optional voice command support in browsers that expose Web Speech recognition
- Local progress tracking with saved cards and session stats
- Questions aligned to the official Discover Canada study guide
- Spanish translation support for current cards plus Spanish read-aloud study help

## Files

- `index.html` - app shell
- `styles.css` - responsive styling
- `questions.js` - practice question bank
- `translations.js` - Spanish translations for the practice cards
- `app.js` - quiz logic, audio controls, and progress tracking

## Run it

Open `index.html` in a modern browser.

For the best audio experience, use a browser with Web Speech support such as current Edge or Chrome.

## Next upgrade ideas

- Add French audio and bilingual question sets
- Expand the question bank and explanations
- Add a dedicated review mode for saved cards only
- Package it as a PWA for installable home screen use
